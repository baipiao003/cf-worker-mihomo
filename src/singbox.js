import * as utils from './utils.js';
export async function getsingbox_config(e) {
    const top = Verbose(e);
    e.urls = utils.splitUrlsAndProxies(e.urls);
    const [Singbox_Top_Data, Singbox_Rule_Data, Singbox_Outbounds_Data, Exclude_Package, Exclude_Address] = await Promise.all([
        utils.Top_Data(top),
        utils.Rule_Data(e.rule),
        getSingbox_Outbounds_Data(e),
        e.exclude_package ? utils.fetchpackExtract() : null,
        e.exclude_address ? utils.fetchipExtract() : null,
    ]);

    if (!Singbox_Outbounds_Data?.data?.outbounds || Singbox_Outbounds_Data?.data?.outbounds?.length === 0)
        throw new Error(`节点为空，请使用有效订阅`);

    Singbox_Outbounds_Data.data.outbounds = outboundArrs(Singbox_Outbounds_Data.data);
    const ApiUrlname = [];
    Singbox_Outbounds_Data.data.outbounds.forEach((res) => {
        ApiUrlname.push(res.tag);
    });
    // 策略组处理
    Singbox_Rule_Data.data.outbounds = loadAndSetOutbounds(Singbox_Rule_Data.data.outbounds, ApiUrlname);
    // 合并 outbounds
    Singbox_Rule_Data.data.outbounds.push(...Singbox_Outbounds_Data.data.outbounds);
    if (e.exclude_package) addExcludePackage(Singbox_Top_Data.data, Exclude_Package);
    if (e.exclude_address) addExcludeAddress(Singbox_Top_Data.data, Exclude_Address);
    if (e.tailscale) {
        // 添加 tailscale 相关配置
        Singbox_Top_Data.data.dns.server.push({
            type: 'tailscale',
            endpoint: 'ts-ep',
            accept_default_resolvers: true,
        });
        if (!Singbox_Top_Data.data.endpoints) {
            Singbox_Top_Data.data.endpoints = [];
        }
        Singbox_Top_Data.data.endpoints.push({
            type: 'tailscale',
            tag: 'ts-ep',
            auth_key: '',
            hostname: 'singbox-tailscale',
            udp_timeout: '5m',
        });
    }
    applyTemplate(Singbox_Top_Data.data, Singbox_Rule_Data.data);
    return {
        status: Singbox_Outbounds_Data.status,
        headers: Singbox_Outbounds_Data.headers,
        data: JSON.stringify(Singbox_Top_Data.data, null, 4),
    };
}

export function Verbose(e) {
    let top,
        matched = false;
    const alphaMatch = e.userAgent.match(/1\.12\.0\-alpha\.(\d{1,2})\b/);
    const betaMatch = e.userAgent.match(/1\.12\.0\-beta\.(\d{1,2})\b/);
    const v111Match = e.userAgent.match(/1\.11\.(\d+)/);
    const v112Match = e.userAgent.match(/1\.12\.(\d+)/);
    if (!/singbox|sing-box|sfa/i.test(e.userAgent)) throw new Error('不支持的客户端');
    // 匹配 1.12 alpha 版本
    if (alphaMatch && !matched) {
        const num = parseInt(alphaMatch[1], 10);
        if (num >= 0 && num <= 23) {
            top = e.singbox_1_12_alpha;
            matched = true;
        }
    }
    // 匹配 1.11 中的 1.12 beta 版本
    if (betaMatch && !matched) {
        const num = parseInt(betaMatch[1], 10);
        if (num >= 0 && num <= 9) {
            top = e.singbox_1_11;
            matched = true;
        }
    }
    // 匹配 1.11.x 版本
    if (v111Match && !matched) {
        top = e.singbox_1_11;
        matched = true;
    }
    // 匹配 1.12.x 版本
    if (v112Match && !matched) {
        top = e.singbox_1_12;
        matched = true;
    }
    if (!matched) {
        throw new Error(`不支持的 Singbox 版本：${e.userAgent}`);
    }
    return top;
}
/**
 * 加载多个配置 URL，对其 outbounds 进行合并处理。
 * 对第一个配置不添加 tag 后缀，其余的添加 `[序号]`。
 */
