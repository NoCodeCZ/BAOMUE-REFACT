import directus, { getFileUrl } from './directus';
import { readItems, readSingleton } from '@directus/sdk';
import { logDirectusError } from './errors';

// Type-safe wrappers to handle collections that may not exist yet
const readItemsTyped = readItems as any;
const readSingletonTyped = readSingleton as any;
import type {
  Page,
  BlockHero,
  BlockFeatures,
  BlockTestimonials,
  BlockPricing,
  BlockFooter,
  BlockAboutUs,
  BlockWhyChooseUs,
  BlockTeam,
  BlockSignatureTreatment,
  BlockSafetyBanner,
  BlockServices,
  BlockLocations,
  BlockBooking,
  BlockContact,
  BlockText,
  BlockForm,
  Form,
  PageFeature,
  PageTestimonial,
  PagePricingPlan,
  GlobalSettings,
  Promotion,
  PromotionCategory,
  BlockPromotions,
  PageBlock,
  Service,
  ServiceCategory,
  NavigationItem,
  BlogPost,
  BlogCategory,
  BlockBlogListing,
  PortfolioCase,
  PortfolioCategory,
  BlockPortfolio,
  BlockStats
} from './types';

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pages = await directus.request(
      readItemsTyped('pages', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['id', 'title', 'slug', 'status'], // Only fields actually used
        limit: 1,
      })
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    return pages[0] as Page;
  } catch (error) {
    logDirectusError('getPageBySlug', error);
    return null;
  }
}

export async function getPageBlocks(pageId: number) {
  try {
    const blocks = await directus.request(
      readItemsTyped('page_blocks', {
        filter: { page: { _eq: pageId } },
        fields: ['id', 'page', 'collection', 'item', 'sort'], // Optimized: only fetch needed fields
        sort: ['sort'],
      })
    );

    return blocks || [];
  } catch (error) {
    logDirectusError('getPageBlocks', error);
    return [];
  }
}

export async function getBlockContent(collection: string, itemId: string) {
  try {
    // Special handling for blocks with relations
    // Note: Directus field selection can be string array or nested object
    let fields: string[] | any = ['*'];

    if (collection === 'block_service_detail') {
      fields = ['*', 'service.*', 'service.hero_image.*'];
    } else if (collection === 'block_team') {
      // Include M2M dentists relation with all fields
      // M2M returns junction records, need to expand dentist_id to get actual dentist data
      fields = [
        'id',
        'title',
        'subtitle',
        'note',
        'dentists.dentist_id.id',
        'dentists.dentist_id.name',
        'dentists.dentist_id.nickname',
        'dentists.dentist_id.specialty',
        'dentists.dentist_id.photo',
        'dentists.dentist_id.photo_url',
        'dentists.dentist_id.linkedin_url',
        'dentists.dentist_id.status',
        'dentists.sort',
      ];
    }

    const result = await directus.request(
      readItemsTyped(collection as string, {
        filter: { id: { _eq: parseInt(itemId) } },
        fields,
        limit: 1,
      })
    );

    return result?.[0] || null;
  } catch (error) {
    logDirectusError(`getBlockContent(${collection})`, error);
    return null;
  }
}

import type { PageBlockWithContent, BlockType } from './types';

/**
 * Optimized function to fetch page with all blocks in a single query
 * This replaces the N+1 query pattern (1 + 1 + N queries → 1 query)
 * 
 * Note: Directus M2A relationships may require alternative approach if nested query fails.
 * Fallback: Returns null if query structure is unsupported by Directus.
 */
export async function getPageWithBlocks(slug: string): Promise<{ page: Page; blocks: PageBlockWithContent[] } | null> {
  try {
    // Attempt optimized nested query
    // If this fails, we'll fall back to the original pattern in the calling code
    const pages = await directus.request(
      readItemsTyped('pages', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: [
          '*',
          {
            blocks: [
              'id',
              'collection',
              'item',
              'sort',
              // Note: Directus M2A nested queries may have limitations
              // If this doesn't work, we'll use batch query approach instead
            ],
          },
        ],
        limit: 1,
      })
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0] as Page;

    // If nested blocks query worked, process the blocks
    // Otherwise, fall back to separate queries (handled by try-catch)
    if (page.blocks && Array.isArray(page.blocks)) {
      // Process nested block data
      // This structure depends on Directus M2A query response format
      // Note: Directus M2A nested queries may not return item_data directly
      // If this doesn't work, we'll need to fetch block content separately
      const blocks: PageBlockWithContent[] = (page.blocks as any[]).map((block: any) => {
        // For now, content will be null - we'll need to fetch it separately
        // This is a limitation of Directus M2A nested queries
        return {
          id: block.id,
          page: page.id,
          collection: block.collection as BlockType,
          item: block.item,
          sort: block.sort || 0,
          content: null, // Will be fetched separately if nested query doesn't provide it
        };
      });

      // If nested query didn't provide content, fetch it separately
      // This is still better than the original N+1 pattern if we can batch
      for (const block of blocks) {
        if (!block.content) {
          block.content = await getBlockContent(block.collection, block.item);
        }
      }

      return { page, blocks };
    }

    // Fallback: If nested query didn't return block data, use separate queries
    // This ensures backward compatibility
    return null; // Signal to use fallback approach
  } catch (error) {
    // If nested query fails, return null to trigger fallback
    logDirectusError('getPageWithBlocks (nested query failed, will use fallback)', error);
    return null;
  }
}

