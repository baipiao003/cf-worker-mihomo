import { fetchpackExtract, fetchipExtract, fetchResponse } from '../../utils/index.js';
import getOutbounds_Data from './outbounds.js';
import { Verbose } from './Verbose.js';
import { loadAndSetOutbound } from './grouping.js';
export async function getsingbox_config(e) {
    const config = structuredClone(Verbose(e));
    const alldata = await Promise.all([
        getOutbounds_Data(e),
        fetchResponse(e.rule),
        e.exclude_package ? fetchpackExtract() : null,
        e.exclude_address ? fetchipExtract() : null,
    ]);
    // 获取订阅数据
    const Outbounds_Data = alldata[0];
    if (Outbounds_Data?.data?.outbounds?.length === 0) {
        throw new Error(`节点为空，请使用有效订阅`);
    }
    // 获取规则数据
    const Rule_Data = alldata[1];
    if (!Rule_Data?.data) {
        throw new Error('获取规则数据失败');
    }

    e.Package = alldata[2];
    e.Address = alldata[3];

    // 处理节点数据
    Outbounds_Data.data.outbounds = outboundArrs(Outbounds_Data.data);
    const ApiUrlname = Outbounds_Data.data.outbounds.map((res) => res.tag);

    // 策略组处理
    Rule_Data.data.outbounds = loadAndSetOutbound(Rule_Data.data.outbounds, ApiUrlname, e);

    // 合并节点
    Rule_Data.data.outbounds.push(...Outbounds_Data.data.outbounds);
    applyTemplate(config, Rule_Data.data, e);
    return {
        status: Outbounds_Data.status,
        headers: Outbounds_Data.headers,
        data: JSON.stringify(config, null, 4),
    };
}

/**
 * 处理配置文件中的 outbounds 数组：
 * 1. 先排除特定类型（如 direct、dns 等）；
 * 2. 根据参数决定是否为 tag 添加序号后缀；
 *
 * @param {Object} data - 包含 outbounds 数组的配置对象
 * @returns {Array<Object>} 处理后的 outbounds 数组
 */
export function outboundArrs(data) {
    const excludedTypes = ['direct', 'block', 'dns', 'selector', 'urltest'];
    if (data && Array.isArray(data.outbounds)) {
        const filteredOutbounds = data.outbounds.filter((outbound) => {
            if (excludedTypes.includes(outbound.type)) return false;
            if (outbound?.server === '') return false;
            if (outbound?.server_port < 1) return false;
            if (outbound?.password === '') return false;
            return true;
        });
        return filteredOutbounds;
    }
}

