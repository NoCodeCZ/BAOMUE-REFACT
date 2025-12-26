/**
 * Fix Navigation Collection Display in Directus
 * Updates collection meta to show sort order and improve visibility
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
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

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    throw error;
  }
}

async function updateNavigationCollection() {
  console.log('🔧 Updating Navigation Collection Display Settings...\n');

  try {
    // Update collection meta
    const collectionUpdate = {
      meta: {
        display_template: '{{sort}}. {{title}}',
        sort_field: 'sort',
      }
    };

    await apiRequest('/collections/navigation', 'PATCH', collectionUpdate);
    console.log('✅ Collection meta updated:');
    console.log('   - Display template: "{{sort}}. {{title}}"');
    console.log('   - Sort field: "sort"');

    // Update sort field meta
    const sortFieldUpdate = {
      meta: {
        note: 'Display order in navigation menu. Lower numbers appear first. Each item should have a unique number.',
        width: 'half',
      }
    };

    await apiRequest('/fields/navigation/sort', 'PATCH', sortFieldUpdate);
    console.log('✅ Sort field meta updated with helpful note');

    console.log('\n✨ Navigation collection display improved!');
    console.log('   Items will now show as: "1. หน้าแรก", "2. บริการ", etc.');
    console.log('   Collection will default to sorting by the "sort" field.\n');

  } catch (error) {
    console.error('❌ Error updating navigation collection:', error.message);
    process.exit(1);
  }
}

// Run the update
updateNavigationCollection();

