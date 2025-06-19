const fs = require('fs').promises;
const path = require('path');

// Configuration
const ORIGIN_DIR = path.join(__dirname, '../src/app/origin');
const LANGUAGES = ['en', 'zh-CN', 'ja-JP'];
const LOCALE_MAPPING = {
  'en': 'en',
  'zh-CN': 'zh-CN', 
  'ja-JP': 'ja-JP'
};

// Function to copy file and update locale
async function syncFile(filePath) {
  try {
    const relativePath = path.relative(ORIGIN_DIR, filePath);
    const fileName = path.basename(filePath);
    
    // Read the original file content
    const content = await fs.readFile(filePath, 'utf8');
    
    // Process each language
    for (const lang of LANGUAGES) {
      const targetDir = path.join(__dirname, `../src/app/${lang}`);
      const targetPath = path.join(targetDir, relativePath);
      
      // Create target directory if it doesn't exist
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      
      // Update locale in content
      let updatedContent = content;
      
      // Replace locale export
      const localeRegex = /export const locale = ['"]auto['"]/;
      if (localeRegex.test(updatedContent)) {
        updatedContent = updatedContent.replace(
          localeRegex,
          `export const locale = '${LOCALE_MAPPING[lang]}'`
        );
      }
      
      // Write the updated content to target file
      await fs.writeFile(targetPath, updatedContent, 'utf8');
      
      console.log(`✅ Synced ${relativePath} to ${lang}/`);
    }
  } catch (error) {
    console.error(`❌ Error syncing file ${filePath}:`, error.message);
  }
}

// Function to sync all existing files
async function syncAllFiles() {
  try {
    console.log('🚀 Starting locale synchronization...');
    console.log(`📁 Source: ${ORIGIN_DIR}`);
    console.log(`🌍 Languages: ${LANGUAGES.join(', ')}`);
    
    const files = await fs.readdir(ORIGIN_DIR, { recursive: true });
    
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(ORIGIN_DIR, file);
        await syncFile(filePath);
      }
    }
    
    console.log('🎉 Locale synchronization completed!');
  } catch (error) {
    console.error('❌ Error during synchronization:', error.message);
  }
}

// Run the script
syncAllFiles().catch(console.error); 