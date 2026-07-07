// 从正则组 regex_output.yaml 读取并生成映射表
import fs from 'fs';
import yaml from 'yaml';
import getiso from '../iso/index.js';
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function getregex() {
    const dir = path.resolve(__dirname, '../data/iso/iso_country.yaml')
    if (!fs.existsSync(dir)) {
        await getiso();
    }
    const outputRaw = fs.readFileSync(dir, 'utf8');
    const countries = yaml.parse(outputRaw);

    const regexResult = {};

    // 遍历每个国家
    for (const [flag, countryData] of Object.entries(countries)) {
        const { 英文, 中文, 其他 } = countryData;

        // 处理其他参数，如果有多个用 | 分隔
        const otherParams = 其他
            .map((item) => {
                if (/^[A-Z]{2,3}$/.test(item)) {
                    return `(?:(?:^|[\\s_-])${item}(?=$|[\\s_-]))`;
                }
                return item;
            })
            .join('|');

        // 构建正则表达式
        let regex;
        if (otherParams) {
            regex = `(?i)(?:${flag}|(?:^|[\\s_-])(${英文})(?:(?=$|[\\s_-])|(?:[-_0-9]+(?=$|[\\s_-])))|(?:^|[\\s_-])[-_0-9]*${英文}(?=$|[\\s_-])|${中文}|${otherParams})`;
        } else {
            regex = `(?i)(?:${flag}|(?:^|[\\s_-])(${英文})(?:(?=$|[\\s_-])|(?:[-_0-9]+(?=$|[\\s_-])))|(?:^|[\\s_-])[-_0-9]*${英文}(?=$|[\\s_-])|${中文})`;
        }

        // 保存结果
        regexResult[flag] = regex;
    }

    // 写入新的 YAML 文件
    const outDir = path.resolve(__dirname, '../data/regex_only.yaml')
    fs.writeFileSync(outDir, yaml.stringify(regexResult, { lineWidth: Infinity, singleQuote: true }), 'utf8');

    console.log(`已生成 ${outDir}`)
}