/**
 * Batch-optimized version: Fetches all block content in parallel batches
 * This is a fallback if nested queries don't work with M2A relationships
 * Still better than sequential queries: 1 + 1 + N → 1 + 1 + (N/5 batches)
 */
export async function getPageWithBlocksBatched(slug: string): Promise<{ page: Page; blocks: PageBlockWithContent[] } | null> {
  try {
    const page = await getPageBySlug(slug);
    if (!page) return null;

    const pageBlocks = await getPageBlocks(page.id);
    if (!pageBlocks || pageBlocks.length === 0) {
      return { page, blocks: [] };
    }

    // Batch block content fetching (5 blocks at a time to avoid overwhelming Directus)
    const BATCH_SIZE = 5;
    const batches: typeof pageBlocks[] = [];
    for (let i = 0; i < pageBlocks.length; i += BATCH_SIZE) {
      batches.push(pageBlocks.slice(i, i + BATCH_SIZE));
    }

    const allBlocks: PageBlockWithContent[] = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (block: PageBlock) => ({
          ...block,
          collection: block.collection as BlockType,
          content: await getBlockContent(block.collection, block.item),
        }))
      );
      allBlocks.push(...(batchResults as PageBlockWithContent[]));
    }

    return { page, blocks: allBlocks };
  } catch (error) {
    logDirectusError('getPageWithBlocksBatched', error);
    return null;
  }
}

export async function getHeroBlock(blockId: number): Promise<BlockHero | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_hero', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockHero || null;
  } catch (error) {
    logDirectusError('getHeroBlock', error);
    return null;
  }
}

export async function getFeaturesBlock(blockId: number): Promise<BlockFeatures | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_features', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockFeatures || null;
  } catch (error) {
    logDirectusError('getFeaturesBlock', error);
    return null;
  }
}

export async function getTestimonialsBlock(blockId: number): Promise<BlockTestimonials | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_testimonials', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockTestimonials || null;
  } catch (error) {
    logDirectusError('getTestimonialsBlock', error);
    return null;
  }
}

export async function getPricingBlock(blockId: number): Promise<BlockPricing | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_pricing', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockPricing || null;
  } catch (error) {
    logDirectusError('getPricingBlock', error);
    return null;
  }
}

export async function getFooterBlock(blockId: number): Promise<BlockFooter | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_footer', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockFooter || null;
  } catch (error) {
    logDirectusError('getFooterBlock', error);
    return null;
  }
}

export async function getPageFeatures(pageId: number): Promise<PageFeature[]> {
  try {
    const features = await directus.request(
      readItemsTyped('page_features', {
        filter: { page: { _eq: pageId } },
        fields: ['*'],
        sort: ['sort'],
      })
    );
    return (features || []) as PageFeature[];
  } catch (error) {
    logDirectusError('getPageFeatures', error);
    return [];
  }
}

export async function getPageTestimonials(pageId: number): Promise<PageTestimonial[]> {
  try {
    const testimonials = await directus.request(
      readItemsTyped('page_testimonials', {
        filter: { page: { _eq: pageId } },
        fields: ['*'],
        sort: ['sort'],
      })
    );
    return (testimonials || []) as PageTestimonial[];
  } catch (error) {
    logDirectusError('getPageTestimonials', error);
    return [];
  }
}

export async function getPagePricingPlans(pageId: number): Promise<PagePricingPlan[]> {
  try {
    const plans = await directus.request(
      readItemsTyped('page_pricing_plans', {
        filter: { page: { _eq: pageId } },
        fields: ['*'],
        sort: ['sort'],
      })
    );
    return (plans || []) as PagePricingPlan[];
  } catch (error) {
    logDirectusError('getPagePricingPlans', error);
    return [];
  }
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const settings = await directus.request(
      readSingletonTyped('global_settings', {
        fields: ['id', 'site_name', 'site_description', 'logo', 'favicon'],
      })
    );
    return settings as GlobalSettings || null;
  } catch (error) {
    logDirectusError('getGlobalSettings', error);
    return null;
  }
}

