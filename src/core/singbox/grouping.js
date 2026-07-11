/**
 * 根据节点名称和过滤规则动态生成 outbound 节点列表
 *
 * 功能：
 * - 解析 outbound.filter 配置
 * - 支持 all / include / exclude 过滤动作
 * - 支持字符串和数组形式 keywords
 * - 自动匹配 ApiUrlname 节点并写入 outbound.outbounds
 * - 支持 relay 链式代理模式
 * - 清理无效 outbound tag 引用
 *
 * @param {Array<Object>} Outbounds - 原始 outbound 配置列表
 * @param {string[]} ApiUrlname - 节点名称列表
 * @param {Object} e - 运行参数
 *
 * @param {boolean} [e.relay=false] - 是否启用链式代理
 * @param {string[]} [e.proxyname] - 链式代理前置 outbound 列表
 * @param {string[]} [e.dialerproxy] - 链式代理落地 outbound 列表
 *
 * @returns {Array<Object>} 处理后的 outbound 配置列表
 *
 * @example
 * loadAndSetOutbound(
 *   [
 *     {
 *       tag: "🇯🇵日本",
 *       type: "urltest",
 *       filter: [
 *         {
 *           action: "include",
 *           keywords: ["(?i)日本"]
 *         }
 *       ]
 *     }
 *   ],
 *   [
 *     "日本东京01",
 *     "美国洛杉矶01"
 *   ],
 *   {
 *     relay: false
 *   }
 * );
 */
