import { processSubscription } from '../../utils/index.js';

/**
 * 获取并处理 outbound 节点数据
 *
 * 根据配置选择不同的数据获取方式：
 * - e.sub 为 true 时，通过订阅地址获取节点
 * - e.sub 为 false 时，通过节点转换模块解析节点
 *
 * 获取完成后会执行 outbound 处理逻辑，并返回标准化响应数据。
 *
 * @param {Object} e - 请求配置参数
 * @param {boolean} e.sub - 是否使用订阅模式
 * @param {string|string[]} e.urls - 节点订阅地址或节点数据地址
 * @param {string} [e.target] - 节点转换目标格式
 *
 * @returns {Promise<Object>} outbound 数据结果
 * @returns {number} returns.status - 请求状态码
 * @returns {Object} returns.headers - 响应头信息
 * @returns {Object} returns.data - 处理后的配置数据
 *
 * @throws {Error} 当未找到有效节点时抛出异常
 */
export default async function getOutbounds_Data(e) {
    const results = await processSubscription(e.urls, e.userAgent, e.sub, e.target);
    if (results.data?.data?.outbounds?.length === 0) {
        throw new Error('未从任何 URL 找到有效的节点');
    }
    processOutbounds(results.data.data.outbounds, e, results.data.names);
    return {
        status: results.status,
        headers: results.headers,
        data: results.data.data,
    };
}

// 处理 outbounds 数组
function processOutbounds(outbounds, options, names) {
    outbounds.forEach((outbound) => {
        if (options.relay && names[0].includes(outbound.tag)) {
            options.proxyname = names[0];
            options.dialerproxy = names.slice(1).flat();
            if (options.proxyname && options.dialerproxy) {
                outbound.detour = '🔗链式前置';
            }
        }
        if (options.udp_fragment) {
            outbound.udp_fragment = true;
        }
        if (options.ech && outbound.tls && !outbound.tls?.reality) {
            outbound.tls = {
                ...outbound.tls,
                ech: {
                    enabled: true,
                    query_server_name: 'cloudflare-ech.com',
                },
            };
        }
    });
}

// 格式化响应
function formatResponse(response) {
    return {
        status: response.status,
        headers: response.headers,
        data: response.data,
    };
}
