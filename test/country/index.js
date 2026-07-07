import YAML from 'yaml';
import fs from 'fs';

const regexOutputRaw = fs.readFileSync('updated.yaml', 'utf8');
const regexOutput = YAML.parse(regexOutputRaw,{ maxAliasCount: -1 });
console.log('Total entries: ' + regexOutput.data.length);
