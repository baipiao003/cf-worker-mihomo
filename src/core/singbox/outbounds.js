import { fetchWithFallback } from '../../utils/index.js';
// import processNodeConversion from '../sub/index.js'
export default async function getOutbounds_Data(e) {
    // let results = {}
    // if (e.sub) {
    //     results = await fetchWithFallback(e.urls, e)
    // } else {
    //     results = await processNodeConversion(e.urls, e.target, true)
    // }
    const results = await fetchWithFallback(e.urls, e);
    if (results.data.data?.outbounds?.length === 0) {
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
    const isV113 = /1\.(1[3-9]|[3-9]\d)/i.test(options.userAgent);
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
                    ...(isV113 && { query_server_name: 'cloudflare-ech.com' }),
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
