# Image Optimizer

**Image Optimizer** is a Node.js application for resizing and optimizing images while maintaining directory structure integrity.

## Project Structure

```
/image-optimizer
    ├── index.js                # Main script for image processing
    ├── package.json            # Project configuration and dependencies
    └── README.md               # Project documentation
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saurabh7636/image-optimizer.git
   cd image-optimizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

1. **Configure `index.js`:**
   - Update `inputDir` and `outputDir` variables with your source and destination folder paths.
   - Adjust `maxWidth` and `maxHeight` for image resizing as needed.
   - Modify `allowedFormats` to include or exclude image formats according to your requirements.

2. **Run the script:**
   ```bash
   npm start
   ```

## Variables to Customize in `index.js`

- `inputDir`: Path to the directory containing original images.
- `outputDir`: Path to the directory where optimized images will be saved.
- `maxWidth`: Maximum width for resized images.
- `maxHeight`: Maximum height for resized images.
- `allowedFormats`: Array of allowed image formats to process (e.g., `['jpg', 'jpeg', 'png', 'webp', 'tiff']`).

## Acknowledgments

- Built with [Node.js](https://nodejs.org/)
- Image processing powered by [sharp](https://github.com/lovell/sharp)