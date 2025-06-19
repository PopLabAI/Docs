const chokidar = require('chokidar');
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

// Function to remove file from all language directories
async function removeFile(filePath) {
  try {
    const relativePath = path.relative(ORIGIN_DIR, filePath);
    
    for (const lang of LANGUAGES) {
      const targetPath = path.join(__dirname, `../src/app/${lang}`, relativePath);
      
      try {
        await fs.unlink(targetPath);
        console.log(`🗑️ Removed ${relativePath} from ${lang}/`);
      } catch (error) {
        // File might not exist, which is fine
        if (error.code !== 'ENOENT') {
          console.error(`❌ Error removing file ${targetPath}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error removing file ${filePath}:`, error.message);
  }
}

// Function to sync all existing files
async function syncAllFiles() {
  try {
    const files = await fs.readdir(ORIGIN_DIR, { recursive: true });
    
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(ORIGIN_DIR, file);
        await syncFile(filePath);
      }
    }
    
    console.log('🎉 Initial sync completed!');
  } catch (error) {
    console.error('❌ Error during initial sync:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting file watcher for locale synchronization...');
  console.log(`📁 Watching: ${ORIGIN_DIR}`);
  console.log(`🌍 Languages: ${LANGUAGES.join(', ')}`);
  
  // Initial sync
  await syncAllFiles();
  
  // Watch for file changes
  const watcher = chokidar.watch(ORIGIN_DIR, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });
  
  watcher
    .on('add', (filePath) => {
      console.log(`📄 File added: ${path.relative(ORIGIN_DIR, filePath)}`);
      syncFile(filePath);
    })
    .on('change', (filePath) => {
      console.log(`📝 File changed: ${path.relative(ORIGIN_DIR, filePath)}`);
      syncFile(filePath);
    })
    .on('unlink', (filePath) => {
      console.log(`🗑️ File removed: ${path.relative(ORIGIN_DIR, filePath)}`);
      removeFile(filePath);
    })
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });
  
  console.log('👀 File watcher is now active. Press Ctrl+C to stop.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down file watcher...');
  process.exit(0);
});

// Run the script
main().catch(console.error); 