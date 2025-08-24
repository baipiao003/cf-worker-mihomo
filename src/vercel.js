import { getmihomo_config } from './mihomo.js';
import { getsingbox_config } from './singbox.js';
import { getFakePage } from './page.js';
import * as utils from './utils.js';
export default async function handler(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const e = {
        url,
        urls: url.searchParams.getAll('url'),
        userAgent: req.headers['user-agent'],
        rule: url.searchParams.get('template'),
        singbox: url.searchParams.get('singbox') === 'true',
        mihomo: url.searchParams.get('mihomo') === 'true',
        udp: url.searchParams.get('udp') === 'true',
        exclude_package: url.searchParams.get('ep') === 'true',
        exclude_address: url.searchParams.get('ea') === 'true',
        tailscale: url.searchParams.get('tailscale') === 'true',
        IMG: process.env.IMG || utils.backimg,
        sub: process.env.SUB || utils.subapi,
        Mihomo_default: process.env.MIHOMOTOP || utils.mihomo_top,
        singbox_1_11: process.env.SINGBOX_1_11 || utils.singbox_1_11,
        singbox_1_12: process.env.SINGBOX_1_12 || utils.singbox_1_12,
        singbox_1_12_alpha: process.env.SINGBOX_1_12_ALPHA || utils.singbox_1_12_alpha,
        beian: process.env.BEIAN || utils.beiantext,
        beianurl: process.env.BEIANURL || utils.beiandizi,
        configs: utils.configs(process.env.MIHOMO, process.env.SINGBOX),
    };
    if (e.urls.length === 1 && e.urls[0].includes(',')) {
        e.urls = e.urls[0].split(',').map((u) => u.trim());
    }

    if (e.urls.length === 0 || e.urls[0] === '') {
        const html = await getFakePage(e);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.statusCode = 200;
        res.end(html);
        return;
    }

    try {
        let result;
        if (e.singbox) {
            result = await getsingbox_config(e);
        } else {
            result = await getmihomo_config(e);
        }

        const rawHeaders = result.headers;
        const headersToIgnore = ['transfer-encoding', 'content-length', 'content-encoding', 'connection'];

        for (const [key, value] of Object.entries(rawHeaders)) {
            if (!headersToIgnore.includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Profile-web-page-url', url.origin);
        res.statusCode = result.status || 200;
        res.end(result.data);
    } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: err.message }));
    }
}
