const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

// Configuration
const inputDir = 'input'; // Change to your source folder
const outputDir = 'output'; // Change to your destination folder
const maxWidth = 1000; // Example: Resize width
const maxHeight = null; // Example: Resize height
const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'tiff']; // Define allowed image formats

// Helper function to process images
async function processImage(filePath, outputFilePath) {
  try {
    await sharp(filePath)
      .resize(maxWidth, maxHeight, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(outputFilePath);

    console.log(`Processed: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to check if a file has an allowed format
function isAllowedFormat(fileName) {
  const ext = path.extname(fileName).toLowerCase().slice(1);
  return allowedFormats.includes(ext);
}

// Recursively process directory
async function processDirectory(dir, relativePath = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const outputPath = path.join(outputDir, relativePath, entry.name);

    if (entry.isDirectory()) {
      await fs.ensureDir(outputPath); // Ensure directory exists in outputDir
      await processDirectory(fullPath, path.join(relativePath, entry.name)); // Recursively process subdirectory
    } else if (entry.isFile() && isAllowedFormat(entry.name)) {
      await processImage(fullPath, outputPath); // Process image
    }
  }
}

// Main function
(async () => {
  try {
    await fs.ensureDir(outputDir); // Ensure output directory exists
    await processDirectory(inputDir);
    console.log('Processing complete!');
  } catch (error) {
    console.error('Error:', error);
  }
})();
