import fs from "fs";
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const list = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/iso/iso2_list.json"), "utf-8"));
const country = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/iso/country.json"), "utf-8"));

console.log("iso2_list ISO2 数量:", list.length);
console.log("country ISO2 数量:", country.length);

// ============================
// 1. 找缺失（正确写法）
// ============================
const missingInCountry = list.filter(code => !country.includes(code));
const missingInList = country.filter(code => !list.includes(code));

console.log("\n❌ country.json 缺少的 ISO2:");
console.log(missingInCountry);

console.log("\n❌ iso2_list.json 缺少的 ISO2:");
console.log(missingInList);

// ============================
// 2. 找重复（重点新增）
// ============================
function findDuplicates(arr) {
    const map = new Map();
    const dup = [];

    for (const item of arr) {
        map.set(item, (map.get(item) || 0) + 1);
    }

    for (const [key, count] of map.entries()) {
        if (count > 1) {
            dup.push({ code: key, count });
        }
    }

    return dup;
}

const dupList = findDuplicates(list);
const dupCountry = findDuplicates(country);

console.log("\n⚠️ iso2_list.json 重复项:");
console.log(dupList.length ? dupList : "无重复");

console.log("\n⚠️ country.json 重复项:");
console.log(dupCountry.length ? dupCountry : "无重复");

// ============================
// 3. 唯一化统计（可选）
// ============================
const uniqueList = [...new Set(list)];
const uniqueCountry = [...new Set(country)];

console.log("\n📊 去重后统计:");
console.log("list unique:", uniqueList.length);
console.log("country unique:", uniqueCountry.length);