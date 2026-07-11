import { ProxyUtils } from '../Sub-Store/backend/src/core/proxy-utils/index.js';
import PROXY_PRODUCERS from '../Sub-Store/backend/src/core/proxy-utils/producers/index.js';
import { fetchResponse } from '../../utils/index.js';
import YAML from 'yaml';

/**
 * 处理节点转换请求
 *
 * 接收节点数组或订阅地址，按照目标平台转换节点格式，
 * 支持返回完整转换数据或包含节点名称的数据结构。
 *
 * @param {Array<string>|string} urlArray - 输入的节点内容或订阅地址数组
 * @param {string} platform - 目标平台类型（如 mihomo、clash 等）
 * @param {boolean} api - 是否以 API 格式返回数据（包含 names 字段）
 *
 * @returns {Promise<{
 *   status: number,
 *   data: any,
 *   headers: object|Array
 * }>} 节点转换结果
 *
 * @throws {Error} 节点处理过程中发生异常时捕获并返回错误信息
 */
export default async function processNodeConversion(urlArray, platform, api) {
    const results = {
        data: {},
        headers: [],
    };
    urlArray = Array.isArray(urlArray) ? urlArray : [urlArray];
    if (!urlArray || urlArray.length === 0) {
        results.status = 400;
        results.data = '输入节点数组不能为空';
        return results;
    }
    if (!PROXY_PRODUCERS[platform]) {
        results.status = 400;
        results.data = `目标平台：不支持 ${platform}！`;
        return results;
    }
    try {
        const { names, data, headers } = await produceArtifact(urlArray, platform);
        api
            ? (results.data = {
                  names,
                  data,
              })
            : (results.data = data);
        if (headers.length) {
            results.headers = headers[Math.floor(Math.random() * headers.length)];
        }
    } catch (error) {
        results.status = 500;
        results.data = `处理节点失败：${error.message}`;
        return results;
    }
    results.status = 200;
    return results;
}

/**
 * @description 根据订阅 URL 获取代理节点，
 * 解析、去重节点名称，并根据目标平台生成对应订阅格式
 * @param {string|string[]} urls 订阅地址
 * @param {string} platform 输出平台类型
 * @returns {Object|string} 生成后的订阅数据
 */
async function produceArtifact(urls, platform) {
    let data = [],
        headers = [];
    const responseProxies = [];
    const url = (Array.isArray(urls) ? urls : [urls]).map((i) => i.split(',')).flat();
    const invalidUrls = url.filter((item) => !isUrl(item));
    const validUrls = url.filter((item) => isUrl(item));
    if (invalidUrls.length) {
        const currentProxies = invalidUrls
            .map((i) => ProxyUtils.parse(i))
            .flat()
            .filter(Boolean);

        if (currentProxies.length) {
            responseProxies.push(currentProxies);
        }
    }
    const responses = await Promise.all(validUrls.map((url) => fetchResponse(url)));
    for (const res of responses) {
        if (!res?.data) continue;
        const raw = res.data;
        let currentProxies = (Array.isArray(raw) ? raw : [raw]).map((i) => ProxyUtils.parse(i)).flat();
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
    data = testJSON(data);
    if (['mihomo', 'clash', 'meta', 'clashmeta', 'clash.meta'].includes(platform.toLowerCase())) {
        data = YAML.parse(data);
    }
    return { names, data, headers };
}

/**
 * 判断字符串是否为有效的 HTTP/HTTPS URL
 *
 * @param {string} str - 待检测的字符串
 * @returns {boolean} 是否为有效 URL
 */
function isUrl(str) {
    try {
        const url = new URL(str);
        return ['http:', 'https:'].includes(url.protocol);
    } catch {
        return false;
    }
}

/**
 *
 * @param {string} 转化数据类型
 * @returns 转化后的数据
 */
function testJSON(data) {
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
}
