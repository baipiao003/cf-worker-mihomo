import { processSubscription } from '../../utils/index.js';

export async function getv2ray_config(e) {
    const results = await processSubscription(e.urls, e.userAgent, e.sub, e.target);
    if (results.data?.data !== undefined && results.data?.data !== null && results.data?.data !== '') {
        return {
            status: results.status,
            headers: results.headers,
            data: results.data.data,
        };
    } else {
        throw new Error('获取订阅数据失败，请检查订阅链接是否有效');
    }
}
