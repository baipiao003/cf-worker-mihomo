// import fetch from 'node-fetch';
import YAML from 'yaml';
const isNode = eval(`typeof process !== "undefined"`);
const backimg = base64DecodeUtf8('aHR0cHM6Ly90LmFsY3kuY2MveWN5');
const subapi = isNode ? base64DecodeUtf8('aHR0cHM6Ly9zdWItc3RvcnQtbm9kZWpzLnBhZ2VzLmRldg==') : null;
const beiantext = base64DecodeUtf8('6JCMSUNQ5aSHMjAyNTAwMDHlj7c=');
const beiandizi = base64DecodeUtf8('aHR0cHM6Ly90Lm1lL01hcmlzYV9rcmlzdGk=');

/**
 * base64解码UTF-8字符串的函数
 * @param {*} str base64
 * @returns
 */
function base64DecodeUtf8(str) {
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

/**
 * api 拼接
 * @param {*} rawUrl uel 订阅
 * @param {*} BASE_API api 地址
 * @param {*} ua 请求头
 * @returns
 */
function buildApiUrl(rawUrl, BASE_API, ua) {
    const params = new URLSearchParams({
        target: ua,
        url: rawUrl,
        api: true,
    });
    return `${BASE_API}/sub?${params}`;
}

/**
 * 处理请求
 * @param {*} url
 * @param {*} userAgent
 * @returns
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
        return true;
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
 * 将订阅链接和代理地址分离
 * @param {*} urls
 * @returns
 */
function splitUrlsAndProxies(urls) {
    const result = [];
    let proxyText = '';

    for (const url of urls) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            result.push(url);
        } else {
            if (proxyText) {
                proxyText += ',';
            }
            proxyText += url;
        }
    }
    if (proxyText) {
        result.push(proxyText);
    }
    return result;
}

/**
 * 获取应用包名列表
 * @returns {Promise<Object>} - 返回配置数据对象
 */
async function fetchpackExtract() {
    const processNames = new Set();
    const excludeList = [
        { pkg: 'com.android.chrome', comment: 'Chrome浏览器' },
        { pkg: 'mark.via', comment: 'Via浏览器' },
        { pkg: 'com.baidu.browser.apps', comment: '百度浏览器' },
        { pkg: 'com.browser2345', comment: '2345浏览器' },
        { pkg: 'com.cat.readall', comment: '悟空浏览器' },
        { pkg: 'com.estrongs.android.pop', comment: 'ES文件浏览器' },
        { pkg: 'com.mmbox.xbrowser.pro', comment: 'X浏览器' },
        { pkg: 'com.mx.browser', comment: '傲游浏览器' },
        { pkg: 'com.oupeng.browser', comment: '欧朋浏览器极速版' },
        { pkg: 'com.oupeng.mini.android', comment: '欧朋浏览器' },
        { pkg: 'com.qihoo.browser', comment: '360浏览器' },
        { pkg: 'com.tencent.mtt', comment: 'QQ浏览器' },
        { pkg: 'com.UCMobile', comment: 'UC浏览器' },
        { pkg: 'com.ucmobile.lite', comment: 'UC浏览器极速版' },
        { pkg: 'com.ume.browser', comment: '微米浏览器' },
        { pkg: 'com.vivo.browser', comment: 'vivo浏览器' },
        { pkg: 'org.mozilla.fennec_mylinux', comment: '蚂蚁浏览器' },
        { pkg: 'sogou.mobile.explorer', comment: '搜狗浏览器极速版' },
    ];

    const excludeNames = new Set(excludeList.map((i) => i.pkg));

    const urls = [
        'https://cdn.jsdelivr.net/gh/mnixry/direct-android-ruleset@rules/@Merged/GAME.mutated.yaml',
        'https://cdn.jsdelivr.net/gh/mnixry/direct-android-ruleset@rules/@Merged/APP.mutated.yaml',
    ];

    const results = await Promise.allSettled(urls.map((url) => fetchResponse(url)));
    for (const res of results) {
        if (!res?.data?.payload?.length) continue;
        for (const line of res.data.payload) {
            const match = line.match(/PROCESS-NAME\s*,\s*([^\s,]+)/);
            if (!match) continue;
            const name = match[1];
            if (excludeNames.has(name)) continue;
            processNames.add(name);
        }
    }
    return [...processNames];
}

/**
 * 获取IPCIDR列表
 * @returns {Promise<Object>} - 返回配置数据对象
 */
async function fetchipExtract() {
    const url = 'https://cdn.jsdelivr.net/gh/Kwisma/clash-rules@release/cncidr.yaml';

    let res;
    try {
        res = await fetchResponse(url);
    } catch (err) {
        console.error(`❌ 请求异常: ${url}`, err);
        return null;
    }

    const payload = res?.data?.payload;

    if (!Array.isArray(payload) || payload.length === 0) {
        console.error(`❌ 请求失败或数据为空: ${url} - ${res?.status}`);
        return null;
    }

    return payload;
}

/**
 * 尝试使用原始URL请求，如果失败则使用构建的API URL进行请求
 * @param {string} url - 请求的URL
 * @param {Object} options - 请求选项，包括userAgent、sub、target等
 * @returns {Promise<Object>} - 返回请求结果对象
 */
async function fetchWithFallback(url, options) {
    if (options.fallback) {
        let res = await fetchResponse(url, options.userAgent);
        if (options.target === 'mihomo') {
            if (res?.data?.proxies && Array.isArray(res.data.proxies) && res.data.proxies.length > 0) {
                return res;
            }
        }
        if (options.target === 'singbox') {
            if (res?.data?.outbounds && Array.isArray(res.data.outbounds)) {
                return res;
            }
        }
    }
    // 如果第一次请求失败，尝试使用构建的API URL
    const apiUrl = buildApiUrl(url, options.sub, options.target);
    return await fetchResponse(apiUrl, options.userAgent);
}

/**
 * 导入 sub-store
 * @returns
 */
async function getNodeConversion() {
    return (await import('../core/sub/index.js')).default;
}

export {
    isNode,
    backimg,
    subapi,
    beiantext,
    beiandizi,
    buildApiUrl,
    fetchResponse,
    splitUrlsAndProxies,
    fetchpackExtract,
    fetchipExtract,
    fetchWithFallback,
    getNodeConversion,
};
