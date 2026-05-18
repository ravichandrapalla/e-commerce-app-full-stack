/**
 * Resize and convert a local image to optimized WebP.
 *
 * Usage:
 *   npm run optimize-image -- --input ./photo.jpg --output ./photo.webp --preset product
 *   npm run optimize-image -- -i ./avatar.png -o ./avatar.webp -p avatar
 */
import fs from "fs/promises";
import path from "path";
import { optimizeImage } from "../src/utils/optimizeImage";
import type { ImagePreset } from "../src/constants/imageOptimize";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options: {
    input?: string;
    output?: string;
    preset: ImagePreset;
  } = { preset: "product" };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if ((arg === "--input" || arg === "-i") && next) {
      options.input = next;
      i++;
    } else if ((arg === "--output" || arg === "-o") && next) {
      options.output = next;
      i++;
    } else if ((arg === "--preset" || arg === "-p") && next) {
      if (next === "product" || next === "avatar" || next === "hero") {
        options.preset = next;
      } else {
        throw new Error('Preset must be "product", "avatar", or "hero"');
      }
      i++;
    }
  }

  if (!options.input) {
    throw new Error("Missing --input <path>");
  }

  if (!options.output) {
    const parsed = path.parse(options.input);
    options.output = path.join(parsed.dir, `${parsed.name}.webp`);
  }

  return options as { input: string; output: string; preset: ImagePreset };
};

async function main() {
  const { input, output, preset } = parseArgs();
  const inputPath = path.resolve(input);
  const outputPath = path.resolve(output);

  const source = await fs.readFile(inputPath);
  const beforeKb = (source.length / 1024).toFixed(1);

  const optimized = await optimizeImage(source, preset);
  await fs.writeFile(outputPath, optimized);

  const afterKb = (optimized.length / 1024).toFixed(1);
  const savings =
    source.length > 0
      ? (((source.length - optimized.length) / source.length) * 100).toFixed(1)
      : "0";

  console.log(`Preset:  ${preset}`);
  console.log(`Input:   ${inputPath} (${beforeKb} KB)`);
  console.log(`Output:  ${outputPath} (${afterKb} KB)`);
  console.log(`Saved:   ${savings}%`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
