import { fetchWithFallback } from '../../utils/index.js';
// import processNodeConversion from '../sub/index.js'
export default async function getProxies_Data(e) {
    // let results = {}

    // if (e.sub) {
    //     results = await fetchWithFallback(e.urls, e)
    // } else {
    //     results = await processNodeConversion(e.urls, e.target, true)
    // }
    const results = await fetchWithFallback(e.urls, e);
    if (results.data.data?.proxies?.length === 0) {
        throw new Error('未从任何 URL 找到有效的节点');
    }
    processProxies(results.data.data.proxies, e, results.data.names);
    return {
        status: results.status,
        headers: results.headers,
        data: results.data.data,
    };
}

// 处理代理数组的辅助函数
function processProxies(proxies, options, names) {
    proxies.forEach((proxy) => {
        if (options.relay && names[0].includes(proxy.name)) {
            options.proxyname = names[0];
            options.dialerproxy = names.slice(1).flat();
            if (options.proxyname && options.dialerproxy) {
                proxy['dialer-proxy'] = '🔗链式前置';
            }
        }

        if (options.udp) {
            proxy.udp = true;
        }
        if (options.ech) {
            proxy['ech-opts'] = {
                enable: true,
                'query-server-name': 'cloudflare-ech.com',
            };
        }
    });
}
