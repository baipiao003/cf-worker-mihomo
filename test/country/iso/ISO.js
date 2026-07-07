import fs from "fs/promises";
import * as cheerio from "cheerio";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    // === 方式1：读取本地 HTML ===
    // const html = await fs.readFile("./file.html", "utf8");

    // === 方式2：抓网页（可选）===
    const html = (await axios.get("https://countrycodebase.com/zh-hans/iso-codes/")).data;

    const $ = cheerio.load(html);

    const iso2List = [];

    $("tr").slice(1).each((_, row) => {
        const tds = $(row).find("td");

        const iso2 = $(tds[2]).text().trim();

        if (iso2) iso2List.push(iso2);
    });

    console.log("ISO 两字母代码数量:", iso2List.length);
    fs.writeFile(path.join(__dirname, "iso2_list.json"), JSON.stringify(iso2List, null, 2), "utf8");
}

run();