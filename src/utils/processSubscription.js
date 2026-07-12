import { fetchWithFallback } from './fetchResponse';
import { getNodeConversion } from './substore';
/**
 * 订阅转换
 *
 * 根据订阅类型选择不同处理方式：
 * - sub 为真：直接通过 fetchWithFallback 获取订阅内容
 * - sub 为假：加载 Node 转换模块进行节点转换
 *
 * @param {string|string[]} urls - 订阅地址，可以是单个 URL 或 URL 数组
 * @param {string} userAgent - 请求 User-Agent
 * @param {boolean} fallback - 是否启用备用请求方式
 * @param {boolean} sub - 是否为普通订阅模式
 * @param {string} target - 转换目标格式（如 clash、singbox 等）
 * @returns {Promise<any>} 处理后的订阅结果
 */
export async function processSubscription(urls, userAgent, sub, target) {
    if (sub) {
        return await fetchWithFallback(urls, { userAgent, sub, target });
    }

    const proce = await getNodeConversion();
    return await proce(urls, target, true);
}
