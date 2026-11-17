import fs from 'node:fs';
import path from 'node:path';
import { scrapeCointelegraphNews } from './cointelegraphScraper.mjs';

const OUTPUT_PATH = path.resolve('src/features/landing/data/cointelegraphNews.json');

async function main() {
  const payload = await scrapeCointelegraphNews();
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(
    `Synced Top Story + ${payload.items.length} articles with thumbnails from Cointelegraph -> ${OUTPUT_PATH}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
