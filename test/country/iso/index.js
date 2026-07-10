import YAML from 'yaml';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function getiso() {
    const dir = path.resolve(__dirname, '../data/iso');
    const files = fs.readdirSync(dir);
    const yamlFiles = files.filter((f) => f.endsWith('.yaml'));
    let mux = 0;
    const core = [];
    const merged = {};
    yamlFiles.forEach((file) => {
        const regexOutputRaw = fs.readFileSync(path.resolve(dir, file), 'utf8');
        const regexOutput = YAML.parse(regexOutputRaw);
        const count = Object.keys(regexOutput || {}).length;
        mux += count;

        console.log(file + ': ' + count);

        // 合并 YAML
        Object.assign(merged, regexOutput);

        // 提取英文字段
        core.push(
            ...Object.values(regexOutput || [])
                .map((item) => item?.['英文'])
                .filter(Boolean),
        );
    });
    console.log('Total entries: ' + mux);
    const outYaml = path.resolve(__dirname, '../data/iso_country.yaml');
    const outJson = path.resolve(__dirname, '../data/iso_2.json');
    fs.writeFileSync(outYaml, YAML.stringify(merged), 'utf8');

    fs.writeFileSync(outJson, JSON.stringify(core, null, 2), 'utf8');
}