export async function getAboutUsBlock(blockId: number): Promise<BlockAboutUs | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_about_us', {
        filter: { id: { _eq: blockId } },
        fields: ['*', 'image_url.*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockAboutUs || null;
  } catch (error) {
    logDirectusError('getAboutUsBlock', error);
    return null;
  }
}

export async function getWhyChooseUsBlock(blockId: number): Promise<BlockWhyChooseUs | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_why_choose_us', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockWhyChooseUs || null;
  } catch (error) {
    logDirectusError('getWhyChooseUsBlock', error);
    return null;
  }
}

export async function getTeamBlock(blockId: number): Promise<BlockTeam | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_team', {
        filter: { id: { _eq: blockId } },
        fields: [
          'id',
          'title',
          'subtitle',
          'note',
          'dentists.dentist_id.id',
          'dentists.dentist_id.name',
          'dentists.dentist_id.nickname',
          'dentists.dentist_id.specialty',
          'dentists.dentist_id.photo',
          'dentists.dentist_id.photo_url',
          'dentists.dentist_id.linkedin_url',
          'dentists.dentist_id.status',
          'dentists.sort',
        ],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockTeam || null;
  } catch (error) {
    logDirectusError('getTeamBlock', error);
    return null;
  }
}

export async function getSignatureTreatmentBlock(blockId: number): Promise<BlockSignatureTreatment | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_signature_treatment', {
        filter: { id: { _eq: blockId } },
        fields: ['*', 'before_image_url.*', 'month3_image_url.*', 'month6_image_url.*', 'after_image_url.*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockSignatureTreatment || null;
  } catch (error) {
    logDirectusError('getSignatureTreatmentBlock', error);
    return null;
  }
}

export async function getSafetyBannerBlock(blockId: number): Promise<BlockSafetyBanner | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_safety_banner', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockSafetyBanner || null;
  } catch (error) {
    logDirectusError('getSafetyBannerBlock', error);
    return null;
  }
}

export async function getServicesBlock(blockId: number): Promise<BlockServices | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_services', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockServices || null;
  } catch (error) {
    logDirectusError('getServicesBlock', error);
    return null;
  }
}

export async function getLocationsBlock(blockId: number): Promise<BlockLocations | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_locations', {
        filter: { id: { _eq: blockId } },
        fields: ['*', 'branch_image_url.*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockLocations || null;
  } catch (error) {
    logDirectusError('getLocationsBlock', error);
    return null;
  }
}

export async function getBookingBlock(blockId: number): Promise<BlockBooking | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_booking', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockBooking || null;
  } catch (error) {
    logDirectusError('getBookingBlock', error);
    return null;
  }
}

export async function getContactBlock(blockId: number): Promise<BlockContact | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_contact', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockContact || null;
  } catch (error) {
    logDirectusError('getContactBlock', error);
    return null;
  }
}

