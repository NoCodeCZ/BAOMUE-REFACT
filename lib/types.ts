export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_features: BlockFeatures[];
  block_testimonials: BlockTestimonials[];
  block_pricing: BlockPricing[];
  block_footer: BlockFooter[];
  block_about_us: BlockAboutUs[];
  block_why_choose_us: BlockWhyChooseUs[];
  block_team: BlockTeam[];
  block_signature_treatment: BlockSignatureTreatment[];
  block_safety_banner: BlockSafetyBanner[];
  block_services: BlockServices[];
  block_locations: BlockLocations[];
  block_booking: BlockBooking[];
  block_contact: BlockContact[];
  block_text: BlockText[];
  block_form: BlockForm[];
  forms: Form[];
  form_fields: FormField[];
  page_features: PageFeature[];
  page_testimonials: PageTestimonial[];
  page_pricing_plans: PagePricingPlan[];
  global_settings: GlobalSettings;
  service_categories: ServiceCategory[];
  services: Service[];
  navigation: NavigationItem[];
  blog_categories: BlogCategory[];
  blog_posts: BlogPost[];
  block_blog_listing: BlockBlogListing[];
  promotions: Promotion[];
  promotion_categories: PromotionCategory[];
  block_promotions: BlockPromotions[];
  portfolio_cases: PortfolioCase[];
  portfolio_categories: PortfolioCategory[];
  block_portfolio: BlockPortfolio[];
  block_service_detail: BlockServiceDetail[];
  block_stats: BlockStats[];
  block_page_header: BlockPageHeader[];
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  blocks?: Block[];
}

export interface Block {
  id: string;
  collection: string;
  item: BlockHero | BlockFeatures | BlockTestimonials | BlockPricing | BlockFooter | BlockPromotions;
}

export interface PageBlock {
  id: number;
  page: number;
  collection: string; // Keep as string for Directus compatibility, use BlockType when possible
  item: string;
  sort: number;
  hide_block?: boolean; // Add hide_block support
}

// Block type union - all valid block collection names
export type BlockType =
  | 'block_hero'
  | 'block_text'
  | 'block_about_us'
  | 'block_why_choose_us'
  | 'block_team'
  | 'block_signature_treatment'
  | 'block_safety_banner'
  | 'block_services'
  | 'block_locations'
  | 'block_booking'
  | 'block_contact'
  | 'block_form'
  | 'block_footer'
  | 'block_features'
  | 'block_testimonials'
  | 'block_pricing'
  | 'block_promotions'
  | 'block_portfolio'
  | 'block_blog_listing'
  | 'block_service_detail'
  | 'block_stats'
  | 'block_page_header';

// Block content union - all possible block content types
export type BlockContent =
  | BlockHero
  | BlockText
  | BlockAboutUs
  | BlockWhyChooseUs
  | BlockTeam
  | BlockSignatureTreatment
  | BlockSafetyBanner
  | BlockServices
  | BlockLocations
  | BlockBooking
  | BlockContact
  | BlockForm
  | BlockFooter
  | BlockFeatures
  | BlockTestimonials
  | BlockPricing
  | BlockPromotions
  | BlockPortfolio
  | BlockBlogListing
  | BlockServiceDetail
  | BlockStats
  | BlockPageHeader;

// Enhanced PageBlock with typed collection
export interface PageBlockWithContent {
  id: number;
  page: number;
  collection: BlockType;
  item: string;
  sort: number;
  content: BlockContent | null;
}

export interface BlockHero {
  id: number;
  badge_text?: string;
  headline_line1?: string;
  headline_line2?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  background_image?: string;
}

export interface BlockFeatures {
  id: number;
  section_title?: string;
  section_description?: string;
}

export interface BlockTestimonials {
  id: number;
  section_title?: string;
  section_description?: string;
  title?: string;
  subtitle?: string;
  testimonials?: any[];
}

export interface BlockPricing {
  id: number;
  section_title?: string;
  section_description?: string;
}

export interface BlockFooter {
  id: number;
  content?: FooterContent;
}

export interface FooterContent {
  site_name?: string;
  description?: string;
  product_links?: Link[];
  company_links?: Link[];
  legal_links?: Link[];
  copyright?: string;
  social_links?: SocialLink[];
}

export interface Link {
  text: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
}

export interface PageFeature {
  id: number;
  page: number;
  title: string;
  description?: string;
  icon?: string;
  layout_type?: 'normal' | 'wide' | 'dark';
  visual_data?: any;
  sort?: number;
}

export interface PageTestimonial {
  id: number;
  page: number;
  quote: string;
  author_name: string;
  role?: string;
  rating?: number;
  avatar_initial?: string;
  sort?: number;
}

export interface PagePricingPlan {
  id: number;
  page: number;
  plan_name: string;
  price?: string;
  price_period?: string;
  features?: string[];
  cta_text?: string;
  cta_link?: string;
  is_featured?: boolean;
  badge_text?: string;
  sort?: number;
}

