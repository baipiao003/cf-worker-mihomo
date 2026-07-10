import { fetchResponse } from './fetchResponse.js'
/**
 * 获取 IP CIDR 列表。
 *
 * @returns {Promise<string[]|null>} 返回 CIDR 配置列表
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
export { fetchipExtract };
