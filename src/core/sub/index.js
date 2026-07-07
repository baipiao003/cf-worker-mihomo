import { ProxyUtils } from '../Sub-Store/backend/src/core/proxy-utils/index.js';
import { safeLoad, safeDump } from '../Sub-Store/backend/src/utils/yaml.js';
import { fetchpackExtract, fetchipExtract, fetchResponse } from '../../utils/index.js';
import YAML from 'yaml';
ProxyUtils.parse('dHJvamFuOi8vMmVhZGI5MmQtMTIwYi00OTllLTg3MDctYTg4ZTZhZDA4OWE5QDAuMC4wLjA6NDQzP3NlY3VyaXR5PXRscyZzbmk9ZXhhbXBsZS5jb20mZnA9Y2hyb21lJnR5cGU9d3MmaG9zdD0mcGF0aD0lMkYlM0ZlZCUzRDIwNDgmYWxwbj1oMyMlRTYlQkYlODAlRTYlQjQlQkJwZWdneQ==')

/*
 * @description 根据订阅 URL 获取代理节点，
 * 解析、去重节点名称，并根据目标平台生成对应订阅格式
 * @param {string|string[]} urls 订阅地址
 * @param {string} platform 输出平台类型
 * @returns {Object|string} 生成后的订阅数据
 */
export default async function produceArtifact(urls, platform) {
    let data = [], headers = []
    const responseProxies = [];
    const url = (Array.isArray(urls) ? urls : [urls]).map((i) => i.split(',')).flat();
    const responses = await Promise.all(url.map((url) => fetchResponse(url)));
    for (const res of responses) {
        if (!res?.data) continue;
        const raw = res.data
        let currentProxies = (Array.isArray(raw) ? raw : [raw])
            .map((i) => ProxyUtils.parse(i))
            .flat();
        responseProxies.push(currentProxies);
        headers.push({ status: res.status, headers: res.headers });
    }
    data = responseProxies.flat();
    const nameCount = {};
    data.forEach((item) => {
        const name = item.name;

        if (nameCount[name] === undefined) {
            nameCount[name] = 0;
        } else {
            nameCount[name]++;
            item.name = `${name} [${nameCount[name]}]`;
        }
    });
    let names = [];
    let index = 0;
    for (const proxies of responseProxies) {
        const currentNames = [];

        for (const proxy of proxies) {
            currentNames.push(data[index].name);
            index++;
        }

        names.push(currentNames);
    }
    data = ProxyUtils.produce(data, platform);
    if (
        [
            'mihomo',
            'clash',
            'meta',
            'clashmeta',
            'clash.meta'
        ].includes(platform.toLowerCase())
    ) {
        data = YAML.parse(data);
    }
    return { names, data, headers };
}