export interface GlobalSettings {
  id: number;
  site_name?: string;
  site_description?: string;
  logo?: string;
  favicon?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  sort?: number;
}

export interface ServiceHighlight {
  title: string;
  description: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  status: 'published' | 'draft';
  category?: ServiceCategory | number | null;
  short_description?: string;
  long_description?: string;
  duration_label?: string;
  price_from?: string;
  price_starting_from?: string; // Alternative price field for service detail
  price_installment?: string;
  price_installment_months?: number;
  hero_image?: string;
  seo_title?: string;
  seo_description?: string;
  highlights?: ServiceHighlight[];
  features?: ServiceFeature[] | any; // JSON field
  process_steps?: ServiceProcessStep[] | any; // JSON field
  results?: ServiceResult[] | any; // JSON field
  care_instructions?: ServiceCareItem[] | any; // JSON field
  suitability?: ServiceSuitability | any; // JSON field
  stats_cases?: string; // e.g., "5,000+"
  stats_rating?: number; // e.g., 4.9
  cta_booking_text?: string;
  cta_booking_link?: string;
  cta_line_text?: string;
  cta_line_link?: string;
  pricing_plans?: ServicePricingPlan[] | any; // JSON field for pricing tiers
  faqs?: ServiceFAQ[] | any; // JSON field for FAQs
  portfolio_cases?: ServicePortfolioCase[] | any; // JSON field for portfolio cases
}

export interface BlockAboutUs {
  id: number;
  headline?: string;
  subtitle?: string;
  paragraph_1?: string;
  paragraph_2?: string;
  paragraph_3?: string;
  image_url?: string;
}

export interface BlockWhyChooseUs {
  id: number;
  title?: string;
  subtitle?: string;
  point_1_title?: string;
  point_1_text?: string;
  point_2_title?: string;
  point_2_text?: string;
  point_3_title?: string;
  point_3_text?: string;
  point_4_title?: string;
  point_4_text?: string;
}

export interface Dentist {
  id: string; // UUID
  name: string;
  nickname?: string;
  specialty: string;
  photo?: string | { id: string }; // Directus file (UUID or file object)
  photo_url?: string; // External URL fallback
  linkedin_url?: string;
  sort?: number;
}

export interface BlockTeam {
  id: number;
  title?: string;
  subtitle?: string;
  note?: string;
  dentists?: Dentist[]; // Now a proper M2M relation, not JSON array
}

export interface BlockSignatureTreatment {
  id: number;
  title?: string;
  subtitle?: string;
  steps?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  stat_1_label?: string;
  stat_1_value?: string;
  stat_2_label?: string;
  stat_2_value?: string;
  price_text?: string;
  before_image_url?: string;
  month3_image_url?: string;
  month6_image_url?: string;
  after_image_url?: string;
}

export interface BlockSafetyBanner {
  id: number;
  title?: string;
  subtitle?: string;
  points?: Array<{
    label: string;
  }>;
}

export interface BlockServices {
  id: number;
  title?: string;
  subtitle?: string;
  services?: Array<{
    label: string;
    icon_name?: string;
  }>;
}

export interface BlockLocations {
  id: number;
  section_title?: string;
  section_subtitle?: string;
  branch_name?: string;
  branch_tag?: string;
  branch_address?: string;
  branch_hours?: string;
  branch_phone?: string;
  branch_image_url?: string;
  map_embed_url?: string;
}

export interface BlockBooking {
  id: number;
  title?: string;
  subtitle?: string;
  phone_label?: string;
  phone_number?: string;
  line_label?: string;
  line_handle?: string;
  hours_label?: string;
  hours_value?: string;
}

export interface BlockContact {
  id: number;
  title?: string;
  subtitle?: string;
  // Contact channels (for card display)
  phone_number?: string;
  phone_hours?: string;
  line_handle?: string;
  line_response_time?: string;
  facebook_page?: string;
  facebook_description?: string;
  email_address?: string;
  email_response_time?: string;
  // Map
  map_embed_url?: string;
  map_address?: string;
  map_link_text?: string;
  // Legacy fields (keep for backward compatibility)
  hq_title?: string;
  hq_address?: string;
  phone_title?: string;
  phone_text?: string;
  hours_title?: string;
  hours_text?: string;
  email_title?: string;
  email_text?: string;
}

export interface BlockText {
  id: number;
  title?: string;
  subtitle?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  background_color?: string;
}

export interface BlockForm {
  id: number;
  form?: number | null;
  title?: string;
  description?: string;
  background_style?: 'white' | 'gray' | 'primary';
}

export interface Form {
  id: number;
  name: string;
  slug: string;
  description?: string;
  submit_button_text?: string;
  success_message?: string;
  redirect_url?: string;
  email_notifications?: boolean;
  notification_email?: string;
  fields?: FormField[];
}