export async function getTextBlock(blockId: number): Promise<BlockText | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_text', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockText || null;
  } catch (error) {
    logDirectusError('getTextBlock', error);
    return null;
  }
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const categories = await directus.request(
      readItemsTyped('service_categories', {
        fields: ['id', 'name', 'slug', 'description', 'icon_name', 'sort'],
        sort: ['sort', 'name'],
      })
    );
    return (categories || []) as ServiceCategory[];
  } catch (error) {
    logDirectusError('getServiceCategories', error);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const services = await directus.request(
      readItemsTyped('services', {
        filter: { status: { _eq: 'published' } },
        fields: [
          'id', 'name', 'slug', 'status', 'short_description', 'long_description',
          'duration_label', 'price_from', 'hero_image', 'seo_title', 'seo_description',
          'highlights', 'category'
        ],
        sort: ['name'],
      })
    );
    return (services || []) as Service[];
  } catch (error) {
    logDirectusError('getServices', error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const services = await directus.request(
      readItemsTyped('services', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['*', 'category.*', 'hero_image.*'],
        limit: 1,
      })
    );
    return (services?.[0] as Service) || null;
  } catch (error) {
    logDirectusError('getServiceBySlug', error);
    return null;
  }
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const items = await directus.request(
      readItemsTyped('navigation', {
        fields: ['*', 'page.slug', 'page.id', 'children.*', 'children.page.slug', 'children.page.id'],
        sort: ['sort', 'id'], // Secondary sort by ID ensures consistent ordering when sort values are duplicate
        filter: { parent: { _null: true } }, // Only get top-level items
      })
    ) as NavigationItem[];

    // Validate for duplicate sort values (development warning)
    if (process.env.NODE_ENV === 'development') {
      const sortValues = items.map(item => item.sort).filter((sort): sort is number => sort !== null && sort !== undefined);
      const duplicates = sortValues.filter((value, index) => sortValues.indexOf(value) !== index);
      if (duplicates.length > 0) {
        const uniqueDuplicates = Array.from(new Set(duplicates));
        console.warn(
          '⚠️ Navigation: Duplicate sort values detected:',
          uniqueDuplicates,
          '. This may cause unpredictable ordering. Please ensure unique sort values in Directus.'
        );
      }
    }

    // Process navigation items to build proper structure
    const processedItems = items.map((item) => {
      const navItem: NavigationItem = {
        id: item.id,
        title: item.title,
        url: item.url || null,
        target: item.target || '_self',
        sort: item.sort || null,
        page: item.page ? (typeof item.page === 'object' ? item.page : null) : null,
        parent: null,
        children: item.children ? item.children.map((child: NavigationItem) => ({
          id: child.id,
          title: child.title,
          url: child.url || null,
          target: child.target || '_self',
          sort: child.sort || null,
          page: child.page ? (typeof child.page === 'object' ? child.page : null) : null,
          parent: item.id,
          children: [],
        })) : [],
      };
      return navItem;
    });

    // Additional client-side sorting as fallback to ensure correct order
    // This handles cases where sort values might be null or database sorting is inconsistent
    processedItems.sort((a, b) => {
      // First sort by sort value (null/undefined treated as Infinity)
      const sortA = a.sort ?? Infinity;
      const sortB = b.sort ?? Infinity;
      if (sortA !== sortB) {
        return sortA - sortB;
      }
      // If sort values are equal (or both null), sort by ID for consistency
      return a.id - b.id;
    });

    return processedItems;
  } catch (error) {
    logDirectusError('getNavigationItems', error);
    return [];
  }
}

// Helper function to get the URL for a navigation item
export function getNavigationUrl(item: NavigationItem): string {
  // If external URL is provided, use it
  if (item.url) {
    return item.url;
  }

  // If linked to a page, use the page slug
  if (item.page) {
    if (typeof item.page === 'object' && item.page.slug) {
      return `/${item.page.slug === 'home' ? '' : item.page.slug}`;
    }
  }

  // Fallback to #
  return '#';
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await directus.request(
      readItemsTyped('blog_categories', {
        fields: ['id', 'name', 'slug', 'description', 'color', 'sort'],
        sort: ['sort'],
      })
    );
    return (categories || []) as BlogCategory[];
  } catch (error) {
    logDirectusError('getBlogCategories', error);
    return [];
  }
}

export async function getBlogPosts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<BlogPost[]> {
  try {
    const filter: any = { status: { _eq: 'published' } };

    if (options?.category) {
      filter.category = { slug: { _eq: options.category } };
    }

    if (options?.featured !== undefined) {
      filter.is_featured = { _eq: options.featured };
    }

    if (options?.search) {
      filter._or = [
        { title: { _icontains: options.search } },
        { excerpt: { _icontains: options.search } },
        { content: { _icontains: options.search } },
      ];
    }

    const posts = await directus.request(
      readItemsTyped('blog_posts', {
        filter,
        fields: [
          'id', 'title', 'slug', 'status', 'excerpt', 'content',
          'author_name', 'author_role', 'author_avatar',
          'published_date', 'reading_time', 'views', 'is_featured', 'tags',
          'category', 'featured_image'
        ],
        sort: ['-published_date'],
        limit: options?.limit || 100,
      })
    );
    return (posts || []) as BlogPost[];
  } catch (error) {
    logDirectusError('getBlogPosts', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Decode URI-encoded slug to handle Thai characters
    const decodedSlug = decodeURIComponent(slug);

    const posts = await directus.request(
      readItemsTyped('blog_posts', {
        filter: { slug: { _eq: decodedSlug }, status: { _eq: 'published' } },
        fields: [
          'id', 'title', 'slug', 'status', 'excerpt', 'content',
          'author_name', 'author_role', 'author_avatar',
          'published_date', 'reading_time', 'views', 'is_featured', 'tags',
          'seo_title', 'seo_description',
          'category', 'featured_image'
        ],
        limit: 1,
      })
    );
    return (posts?.[0] as BlogPost) || null;
  } catch (error) {
    logDirectusError('getBlogPostBySlug', error);
    return null;
  }
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  try {
    const posts = await directus.request(
      readItemsTyped('blog_posts', {
        filter: {
          is_featured: { _eq: true },
          status: { _eq: 'published' }
        },
        fields: [
          'id', 'title', 'slug', 'status', 'excerpt', 'content',
          'author_name', 'author_role', 'author_avatar',
          'published_date', 'reading_time', 'views', 'is_featured',
          'category', 'featured_image'
        ],
        sort: ['-published_date'],
        limit: 1,
      })
    );
    return (posts?.[0] as BlogPost) || null;
  } catch (error) {
    logDirectusError('getFeaturedBlogPost', error);
    return null;
  }
}

export async function getFormBlock(blockId: number): Promise<BlockForm | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_form', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockForm || null;
  } catch (error) {
    logDirectusError('getFormBlock', error);
    return null;
  }
}

