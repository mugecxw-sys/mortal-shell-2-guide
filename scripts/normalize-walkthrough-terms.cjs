/* Mechanical terminology normalizer for first-party walkthrough prose. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'walkthrough');
const replacements = [
  [/Common Brew/g, 'Common Moonshine'],
  [/Ram Head Totem/g, 'Sheephead Totem'],
  [/Mammon Coin/g, 'Coin of Mammon'],
  [/Zirella/g, 'Zhirelle'],
  [/Vlakto/g, 'Vratko'],
  [/Merik/g, 'Merrick'],
  [/Dew Forge/g, 'Tarforge'],
  [/Mother's Pulse/g, "Mether's Pulse"],
  [/\b500 coin\b/g, '500 Tar'],
  [/\b1,000 coin\b/g, '1,000 Tar'],
  [/\b300 coin\b/g, '300 Tar'],
  [/\b350 coin\b/g, '350 Tar'],
  [/\bchest\b/gi, 'Treasure'],
  [/\bmonster\b/gi, 'enemy']
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html') {
      let content = fs.readFileSync(full, 'utf8');
      for (const [from, to] of replacements) content = content.replace(from, to);
      fs.writeFileSync(full, content);
    }
  }
}

walk(root);
