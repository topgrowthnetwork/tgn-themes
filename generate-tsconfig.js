const fs = require('fs');
const path = require('path');
require('dotenv').config();

const THEME = process.env.NEXT_PUBLIC_THEME || 'active';
const configPath = path.resolve(__dirname, 'tsconfig.json');

// Read existing tsconfig
const tsconfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Set @theme aliases dynamically
tsconfig.compilerOptions.paths['@theme'] = [`components/themes/${THEME}`];
tsconfig.compilerOptions.paths['@theme/*'] = [`components/themes/${THEME}/*`];

// Write updated tsconfig
fs.writeFileSync(configPath, JSON.stringify(tsconfig, null, 2));

console.log(`✅ tsconfig.json updated for theme: "${THEME}"`);
