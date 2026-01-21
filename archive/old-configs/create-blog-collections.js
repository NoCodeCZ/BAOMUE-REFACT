#!/usr/bin/env node

/**
 * Script to create blog collections in Directus
 * 
 * Usage:
 *   node scripts/create-blog-collections.js
 * 
 * Requires:
 *   - NEXT_PUBLIC_DIRECTUS_URL environment variable
 *   - DIRECTUS_STATIC_TOKEN environment variable (with admin permissions)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
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

// Create collection
async function createCollection(collectionData) {
  const { collection, meta, fields, schema } = collectionData;
  
  console.log(`\n📦 Creating collection: ${collection}`);
  
  try {
    // Check if collection already exists
    try {
      await apiRequest(`/collections/${collection}`);
      console.log(`  ⚠️  Collection ${collection} already exists, skipping creation...`);
      return true;
    } catch (error) {
      // Collection doesn't exist, proceed with creation
    }
    
    // Create the collection
    await apiRequest('/collections', 'POST', {
      collection,
      meta,
      schema: schema || {},
    });
    console.log(`  ✅ Collection created`);
    
    // Create fields
    if (fields && fields.length > 0) {
      console.log(`  📝 Creating ${fields.length} field(s)...`);
      
      for (const fieldConfig of fields) {
        try {
          await apiRequest(`/fields/${collection}`, 'POST', fieldConfig);
          console.log(`    ✅ Field created: ${fieldConfig.field}`);
        } catch (error) {
          console.error(`    ❌ Failed to create field ${fieldConfig.field}: ${error.message}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to create collection: ${error.message}`);
    throw error;
  }
}

// Create relation
async function createRelation(collection, field, relatedCollection, options = {}) {
  console.log(`  🔗 Creating relation: ${collection}.${field} → ${relatedCollection}`);
  
  try {
    await apiRequest('/relations', 'POST', {
      collection,
      field,
      related_collection: relatedCollection,
      schema: {
        on_delete: options.onDelete || 'SET NULL',
      },
      meta: options.meta || {},
    });
    console.log(`    ✅ Relation created`);
  } catch (error) {
    console.error(`    ❌ Failed to create relation: ${error.message}`);
    throw error;
  }
}

// Main function
async function main() {
  console.log('🚀 Creating blog collections in Directus...\n');
  console.log(`📡 Connecting to: ${baseUrl}`);

  // Test connection
  try {
    await apiRequest('/server/info');
    console.log('✅ Connected to Directus\n');
  } catch (error) {
    console.error(`❌ Failed to connect to Directus: ${error.message}`);
    console.error('   Please check your DIRECTUS_URL and DIRECTUS_TOKEN');
    process.exit(1);
  }

  // Blog Categories Collection
  const blogCategories = {
    collection: 'blog_categories',
    meta: {
      collection: 'blog_categories',
      icon: 'folder',
      note: 'Blog post categories for organizing articles',
      display_template: '{{name}}',
      singleton: false,
    },
    schema: {},
    fields: [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          special: ['uuid'],
          interface: 'input',
          readonly: true,
          hidden: true,
        },
        schema: {
          is_primary_key: true,
          length: 36,
          has_auto_increment: false,
        },
      },
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          required: true,
          width: 'full',
        },
        schema: {
          is_nullable: false,
        },
      },
      {
        field: 'slug',
        type: 'string',
        meta: {
          interface: 'input',
          required: true,
          width: 'half',
          note: 'URL-friendly identifier',
        },
        schema: {
          is_nullable: false,
          is_unique: true,
        },
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          width: 'full',
        },
        schema: {},
      },
      {
        field: 'color',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'half',
        },
        schema: {},
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          width: 'half',
        },
        schema: {},
      },
    ],
  };

  // Blog Posts Collection
  const blogPosts = {
    collection: 'blog_posts',
    meta: {
      collection: 'blog_posts',
      icon: 'article',
      note: 'Blog posts and articles. Write content to educate visitors and improve SEO.',
      display_template: '{{title}}',
      singleton: false,
      archive_app_filter: true,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'published',
    },
    schema: {},
    fields: [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          special: ['uuid'],
          interface: 'input',
          readonly: true,
          hidden: true,
        },
        schema: {
          is_primary_key: true,
          length: 36,
          has_auto_increment: false,
        },
      },
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          required: true,
          width: 'full',
        },
        schema: {
          is_nullable: false,
        },
      },
      {
        field: 'slug',
        type: 'string',
        meta: {
          interface: 'input',
          required: true,
          width: 'half',
          note: 'URL-friendly version of title',
        },
        schema: {
          is_nullable: false,
          is_unique: true,
        },
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          width: 'half',
          options: {
            choices: [
              { text: 'Draft', value: 'draft' },
              { text: 'Published', value: 'published' },
              { text: 'Archived', value: 'archived' },
            ],
          },
        },
        schema: {
          default_value: 'draft',
          is_nullable: false,
        },
      },
      {
        field: 'category',
        type: 'uuid',
        meta: {
          interface: 'select-dropdown-m2o',
          special: ['m2o'],
          width: 'half',
          options: {
            template: '{{name}}',
          },
        },
        schema: {},
      },
      {
        field: 'featured_image',
        type: 'uuid',
        meta: {
          interface: 'file-image',
          special: ['file'],
          width: 'half',
        },
        schema: {},
      },
      {
        field: 'excerpt',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          width: 'full',
          note: 'Short summary for listings',
        },
        schema: {},
      },
      {
        field: 'content',
        type: 'text',
        meta: {
          interface: 'input-rich-text-html',
          width: 'full',
        },
        schema: {},
      },
      {
        field: 'author_name',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'half',
        },
        schema: {},
      },
      {
        field: 'author_role',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'half',
        },
        schema: {},
      },
      {
        field: 'author_avatar',
        type: 'uuid',
        meta: {
          interface: 'file-image',
          special: ['file'],
          width: 'half',
        },
        schema: {},
      },
      {
        field: 'published_date',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          width: 'half',
        },
        schema: {},
      },
      {
        field: 'reading_time',
        type: 'integer',
        meta: {
          interface: 'input',
          width: 'half',
          note: 'Reading time in minutes',
        },
        schema: {},
      },
      {
        field: 'views',
        type: 'integer',
        meta: {
          interface: 'input',
          width: 'half',
        },
        schema: {
          default_value: 0,
        },
      },
      {
        field: 'is_featured',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          width: 'half',
        },
        schema: {
          default_value: false,
        },
      },
      {
        field: 'tags',
        type: 'json',
        meta: {
          interface: 'tags',
          width: 'full',
        },
        schema: {},
      },
      {
        field: 'seo_title',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'half',
          note: 'SEO meta title',
        },
        schema: {},
      },
      {
        field: 'seo_description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          width: 'half',
          note: 'SEO meta description',
        },
        schema: {},
      },
    ],
  };

  try {
    // Create blog_categories collection
    await createCollection(blogCategories);
    
    // Create blog_posts collection
    await createCollection(blogPosts);
    
    // Create relations
    console.log('\n🔗 Creating relations...');
    
    // category relation
    await createRelation('blog_posts', 'category', 'blog_categories', {
      onDelete: 'SET NULL',
      meta: {
        one_field: null,
        sort_field: null,
      },
    });
    
    // featured_image relation
    await createRelation('blog_posts', 'featured_image', 'directus_files', {
      onDelete: 'SET NULL',
      meta: {
        one_field: null,
        sort_field: null,
      },
    });
    
    // author_avatar relation
    await createRelation('blog_posts', 'author_avatar', 'directus_files', {
      onDelete: 'SET NULL',
      meta: {
        one_field: null,
        sort_field: null,
      },
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Blog collections created successfully!');
    console.log('='.repeat(50));
    console.log('\n💡 Next steps:');
    console.log('   1. Log into Directus admin panel');
    console.log('   2. Create some blog categories');
    console.log('   3. Create blog posts');
    console.log('   4. Mark one post as featured (is_featured: true)');
    console.log('   5. Visit /blog on your website to see the posts\n');
    
  } catch (error) {
    console.error('\n❌ Error creating collections:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

