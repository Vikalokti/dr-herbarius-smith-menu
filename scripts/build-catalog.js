const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const contentRoot = path.join(root, 'content');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(contentRoot, relativePath), 'utf8'));
}

function readCollection(relativePath) {
  const directory = path.join(contentRoot, relativePath);
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const item = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
      return { ...item, id: item.id || path.basename(file, '.json') };
    })
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER))
    .map(({ sortOrder, ...item }) => item);
}

const catalog = {
  ...readJson('catalog-base.json'),
  DRINKS: readCollection('drinks'),
  BOOSTERS: readCollection('boosters'),
  SNACKS: readJson('snacks.json'),
  ...readJson('mono.json'),
};

const outputDirectory = path.join(root, 'data');
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, 'catalog.json'),
  `${JSON.stringify(catalog, null, 2)}\n`,
);

