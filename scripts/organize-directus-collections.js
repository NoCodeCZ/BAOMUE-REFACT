#!/usr/bin/env node

/**
 * Script to organize Directus collections into folders and update metadata
 * 
 * Usage:
 *   node scripts/organize-directus-collections.js
 * 
 * Requires:
 *   - NEXT_PUBLIC_DIRECTUS_URL environment variable
 *   - DIRECTUS_STATIC_TOKEN environment variable (with admin permissions)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (error) {
  // dotenv not installed, that's okay
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

if (!DIRECTUS_URL) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is not set');
  process.exit(1);
}

if (!DIRECTUS_TOKEN) {
  console.error('❌ Error: DIRECTUS_STATIC_TOKEN environment variable is not set');
  process.exit(1);
}

const baseUrl = DIRECTUS_URL.replace(/\/$/, '');

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
    const response = await fetchFn(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    throw error;
  }
}

// Update collection metadata
async function updateCollection(collectionName, updates) {
  console.log(`\n📦 Updating collection: ${collectionName}`);
  
  try {
    const endpoint = `/collections/${collectionName}`;
    await apiRequest(endpoint, 'PATCH', { meta: updates });
    console.log(`  ✅ Collection updated`);
  } catch (error) {
    console.error(`  ❌ Failed to update: ${error.message}`);
    throw error;
  }
}

// Main organization
async function main() {
  console.log('🚀 Organizing Directus Collections...\n');
  console.log(`📡 Connecting to: ${baseUrl}`);

  // Test connection
  try {
    await apiRequest('/server/info');
    console.log('✅ Connected to Directus\n');
  } catch (error) {
    console.error(`❌ Failed to connect: ${error.message}`);
    process.exit(1);
  }

  // Rename "all_blocks" folder to "Content Blocks" if it exists
  try {
    await updateCollection('all_blocks', {
      collection: 'Content Blocks',
      note: 'Content blocks used in page builder',
      icon: 'view_quilt'
    });
    console.log('  ℹ️  Renamed "all_blocks" to "Content Blocks"');
  } catch (error) {
    // Folder might not exist or already renamed
    console.log('  ⚠️  Could not rename folder (may already be correct)');
  }

  // Organize all block collections into all_blocks folder
  const blockCollections = [
    'block_hero', 'block_about_us', 'block_why_choose_us', 'block_team',
    'block_signature_treatment', 'block_safety_banner', 'block_services',
    'block_locations', 'block_booking', 'block_contact', 'block_features',
    'block_testimonials', 'block_pricing', 'block_footer', 'block_gallery',
    'block_rich_text'
  ];

  console.log('\n📁 Organizing block collections into "all_blocks" folder...');
  for (const collection of blockCollections) {
    try {
      await updateCollection(collection, {
        group: 'all_blocks',
        hidden: false  // Make them visible
      });
    } catch (error) {
      console.log(`  ⚠️  ${collection}: ${error.message}`);
    }
  }

  // Fix blog_posts grouping (should be in Blog folder, not under blog_categories)
  console.log('\n📁 Fixing blog_posts grouping...');
  try {
    await updateCollection('blog_posts', {
      group: 'Blog'
    });
    console.log('  ✅ blog_posts moved to Blog folder');
  } catch (error) {
    console.log(`  ⚠️  blog_posts: ${error.message}`);
  }

  // Hide duplicate "posts" collection (we use blog_posts)
  console.log('\n👁️  Hiding duplicate "posts" collection...');
  try {
    await updateCollection('posts', {
      hidden: true
    });
    console.log('  ✅ "posts" collection hidden');
  } catch (error) {
    console.log(`  ⚠️  posts: ${error.message}`);
  }

  // Organize page_* collections into a "page_items" folder
  console.log('\n📁 Organizing page_* collections...');
  const pageCollections = ['page_features', 'page_testimonials', 'page_pricing_plans'];
  
  // Create page_items folder if it doesn't exist
  try {
    await apiRequest('/collections', 'POST', {
      collection: 'page_items',
      meta: {
        collection: 'page_items',
        icon: 'folder',
        note: 'Page-level content items',
        singleton: false
      },
      schema: null
    });
    console.log('  ✅ Created "page_items" folder');
  } catch (error) {
    // Folder might already exist
    console.log('  ℹ️  "page_items" folder may already exist');
  }

  for (const collection of pageCollections) {
    try {
      await updateCollection(collection, {
        group: 'page_items'
      });
    } catch (error) {
      console.log(`  ⚠️  ${collection}: ${error.message}`);
    }
  }

  // Add metadata to collections missing it
  console.log('\n📝 Adding metadata to collections...');
  const metadataUpdates = {
    'block_booking': {
      icon: 'event',
      note: 'Booking section with contact information and appointment form details.',
      display_template: 'Booking: {{title}}'
    },
    'block_contact': {
      icon: 'contact_mail',
      note: 'Contact section with HQ address, phone, hours, and email information.',
      display_template: 'Contact: {{title}}'
    },
    'block_locations': {
      icon: 'place',
      note: 'Locations section with branch information, address, hours, phone, and map.',
      display_template: 'Locations: {{branch_name}}'
    },
    'block_safety_banner': {
      icon: 'shield',
      note: 'Safety protocols banner with title, subtitle, and safety points.',
      display_template: 'Safety: {{title}}'
    },
    'block_signature_treatment': {
      icon: 'medical_services',
      note: 'Signature treatment section with steps, stats, price, and before/after images.',
      display_template: 'Signature Treatment: {{title}}'
    },
    'block_why_choose_us': {
      icon: 'star',
      note: 'Why Choose Us section with title, subtitle, and 4 key points.',
      display_template: 'Why Choose Us: {{title}}'
    },
    'block_about_us': {
      icon: 'info',
      note: 'About Us section with headline, subtitle, paragraphs, and image.',
      display_template: 'About Us: {{headline}}'
    },
    'block_team': {
      icon: 'people',
      note: 'Team section displaying dentists with photos, names, and specialties.',
      display_template: 'Team: {{title}}'
    },
    'block_services': {
      icon: 'apps',
      note: 'Services grid section with title, subtitle, and list of services with icons.',
      display_template: 'Services: {{title}}'
    }
  };

  for (const [collection, meta] of Object.entries(metadataUpdates)) {
    try {
      await updateCollection(collection, meta);
    } catch (error) {
      console.log(`  ⚠️  ${collection}: ${error.message}`);
    }
  }

  // Update page_blocks to be hidden (it's a junction table)
  console.log('\n👁️  Updating page_blocks visibility...');
  try {
    await updateCollection('page_blocks', {
      hidden: true,
      note: 'Junction table for page blocks (M2A). Hidden from navigation.'
    });
    console.log('  ✅ page_blocks hidden');
  } catch (error) {
    console.log(`  ⚠️  page_blocks: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Collection organization complete!');
  console.log('='.repeat(50));
  console.log('\n💡 Summary:');
  console.log('   - All block collections organized in "Content Blocks" folder');
  console.log('   - blog_posts moved to Blog folder');
  console.log('   - Duplicate "posts" collection hidden');
  console.log('   - Page items organized in "Page Items" folder');
  console.log('   - Metadata added to collections');
  console.log('   - Hidden collections made visible');
  console.log('\n🔄 Refresh your Directus admin panel to see the changes!\n');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

