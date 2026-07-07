import fs from 'fs';
import yaml from 'yaml';

// 读取原始配置文件
const originalRaw = fs.readFileSync('./country_singbox.yaml', 'utf8');
const originalData = yaml.parse(originalRaw);

// 读取正则表达式文件
const regexRaw = fs.readFileSync('./regex_only.yaml', 'utf8');
const regexData = yaml.parse(regexRaw);

// 创建国家标志到正则表达式的映射
const flagToRegex = {};
for (const [flag, regex] of Object.entries(regexData)) {
    flagToRegex[flag] = regex;
}

// 遍历原始数据，替换 keywords
for (const item of originalData.data) {
    if (item.tag && item.filter && Array.isArray(item.filter)) {
        // 从 tag 中提取国旗标志
        const flagMatch = item.tag.match(/[\p{Emoji_Presentation}\p{Emoji}\u200d]+/u);
        if (flagMatch) {
            const flag = flagMatch[0];

            // 如果存在对应的正则表达式，则替换 keywords
            if (flagToRegex[flag]) {
                for (const filterItem of item.filter) {
                    if (filterItem.keywords) {
                        filterItem.keywords = flagToRegex[flag];
                        console.log(`已替换 ${item.tag} 的 keywords: ${flagToRegex[flag]}`);
                    }
                }
            }
        }
    }
}

// 写入更新后的文件
fs.writeFileSync('updated_country.yaml', yaml.stringify(originalData), 'utf8');
console.log('已生成 updated_country.yaml');
