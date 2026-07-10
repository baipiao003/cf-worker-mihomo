import YAML from 'yaml';
import { buildApiUrl } from './ApiUrl.js';

/**
 * 请求 URL 并解析响应数据。
 *
 * 自动处理 YAML、JSON 和纯文本格式，
 * 并过滤 hop-by-hop 响应头。
 *
 * @param {string} url - 请求地址
 * @param {string} [userAgent] - 请求 User-Agent
 * @returns {Promise<{
 *   status: number,
 *   headers: Object,
 *   data: Object|string|null,
 *   error?: Error
 * }>} 请求结果
 */
async function fetchResponse(url, userAgent) {
    if (!userAgent) {
        userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
    }
    let response;
    try {
        response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            },
        });
    } catch (error) {
        console.error(error);
        return {
            status: 0,
            headers: {},
            data: null,
            error,
        };
    }
    const rawHeaders = Object.fromEntries(response.headers.entries());
    const hopByHopHeaders = ['transfer-encoding', 'content-length', 'content-encoding', 'connection'];
    const headers = {};
    for (const [key, value] of Object.entries(rawHeaders)) {
        if (!hopByHopHeaders.includes(key.toLowerCase())) {
            headers[key] = value;
        }
    }
    const textData = await response.text();
    let data;

    try {
        data = YAML.parse(textData, { maxAliasCount: -1, merge: true });
    } catch {
        try {
            data = JSON.parse(textData);
        } catch {
            data = textData;
        }
    }

    return {
        status: response.status,
        headers,
        data,
    };
}

/**
 * 尝试请求订阅原始 URL。
 * 当启用 fallback 且原始请求结果不符合目标格式时，
 * 使用构建后的 API URL 重新请求。
 *
 * @param {string} url - 订阅源 URL
 * @param {Object} [options={}] - 请求配置
 * @param {string} [options.userAgent] - 请求 User-Agent
 * @param {boolean} [options.fallback=false] - 是否启用备用 API 请求
 * @param {string} [options.sub] - API 订阅参数
 * @param {string} [options.target] - 目标格式，如 mihomo、singbox
 * @returns {Promise<{
 *   status: number,
 *   headers: Object,
 *   data: Object|string|null
 * }>} 请求响应结果
 */
async function fetchWithFallback(url, options = {}) {
    const { sub = '', target = '', userAgent, fallback = false } = options;
    if (fallback) {
        let res = await fetchResponse(url, userAgent);
        if (target === 'mihomo') {
            if (res?.data?.proxies && Array.isArray(res.data.proxies) && res.data.proxies.length > 0) {
                return res;
            }
        }
        if (target === 'singbox') {
            if (res?.data?.outbounds && Array.isArray(res.data.outbounds)) {
                return res;
            }
        }
    }
    // 如果第一次请求失败，尝试使用构建的API URL
    const apiUrl = buildApiUrl(url, sub, target);
    return await fetchResponse(apiUrl, userAgent);
}
export { fetchResponse, fetchWithFallback };
