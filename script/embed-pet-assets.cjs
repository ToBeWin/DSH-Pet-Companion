const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const output = join(root, 'lib', 'client.js');
const assets = Object.fromEntries(['beaver', 'cat', 'axolotl', 'shiba', 'rabbit', 'corgi', 'hamster', 'otter', 'penguin', 'red-panda', 'fox', 'panda'].map((id) => [
  id,
  `data:image/png;base64,${readFileSync(join(root, 'client', 'assets', `${id}.png`)).toString('base64')}`,
]));
const source = readFileSync(output, 'utf8');
if (!source.includes('__PET_ASSET_MAP__')) throw new Error('Pet asset placeholder was not found in client bundle.');
writeFileSync(output, source.replace('__PET_ASSET_MAP__', JSON.stringify(assets)));
