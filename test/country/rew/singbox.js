import fs from 'fs';
import YAML from 'yaml';
import formatWholeYamlFile from '../yaml-formatter.js';
import getregex from '../regex/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default async function getsingbox() {
    const only = path.resolve(__dirname, '../data/regex_only.yaml');
    const count = path.resolve(__dirname, '../data/iso/iso_country.yaml');
    if (!fs.existsSync(only) || !fs.existsSync(count)) {
        await getregex();
    }
    // regex
    const regexData = YAML.parse(fs.readFileSync(only, 'utf8'), { maxAliasCount: -1 });

    // emoji 国家数据
    const isoData = YAML.parse(fs.readFileSync(count, 'utf8'), { maxAliasCount: -1 });

    // 转换国家
    const countries = Object.entries(isoData).map(([flag, info]) => {
        return {
            flag,
            code: info.英文,
            name: info.中文 || info.英文 || flag,
        };
    });

    // 手动构造 YAML AST 结构
    const doc = new YAML.Document();

    // ===== u anchor node =====
    // const uNode = doc.createNode({
    //     type: 'url-test',
    //     tolerance: 1,
    //     strategy: 'consistent-hashing',
    //     url: 'https://www.gstatic.com/generate_204',
    //     interval: 300,
    //     lazy: true,
    //     timeout: 5000,
    //     'max-failed-times': 5,
    //     'include-all': true,
    // });

    // uNode.anchor = 'u';

    // ===== countries =====
    const data = countries
        .map((c) => {
            const regex = regexData[c.code] || regexData[c.flag];
            if (!regex) return null;

            return doc.createNode({
                tag: `${c.flag}${c.name}自动`,
                // '<<': new YAML.Alias('u'),
                type: 'urltest',
                interrupt_exist_connections: true,
                url: 'https://www.gstatic.com/generate_204',
                interval: '3m',
                tolerance: 150,
                outbounds: [],
                filter: [{ action: 'include', keywords: [regex] }],
            });
        })
        .filter(Boolean);
    const allname = data.map((c) => c.toJSON().tag);
    // ===== root =====
    doc.contents = doc.createNode({
        // u: uNode,
        data,
        allname,
    });
    const dir = path.resolve(__dirname, '../data/rew/singbox.yaml');
    fs.writeFileSync(dir, doc.toString(), 'utf8');
    // 格式化
    await formatWholeYamlFile(dir, dir);

    console.log(`✅ 已生成 ${data.length} 个国家组`);
}
