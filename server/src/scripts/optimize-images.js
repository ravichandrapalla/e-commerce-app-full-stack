import sharp from "sharp";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(__filename);
const inputDir = path.join(__dirname, "datasets", "raw");
const outputDir = path.join(__dirname, "datasets", "optimized");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);

    const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);

    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`Optimized: ${file}`);
  }
}

processImages();
