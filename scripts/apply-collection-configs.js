#!/usr/bin/env node

/**
 * Script to apply user-friendly collection configurations to Directus
 * 
 * Usage:
 *   node scripts/apply-collection-configs.js
 * 
 * Requires:
 *   - NEXT_PUBLIC_DIRECTUS_URL environment variable
 *   - DIRECTUS_STATIC_TOKEN environment variable (with admin permissions)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists (optional)
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (error) {
  // dotenv not installed, that's okay - we'll use environment variables directly
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

// Remove trailing slash
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
    // Use global fetch (Node 18+) or require node-fetch
    let fetchFn;
    if (typeof fetch !== 'undefined') {
      fetchFn = fetch;
    } else {
      // Fallback for older Node versions
      try {
        fetchFn = require('node-fetch');
      } catch (e) {
        throw new Error('fetch is not available. Please use Node.js 18+ or install node-fetch');
      }
    }

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
async function updateCollectionMetadata(collectionName, meta) {
  console.log(`\n📦 Updating collection: ${collectionName}`);
  
  try {
    const endpoint = `/collections/${collectionName}`;
    const updateData = {
      meta: {
        icon: meta.icon,
        note: meta.note,
        display_template: meta.display_template,
        archive_app_filter: meta.archive_app_filter,
        archive_field: meta.archive_field,
        archive_value: meta.archive_value,
        unarchive_value: meta.unarchive_value,
      },
    };

    // Only include archive fields if archive_app_filter is true
    if (!meta.archive_app_filter) {
      delete updateData.meta.archive_field;
      delete updateData.meta.archive_value;
      delete updateData.meta.unarchive_value;
    }

    await apiRequest(endpoint, 'PATCH', updateData);
    console.log(`  ✅ Collection metadata updated`);
  } catch (error) {
    console.error(`  ❌ Failed to update collection: ${error.message}`);
    throw error;
  }
}

// Update field metadata
async function updateFieldMetadata(collectionName, fieldConfig) {
  console.log(`  📝 Updating field: ${fieldConfig.field}`);
  
  try {
    const endpoint = `/fields/${collectionName}/${fieldConfig.field}`;
    
    // Get current field to preserve type and schema
    let currentField;
    try {
      currentField = await apiRequest(`/fields/${collectionName}/${fieldConfig.field}`);
    } catch (error) {
      console.log(`  ⚠️  Field ${fieldConfig.field} not found, skipping...`);
      return;
    }

    // Prepare update data - only update meta, preserve schema
    const updateData = {
      meta: {
        ...currentField.meta,
        ...fieldConfig.meta,
      },
    };

    // Update schema defaults if provided
    if (fieldConfig.schema && Object.keys(fieldConfig.schema).length > 0) {
      updateData.schema = {
        ...currentField.schema,
        ...fieldConfig.schema,
      };
    }

    await apiRequest(endpoint, 'PATCH', updateData);
    console.log(`    ✅ Field metadata updated`);
  } catch (error) {
    console.error(`    ❌ Failed to update field: ${error.message}`);
    // Don't throw - continue with other fields
  }
}

// Main function
async function main() {
  console.log('🚀 Starting collection configuration application...\n');
  console.log(`📡 Connecting to: ${baseUrl}`);

  // Load configuration file
  const configPath = path.join(__dirname, '../config/COLLECTIONS_USER_FRIENDLY.json');
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Error: Configuration file not found at ${configPath}`);
    process.exit(1);
  }

  let config;
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configContent);
  } catch (error) {
    console.error(`❌ Error reading configuration file: ${error.message}`);
    process.exit(1);
  }

  const collections = config.collections || {};
  const collectionNames = Object.keys(collections);

  if (collectionNames.length === 0) {
    console.error('❌ Error: No collections found in configuration file');
    process.exit(1);
  }

  console.log(`📋 Found ${collectionNames.length} collection(s) to configure\n`);

  // Test connection
  try {
    await apiRequest('/server/info');
    console.log('✅ Connected to Directus\n');
  } catch (error) {
    console.error(`❌ Failed to connect to Directus: ${error.message}`);
    console.error('   Please check your DIRECTUS_URL and DIRECTUS_TOKEN');
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  // Process each collection
  for (const collectionName of collectionNames) {
    const collectionConfig = collections[collectionName];
    
    try {
      // Update collection metadata
      if (collectionConfig.meta) {
        await updateCollectionMetadata(collectionName, collectionConfig.meta);
      }

      // Update field metadata
      if (collectionConfig.fields && Array.isArray(collectionConfig.fields)) {
        console.log(`  📋 Updating ${collectionConfig.fields.length} field(s)...`);
        
        for (const fieldConfig of collectionConfig.fields) {
          // Skip system fields that shouldn't be updated
          if (['id', 'user_created', 'date_created', 'user_updated', 'date_updated'].includes(fieldConfig.field)) {
            // Only update if we're adding notes or translations
            if (fieldConfig.meta && (fieldConfig.meta.note || fieldConfig.meta.translations)) {
              await updateFieldMetadata(collectionName, fieldConfig);
            } else {
              console.log(`  ⏭️  Skipping system field: ${fieldConfig.field}`);
            }
          } else {
            await updateFieldMetadata(collectionName, fieldConfig);
          }
        }
      }

      successCount++;
      console.log(`\n✅ Successfully configured: ${collectionName}\n`);
    } catch (error) {
      errorCount++;
      console.error(`\n❌ Failed to configure: ${collectionName}`);
      console.error(`   Error: ${error.message}\n`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully configured: ${successCount} collection(s)`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount} collection(s)`);
  }
  console.log('='.repeat(50) + '\n');

  if (errorCount === 0) {
    console.log('🎉 All configurations applied successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Log into Directus admin panel');
    console.log('   2. Verify that collection notes and field notes appear');
    console.log('   3. Check that field translations are working');
    console.log('   4. Test editing content to see the improvements\n');
  } else {
    console.log('⚠️  Some configurations failed to apply. Please review the errors above.');
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