export function loadAndSetOutbound(Outbounds, ApiUrlname, e) {
    // 1. 预处理：将 ApiUrlname 转为 Set 以便快速查找
    const apiUrlSet = new Set(ApiUrlname);

    // 2. 预编译所有过滤器的正则表达式
    const compiledOutbounds = Outbounds.map((outbound) => {
        if (!outbound.filter || !Array.isArray(outbound.filter)) {
            return {
                ...outbound,
                _compiledFilters: [],
                _hasValidAction: false,
            };
        }

        const compiledFilters = [];
        let hasValidAction = false;

        for (const filter of outbound.filter) {
            if (filter.action === 'all') {
                compiledFilters.push({
                    action: 'all',
                    regex: null,
                    hasValidAction: true,
                });
                hasValidAction = true;
                continue;
            }
            // 检查 keywords
            if (
                !filter.keywords ||
                (!Array.isArray(filter.keywords) &&
                    typeof filter.keywords !== 'string')
            ) {
                continue;
            }


            // 兼容 string 和 array
            const keywords = Array.isArray(filter.keywords)
                ? filter.keywords
                : [filter.keywords];

            for (const keyword of keywords) {

                const ignoreCase = /\(\?i\)/i.test(keyword);

                const pattern = keyword.replace(/\(\?i\)/gi, '');


                try {

                    const regex = new RegExp(
                        pattern,
                        ignoreCase ? 'i' : ''
                    );


                    compiledFilters.push({
                        action: filter.action,
                        regex,
                        hasValidAction: true,
                    });


                    hasValidAction = true;


                } catch (e) {

                    console.warn(
                        `无效的正则表达式: ${keyword}`,
                        e
                    );

                }
            }
        }

        return {
            ...outbound,
            _compiledFilters: compiledFilters,
            _hasValidAction: hasValidAction,
        };
    });

    // 3. 处理每个 outbound 的匹配
    const processedOutbounds = compiledOutbounds.map((outbound) => {
        const matchedOutbounds = [];

        // 如果没有任何有效过滤器，跳过处理
        if (!outbound._hasValidAction || outbound._compiledFilters.length === 0) {
            // 保留原有 outbounds 或删除
            if (!outbound.outbounds || (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0)) {
                delete outbound.outbounds;
            }
            delete outbound._compiledFilters;
            delete outbound._hasValidAction;
            return outbound;
        }

        // 处理所有过滤器
        for (const filter of outbound._compiledFilters) {
            let currentMatched = [];

            if (filter.action === 'all') {
                currentMatched = ApiUrlname;
            } else {
                // 使用预编译的正则进行过滤
                const regex = filter.regex;
                // 根据 action 类型处理
                if (filter.action === 'include') {
                    for (const name of ApiUrlname) {
                        if (regex.test(name)) {
                            currentMatched.push(name);
                        }
                    }
                } else if (filter.action === 'exclude') {
                    for (const name of ApiUrlname) {
                        if (!regex.test(name)) {
                            currentMatched.push(name);
                        }
                    }
                }
            }

            // 合并匹配结果
            if (currentMatched.length > 0) {
                matchedOutbounds.push(...currentMatched);
            }
        }

        // 去重
        const uniqueMatched = matchedOutbounds.length > 0 ? [...new Set(matchedOutbounds)] : [];

        // 更新 outbounds
        if (uniqueMatched.length > 0) {
            if (outbound.outbounds && Array.isArray(outbound.outbounds)) {
                // 合并去重
                const combined = new Set([...outbound.outbounds, ...uniqueMatched]);
                outbound.outbounds = [...combined];
            } else {
                outbound.outbounds = uniqueMatched;
            }
        } else if (!outbound.outbounds || (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0)) {
            delete outbound.outbounds;
        }

        // 清理临时属性
        delete outbound._compiledFilters;
        delete outbound._hasValidAction;

        return outbound;
    });

    // 4. 处理链式代理
    if (e.relay && e.proxyname && e.dialerproxy) {
        // 使用 Set 优化去重
        if (processedOutbounds[1]) {
            if (!processedOutbounds[1].outbounds) {
                processedOutbounds[1].outbounds = [];
            }
            processedOutbounds[1].outbounds.unshift('🔗链式落地');
        }

        if (processedOutbounds[0]) {
            if (!processedOutbounds[0].outbounds) {
                processedOutbounds[0].outbounds = [];
            }
            const tag = processedOutbounds[1]?.tag || '';
            if (tag) {
                processedOutbounds[0].outbounds.unshift(tag);
                // 去重
                processedOutbounds[0].outbounds = [...new Set(processedOutbounds[0].outbounds)];
            }
        }

        // 批量插入
        const insertIndex = 2;
        processedOutbounds.splice(
            insertIndex,
            0,
            {
                tag: '🔗链式前置',
                type: 'selector',
                interrupt_exist_connections: true,
                outbounds: e.proxyname,
            },
            {
                tag: '🔗链式落地',
                type: 'selector',
                interrupt_exist_connections: true,
                outbounds: e.dialerproxy,
            },
        );
    }

    // 5. 清理被删除的 tags（使用 Set 优化）
    return cleanRemovedTags(processedOutbounds);
}

// 优化后的 cleanRemovedTags 函数
function cleanRemovedTags(outbounds) {
    // 第一次遍历：找出需要删除的 tags
    const removedTags = new Set();
    for (const item of outbounds) {
        if (!item.outbounds || (Array.isArray(item.outbounds) && item.outbounds.length === 0)) {
            if (item.tag !== undefined) {
                removedTags.add(item.tag);
            }
        }
    }

    // 如果没有需要删除的 tag，直接返回原数组
    if (removedTags.size === 0) {
        return outbounds;
    }

    // 第二次遍历：清理 outbounds 数组并过滤
    const result = [];
    for (const item of outbounds) {
        if (item.outbounds && Array.isArray(item.outbounds)) {
            // 过滤掉已删除的 tags
            const filtered = item.outbounds.filter((tag) => !removedTags.has(tag));

            // 如果过滤后仍有内容，保留该项
            if (filtered.length > 0) {
                item.outbounds = filtered;
                result.push(item);
            }
            // 否则丢弃该项
        } else {
            // 没有 outbounds 字段，但 tag 不在删除列表中则保留
            if (item.tag !== undefined && !removedTags.has(item.tag)) {
                result.push(item);
            }
        }
    }

    return result;
}
