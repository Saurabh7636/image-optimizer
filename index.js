const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const { inputDir, outputDir, maxWidth, maxHeight, allowedFormats } = require('./config');

const unresizedFiles = []; // Array to store unresized file paths

// Helper function to process images
async function processImage(filePath, outputFilePath) {
    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        await image
            .resize({
                width: metadata.width < maxWidth ? metadata.width : maxWidth,
                height: maxHeight,
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(outputFilePath);

        if (metadata.width <= maxWidth) {
            unresizedFiles.push(filePath + ` : [width => ${metadata.width}]`);
            console.log(`Optimized without resizing: ${outputFilePath} [width => ${metadata.width}]`);
        } else {
            console.log(`Resized and optimized: ${outputFilePath} [width => ${metadata.width}]`);
        }
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

        // Write the list of unresized files to a text file
        const unresizedFilePath = path.join('unresized_files.txt');
        await fs.writeFile(unresizedFilePath, unresizedFiles.join('\n'), 'utf8');
        console.log(`Unresized files written to ${unresizedFilePath}`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