export async function getFormById(formId: number): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { id: { _eq: formId } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form || null;
  } catch (error) {
    logDirectusError('getFormById', error);
    return null;
  }
}

export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form || null;
  } catch (error) {
    logDirectusError('getFormBySlug', error);
    return null;
  }
}

// Stats block function
export async function getStatsBlock(blockId: number): Promise<BlockStats | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_stats', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockStats || null;
  } catch (error) {
    logDirectusError('getStatsBlock', error);
    return null;
  }
}

// Service detail block function
export async function getServiceDetailBlock(blockId: number): Promise<import('./types').BlockServiceDetail | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_service_detail', {
        filter: { id: { _eq: blockId } },
        fields: ['*', 'service.*', 'service.hero_image.*'],
        limit: 1,
      })
    );
    return blocks?.[0] as import('./types').BlockServiceDetail || null;
  } catch (error) {
    logDirectusError('getServiceDetailBlock', error);
    return null;
  }
}

// Blog listing block function
export async function getBlogListingBlock(blockId: number): Promise<BlockBlogListing | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_blog_listing', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockBlogListing || null;
  } catch (error) {
    logDirectusError('getBlogListingBlock', error);
    return null;
  }
}

// Promotion functions
export async function getPromotionCategories(): Promise<PromotionCategory[]> {
  try {
    const categories = await directus.request(
      readItemsTyped('promotion_categories', {
        fields: ['*'],
        sort: ['sort', 'name'],
      })
    );
    return (categories || []) as PromotionCategory[];
  } catch (error) {
    logDirectusError('getPromotionCategories', error);
    return [];
  }
}

export async function getPromotions(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Promotion[]> {
  try {
    const filter: any = { status: { _eq: 'published' } };

    if (options?.category) {
      filter.category = { slug: { _eq: options.category } };
    }

    if (options?.featured !== undefined) {
      filter.is_featured = { _eq: options.featured };
    }

    const promotions = await directus.request(
      readItemsTyped('promotions', {
        filter,
        fields: ['*', 'category.*', 'featured_image.*'],
        sort: ['sort'],
        limit: options?.limit || 100,
      })
    );
    return (promotions || []) as Promotion[];
  } catch (error) {
    logDirectusError('getPromotions', error);
    return [];
  }
}

export async function getPromotionsBlock(blockId: number): Promise<BlockPromotions | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_promotions', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockPromotions || null;
  } catch (error) {
    logDirectusError('getPromotionsBlock', error);
    return null;
  }
}

// Portfolio functions
export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  try {
    const categories = await directus.request(
      readItemsTyped('portfolio_categories', {
        fields: ['*'],
        sort: ['sort', 'name'],
      })
    );
    return (categories || []) as PortfolioCategory[];
  } catch (error) {
    logDirectusError('getPortfolioCategories', error);
    return [];
  }
}

export async function getPortfolioCases(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<PortfolioCase[]> {
  try {
    const filter: any = { status: { _eq: 'published' } };

    if (options?.category) {
      filter.category = { slug: { _eq: options.category } };
    }

    if (options?.featured !== undefined) {
      filter.is_featured = { _eq: options.featured };
    }

    const cases = await directus.request(
      readItemsTyped('portfolio_cases', {
        filter,
        fields: ['*', 'category.*', 'image_before.*', 'image_after.*'],
        sort: ['sort'],
        limit: options?.limit || 100,
      })
    );
    return (cases || []) as PortfolioCase[];
  } catch (error) {
    logDirectusError('getPortfolioCases', error);
    return [];
  }
}

export async function getPortfolioBlock(blockId: number): Promise<BlockPortfolio | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_portfolio', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockPortfolio || null;
  } catch (error) {
    logDirectusError('getPortfolioBlock', error);
    return null;
  }
}

