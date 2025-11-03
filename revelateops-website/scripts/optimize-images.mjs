import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const imagesToOptimize = [
  {
    input: 'drew-and-sirius.jpeg',
    output: 'drew-and-sirius-optimized.jpeg',
    maxWidth: 1200,
    quality: 85
  },
  {
    input: 'revelate-logo.png',
    output: 'revelate-logo-optimized.png',
    maxWidth: 800,
    quality: 90
  },
  {
    input: 'founder-portrait.png',
    output: 'founder-portrait-optimized.png',
    maxWidth: 800,
    quality: 85
  },
  {
    input: 'family-wedding.jpeg',
    output: 'family-wedding-optimized.jpeg',
    maxWidth: 1200,
    quality: 82
  },
  {
    input: 'nyc-with-uncle.jpeg',
    output: 'nyc-with-uncle-optimized.jpeg',
    maxWidth: 1200,
    quality: 82
  }
];

async function optimizeImage(config) {
  const inputPath = join(publicDir, config.input);
  const outputPath = join(publicDir, config.output);

  if (!existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} - file not found`);
    return;
  }

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`\n📸 Optimizing ${config.input}`);
    console.log(`   Original: ${(metadata.size / 1024 / 1024).toFixed(2)}MB, ${metadata.width}x${metadata.height}`);

    await sharp(inputPath)
      .resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: config.quality, mozjpeg: true })
      .toFile(outputPath);

    const optimizedMetadata = await sharp(outputPath).metadata();
    const savings = ((1 - optimizedMetadata.size / metadata.size) * 100).toFixed(1);

    console.log(`   Optimized: ${(optimizedMetadata.size / 1024 / 1024).toFixed(2)}MB, ${optimizedMetadata.width}x${optimizedMetadata.height}`);
    console.log(`   ✅ Saved ${savings}% (${((metadata.size - optimizedMetadata.size) / 1024 / 1024).toFixed(2)}MB)`);
  } catch (error) {
    console.error(`❌ Error optimizing ${config.input}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  for (const config of imagesToOptimize) {
    await optimizeImage(config);
  }

  console.log('\n✨ Image optimization complete!\n');
}

main().catch(console.error);