export async function getSingbox_Outbounds_Data(e) {
    let res;
    if (e.urls.length === 1) {
        res = await utils.fetchResponse(e.urls[0], e.userAgent);
        if (res?.data?.outbounds && Array.isArray(res?.data?.outbounds) && res?.data?.outbounds?.length > 0) {
            res.data.outbounds.forEach((p) => {
                if (e.udp) p.udp_fragment = true;
            });
            return {
                status: res.status,
                headers: res.headers,
                data: res.data,
            };
        } else {
            const apiurl = utils.buildApiUrl(e.urls[0], e.sub, 'singbox');
            res = await utils.fetchResponse(apiurl, e.userAgent);
            if (res?.data?.outbounds && Array.isArray(res?.data?.outbounds) && res?.data?.outbounds?.length > 0) {
                res.data.outbounds.forEach((p) => {
                    if (e.udp) p.udp_fragment = true;
                });
                return {
                    status: res.status,
                    headers: res.headers,
                    data: res.data,
                };
            }
        }
    } else {
        const outbounds_list = [];
        const hesList = [];
        let res;
        for (let i = 0; i < e.urls.length; i++) {
            res = await utils.fetchResponse(e.urls[i], e.userAgent);
            if (res?.data && Array.isArray(res?.data?.outbounds)) {
                res.data.outbounds.forEach((p) => {
                    p.tag = `${p.tag} [${i + 1}]`;
                    if (e.udp) p.udp_fragment = true;
                });
                hesList.push({
                    status: res.status,
                    headers: res.headers,
                });
                outbounds_list.push(res.data.outbounds);
            } else {
                const apiurl = utils.buildApiUrl(e.urls[i], e.sub, 'singbox');
                res = await utils.fetchResponse(apiurl, e.userAgent);
                if (res?.data?.outbounds && Array.isArray(res?.data?.outbounds)) {
                    res.data.outbounds.forEach((p) => {
                        p.tag = `${p.tag} [${i + 1}]`;
                        if (e.udp) p.udp_fragment = true;
                    });
                    hesList.push({
                        status: res.status,
                        headers: res.headers,
                    });
                    outbounds_list.push(res.data.outbounds);
                }
            }
        }
        const randomIndex = Math.floor(Math.random() * hesList.length);
        const hes = hesList[randomIndex];
        const data = { outbounds: outbounds_list.flat() };
        return {
            status: hes.status,
            headers: hes.headers,
            data: data,
        };
    }
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
// 策略组处理
export function loadAndSetOutbounds(Outbounds, ApiUrlname) {
    Outbounds.forEach((res) => {
        // 从完整 outbound 名称开始匹配
        let matchedOutbounds;
        let hasValidAction = false;
        res.filter?.forEach((ac) => {
            // 转换为 RegExp 对象
            const keywordReg = new RegExp(ac.keywords) || '';
            if (ac.action === 'include') {
                // 只保留匹配的
                matchedOutbounds = ApiUrlname.filter((name) => keywordReg.test(name));
                hasValidAction = true;
            } else if (ac.action === 'exclude') {
                // 移除匹配的
                matchedOutbounds = ApiUrlname.filter((name) => !keywordReg.test(name));
                hasValidAction = true;
            } else if (ac.action === 'all') {
                // 全部保留
                matchedOutbounds = ApiUrlname;
                hasValidAction = true;
            }
        });
        if (hasValidAction) {
            // 写入去重后的 outbounds
            res.outbounds = [...res.outbounds, ...new Set(matchedOutbounds)];
        } else if (res.outbounds !== null) {
            // 没有有效操作，但原始 outbounds 存在，保留原值
            matchedOutbounds = res.outbounds;
        } else {
            // 无有效操作，且原始 outbounds 不存在，删除该字段（不写入）
            delete res.outbounds;
        }
        // 删除 filter 字段
        delete res.filter;
        return res;
    });
    // 找出被删除的策略组 tags（即 outbounds 为空的 selector）
    const removedTags = Outbounds.filter((item) => Array.isArray(item.outbounds) && item.outbounds.length === 0).map((item) => item.tag);
    // 过滤掉引用了已删除 tag 的其他 outbounds 项
    const cleanedOutbounds = Outbounds.map((item) => {
        if (Array.isArray(item.outbounds)) {
            item.outbounds = item.outbounds.filter((tag) => !removedTags.includes(tag));
        }
        return item;
    });

    // 再次过滤掉 outbounds 数组为空的策略组
    const filteredOutbounds = cleanedOutbounds.filter((item) => {
        return !(Array.isArray(item.outbounds) && item.outbounds.length === 0);
    });
    return filteredOutbounds;
}
export function applyTemplate(top, rule) {
    const existingSet = Array.isArray(top.route.rule_set) ? top.route.rule_set : [];
    const newSet = Array.isArray(rule.route.rule_set) ? rule.route.rule_set : [];
    const mergedMap = new Map();
    for (const item of existingSet) {
        if (item?.tag) mergedMap.set(item.tag, item);
    }
    for (const item of newSet) {
        if (item?.tag) mergedMap.set(item.tag, item);
    }
    top.inbounds = rule?.inbounds || top.inbounds;
    top.outbounds = [...(Array.isArray(top.outbounds) ? top.outbounds : []), ...(Array.isArray(rule?.outbounds) ? rule.outbounds : [])];
    top.route.final = rule?.route?.final || top.route.final;
    top.route.rules = [...(Array.isArray(top.route.rules) ? top.route.rules : []), ...(Array.isArray(rule?.route?.rules) ? rule.route.rules : [])];
    top.route.rule_set = Array.from(mergedMap.values());
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