export function applyTemplate(top, rule, e) {
    const existingSet = Array.isArray(top.route.rule_set) ? top.route.rule_set : [];
    const newSet = Array.isArray(rule.route.rule_set) ? rule.route.rule_set : [];
    const mergedMap = new Map();
    for (const item of existingSet) {
        if (item?.tag) mergedMap.set(item.tag, item);
    }
    for (const item of newSet) {
        if (item?.tag) mergedMap.set(item.tag, item);
    }
    if (e.log) top.log.level = e.log;
    top.inbounds = [...(top.inbounds || []), ...(rule.inbounds || [])];
    top.outbounds = [...(top.outbounds || []), ...(rule.outbounds || [])];
    top.route.final = rule?.route?.final || top.route.final;
    top.route.rules = [...(top.route.rules || []), ...(rule.route.rules || [])];
    top.route.rule_set = [...mergedMap.values()];

    // 添加排除包和排除地址配置
    if (e.tun) {
        top.inbounds = top.inbounds.filter((p) => p.type !== 'tun');
    } else {
        if (e.exclude_package && e.Package) addExcludePackage(top, e.Package);
        if (e.exclude_address && e.Address) addExcludeAddress(top, e.Address);
    }
    // 添加 tailscale 相关配置
    if (e.tailscale) {
        top.dns.servers.push({
            type: 'tailscale',
            endpoint: 'ts-ep',
            accept_default_resolvers: true,
        });
        top.endpoints = top.endpoints || [];
        top.endpoints.push({
            type: 'tailscale',
            tag: 'ts-ep',
            auth_key: '',
            hostname: 'singbox-tailscale',
            udp_timeout: '5m',
        });
    }

    if (/ref1nd/i.test(e.userAgent)) {
        for (const item of top.route.rules) {
            if (item.action === 'resolve') {
                item.match_only = true;
            }
        }
    }
    // 处理 route-options 规则
    top.route.rules = top.route.rules.flatMap((p) => {
        if (p.action === 'route-options') {
            if (e.udp) {
                p.udp_disable_domain_unmapping = true;
                p.udp_connect = true;
                p.udp_timeout = '500ms';
            }
            if (e.tls_fragment) {
                p.tls_fragment = true;
                p.tls_fragment_fallback_delay = '500ms';
            }
            // 如果既没有 udp 也没有 tls_fragment 参数，则过滤掉该规则
            return e.udp || e.tls_fragment ? p : [];
        }
        return p;
    });
    const isV112 = /1\.(1[2-9]|[2-9]\d)\.\d+/i.test(e.userAgent);
    if (e.adgdns) {
        top.dns.servers = top.dns.servers.map((p) => {
            if (p.tag === 'DIRECT-DNS') {
                return isV112
                    ? {
                        type: 'https',
                        tag: 'DIRECT-DNS',
                        detour: '🎯 全球直连',
                        server: 'doh.18bit.cn',
                        domain_resolver: 'local',
                    }
                    : {
                        tag: 'DIRECT-DNS',
                        address_resolver: 'local',
                        address: 'https://doh.18bit.cn/dns-query',
                        detour: '🎯 全球直连',
                    };
            }
            if (p.tag === 'PROXY-DNS') {
                return isV112
                    ? {
                        type: 'https',
                        tag: 'PROXY-DNS',
                        detour: '🚀 节点选择',
                        server_port: 443,
                        server: 'dns.adguard-dns.com',
                        path: '/dns-query',
                        domain_resolver: 'local',
                    }
                    : {
                        tag: 'DIRECT-DNS',
                        address_resolver: 'local',
                        address: 'https://dns.adguard-dns.com/dns-query',
                        detour: '🎯 全球直连',
                    };
            }
            return p;
        });
    }
    // Singbox v1.14.0-alpha.13 引入了 http_clients 代替 download_detour 字段
    function parse(v) {
        const m = v.match(/1\.(\d+)\.(\d+)(?:-alpha\.(\d+))?/i);
        if (!m) return null;
        return {
            minor: +m[1],
            patch: +m[2],
            alpha: m[3] !== undefined ? +m[3] : Infinity,
        };
    }
    function gt(a, b) {
        if (a.minor !== b.minor) return a.minor > b.minor;
        if (a.patch !== b.patch) return a.patch > b.patch;
        return a.alpha > b.alpha;
    }
    const v = parse(e.userAgent);
    const isV114 = v && gt(v, { minor: 14, patch: 0, alpha: 12 });
    if (isV114) {
        const proxyname = rule.outbounds[0].tag;
        top.http_clients = [
            {
                tag: 'DIRECT-clients',
                engine: 'go',
                version: 2,
                disable_version_fallback: false,
                detour: '🎯 全球直连',
            },
            {
                tag: 'PROXY-clients',
                engine: 'go',
                version: 2,
                disable_version_fallback: false,
                detour: proxyname,
            },
        ];
        // 替换 download_detour
        top.route.rule_set = top.route.rule_set.map((p) => {
            if (p.download_detour) {
                const { download_detour, ...rest } = p;
                return {
                    ...rest,
                };
            }
            return p;
        });
        top.route.default_http_client = 'DIRECT-clients';
    }
    return top;
}

export function addExcludePackage(singboxTopData, newPackages) {
    for (const inbound of singboxTopData.inbounds) {
        if (inbound.type === 'tun') {
            if (!Array.isArray(inbound['exclude_package'])) {
                inbound['exclude_package'] = [];
            }
            inbound['exclude_package'] = Array.from(new Set([...(inbound['exclude_package'] || []), ...newPackages]));
        }
    }
}

export function addExcludeAddress(singboxTopData, newddress) {
    for (const inbound of singboxTopData.inbounds) {
        if (inbound.type === 'tun') {
            inbound['route_address'] = ['0.0.0.0/1', '128.0.0.0/1', '::/1', '8000::/1'];
            if (!Array.isArray(inbound['route_exclude_address'])) {
                inbound['route_exclude_address'] = [];
            }
            inbound['route_exclude_address'] = Array.from(new Set([...(inbound['route_exclude_address'] || []), ...newddress]));
        }
    }
}