export interface FormField {
  id: number;
  form: number;
  label: string;
  field_type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: Array<{ label: string; value: string }>;
  sort?: number;
}

export interface NavigationItem {
  id: number;
  title: string;
  url?: string | null;
  page?: Page | number | null;
  parent?: NavigationItem | number | null;
  target?: '_self' | '_blank';
  sort?: number | null;
  children?: NavigationItem[];
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  sort?: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: BlogCategory | number | null;
  featured_image?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  published_date?: string;
  reading_time?: number;
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

// Stats block interfaces
export interface StatItem {
  value: string; // e.g., "500+", "4.9", "98%", "15+"
  label: string; // e.g., "เคสสำเร็จ", "คะแนนรีวิว"
  icon?: string; // Optional icon name (e.g., "star")
  icon_color?: string; // Optional icon color (e.g., "amber")
}

export interface BlockStats {
  id: number;
  stats?: StatItem[] | any; // JSON field - array of stat items
  columns?: number; // Number of columns (2, 3, or 4), default: 4
  show_icons?: boolean; // Whether to show icons, default: true
}

// Page header block for inner pages (simpler than hero)
export interface BlockPageHeader {
  id: number;
  badge_text?: string; // Small badge text above title
  title: string; // Main page title
  subtitle?: string; // Subtitle below the title
  description?: string; // Longer description paragraph
}

// Service detail interfaces
export interface ServiceFeature {
  icon?: string; // Icon name (e.g., "eye-off", "smile", "zap", "clock")
  icon_color?: string; // Color class (e.g., "blue", "green", "purple", "amber")
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
  color?: string; // Color for step badge (e.g., "blue", "cyan", "teal", "green")
}

export interface ServiceResult {
  title: string;
  description: string;
}

export interface ServiceCareItem {
  number?: number;
  title: string;
  description: string;
}

export interface ServiceSuitability {
  items: string[]; // List of suitability criteria
}

export interface ServicePricingPlan {
  tier: string;          // "LITE", "STANDARD", "COMPREHENSIVE"
  price: string;         // "฿39,000"
  description: string;   // "เหมาะกับเคสง่าย"
  aligner_count: string; // "14 ชุด" or "ไม่จำกัด"
  duration: string;      // "3-6 เดือน"
  retainer_count: string;// "1 คู่"
  is_popular?: boolean;  // highlight badge
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  sort?: number;
}

export interface ServicePortfolioCase {
  title: string;
  duration: string;
  description: string;
  image: string;
}

export interface BlockServiceDetail {
  id: number;
  service?: Service | number | null; // M2O to services
  show_hero?: boolean;
  show_features?: boolean;
  show_process?: boolean;
  show_results_care?: boolean;
  show_pricing?: boolean;
  show_faq?: boolean;
  show_portfolio?: boolean;
  show_booking?: boolean;
}

// Blog listing block interface
export interface BlockBlogListing {
  id: number;
  headline?: string;
  subtitle?: string;
  description?: string;
  show_search?: boolean;
  show_category_filter?: boolean;
  show_featured_article?: boolean;
  articles_per_page?: number;
}

// Portfolio interfaces
export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sort?: number;
}

export interface PortfolioCase {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: PortfolioCategory | number | null;
  image_before?: string;
  image_after?: string;
  description?: string;
  rating?: number;
  duration?: string;
  treatment_type?: string;
  client_name?: string;
  client_age?: number;
  client_gender?: string;
  is_featured?: boolean;
  sort?: number;
  date_created?: string;
}

export interface BlockPortfolio {
  id: number;
  headline?: string;
  subtitle?: string;
  description?: string;
  show_category_filter?: boolean;
  cases_per_page?: number;
}

// Promotion interfaces
export interface PromotionCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sort?: number;
}

export interface Promotion {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: PromotionCategory | number | null;
  featured_image?: string;
  short_description?: string;
  description?: string;
  discount_percentage?: number;
  discount_amount?: string;
  original_price?: string;
  discounted_price?: string;
  valid_from?: string;
  valid_until?: string;
  countdown_enabled?: boolean;
  countdown_date?: string;
  cta_text?: string;
  cta_link?: string;
  is_featured?: boolean;
  features?: string[] | null;
  sort?: number;
}

export interface BlockPromotions {
  id: number;
  headline?: string;
  subtitle?: string;
  show_countdown?: boolean;
  countdown_date?: string;
  countdown_label?: string;
  show_category_filter?: boolean;
}

// Mutation types
export interface FormSubmission {
  id: number;
  form?: number | null;
  data: Record<string, any>;
  status: 'pending' | 'processed' | 'archived';
  date_created?: string;
  user_created?: string;
}

export interface CreateFormSubmissionInput {
  formId: number;
  data: Record<string, any>;
}

export interface UpdateItemInput<T = any> {
  collection: string;
  id: number | string;
  data: Partial<T>;
}

export interface DeleteItemInput {
  collection: string;
  id: number | string;
}

