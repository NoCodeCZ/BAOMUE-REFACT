const fs = require('fs');
const path = require('path');

/**
 * Compare current schema to Directus Simple CMS template
 */
function compareSchemaToTemplate() {
  const snapshotPath = path.join(__dirname, '../docs/snapshot.json');
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

  const currentBlocks = snapshot.collections
    .filter(c => c.collection && c.collection.startsWith('block_'))
    .map(c => c.collection);

  const templateBlocks = [
    'block_hero',
    'block_text',
    'block_gallery',
    'block_form',
    'block_contact',
  ];

  console.log('=== Schema Comparison ===\n');
  console.log('Current Block Collections:', currentBlocks.length);
  console.log('Template Block Collections:', templateBlocks.length);
  console.log('\nCurrent Blocks:', currentBlocks.join(', '));
  console.log('\nTemplate Blocks:', templateBlocks.join(', '));
  
  const extraBlocks = currentBlocks.filter(b => !templateBlocks.includes(b));
  const missingBlocks = templateBlocks.filter(b => !currentBlocks.includes(b));

  if (extraBlocks.length > 0) {
    console.log('\n⚠️  Extra blocks (not in template):', extraBlocks.join(', '));
  }

  if (missingBlocks.length > 0) {
    console.log('\n⚠️  Missing blocks (in template):', missingBlocks.join(', '));
  }

  console.log('\n=== Recommendations ===');
  if (currentBlocks.length > templateBlocks.length) {
    console.log('Consider consolidating similar blocks to match template structure.');
  }
}

compareSchemaToTemplate();

