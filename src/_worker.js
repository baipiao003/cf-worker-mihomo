import { getmihomo_config } from './mihomo.js';
import { getsingbox_config } from './singbox.js';
import { getFakePage } from './page.js';
import * as utils from './utils.js';
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const e = {
            url,
            urls: url.searchParams.getAll('url'),
            userAgent: request.headers.get('User-Agent'),
            rule: url.searchParams.get('template'),
            singbox: url.searchParams.get('singbox') === 'true',
            mihomo: url.searchParams.get('mihomo') === 'true',
            udp: url.searchParams.get('udp') === 'true',
            exclude_package: url.searchParams.get('ep') === 'true',
            exclude_address: url.searchParams.get('ea') === 'true',
            tailscale: url.searchParams.get('tailscale') === 'true',
            IMG: env.IMG || utils.backimg,
            sub: env.SUB || utils.subapi,
            Mihomo_default: env.MIHOMOTOP || utils.mihomo_top,
            singbox_1_11: env.SINGBOX_1_11 || utils.singbox_1_11,
            singbox_1_12: env.SINGBOX_1_12 || utils.singbox_1_12,
            singbox_1_12_alpha: env.SINGBOX_1_12_ALPHA || utils.singbox_1_12_alpha,
            beian: env.BEIAN || utils.beiantext,
            beianurl: env.BEIANURL || utils.beiandizi,
            configs: utils.configs(env.MIHOMO, env.SINGBOX)
        }

        if (e.urls.length === 1 && e.urls[0].includes(',')) {
            e.urls = e.urls[0].split(',').map((u) => u.trim()); // 拆分并去除空格
        }

        if (e.urls.length === 0 || e.urls[0] === '') {
            return new Response(await getFakePage(e), {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });
        }
        try {
            let res, headers, status;
            if (e.singbox) {
                res = await getsingbox_config(e);
            } else {
                res = await getmihomo_config(e);
            }
            const responseHeaders = res.headers;
            headers = new Headers(responseHeaders);
            status = res.status;
            headers.set('Content-Type', 'application/json; charset=utf-8');
            headers.set('Profile-web-page-url', url.origin);

            return new Response(res.data, {
                status,
                headers,
            });
        } catch (err) {
            return new Response(err.message, {
                status: 400,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
        }
    },
};
