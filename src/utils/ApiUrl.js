/**
 * 构建订阅 API 请求地址。
 *
 * @param {string} rawUrl - 原始订阅 URL
 * @param {string} BASE_API - API 基础地址
 * @param {string} ua - 目标客户端类型
 * @returns {string} API 请求地址
 */
function buildApiUrl(rawUrl, BASE_API, ua) {
    if (!BASE_API) {
        throw new Error('BASE_API is required');
    }
    const params = new URLSearchParams({
        target: ua,
        url: rawUrl,
        api: true,
    });
    return `${BASE_API.replace(/\/$/, '')}/sub?${params}`;;
}

/**
 * 分离订阅链接和代理字符串。
 *
 * HTTP/HTTPS 地址作为订阅链接保留，
 * 其他内容合并为代理参数。
 *
 * @param {string[]} urls - 输入地址列表
 * @returns {string[]} 分离后的地址列表
 */
function splitUrlsAndProxies(urls = []) {
    const urlsList = [];
    const proxies = [];

    for (const item of urls) {
        if (/^https?:\/\//.test(item)) {
            urlsList.push(item);
        } else {
            proxies.push(item);
        }
    }

    if (proxies.length) {
        urlsList.push(proxies.join(','));
    }

    return urlsList;
}
export { buildApiUrl, splitUrlsAndProxies };
