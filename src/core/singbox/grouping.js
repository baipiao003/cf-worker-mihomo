export function loadAndSetOutbound(Outbounds, ApiUrlname, e) {
    // 1. 预处理：将 ApiUrlname 转为 Set 以便快速查找
    const apiUrlSet = new Set(ApiUrlname);

    // 2. 预编译所有过滤器的正则表达式
    const compiledOutbounds = Outbounds.map(outbound => {
        if (!outbound.filter || !Array.isArray(outbound.filter)) {
            return {
                ...outbound,
                _compiledFilters: [],
                _hasValidAction: false
            };
        }

        const compiledFilters = [];
        let hasValidAction = false;

        for (const filter of outbound.filter) {
            if (filter.action === 'all') {
                compiledFilters.push({
                    action: 'all',
                    regex: null,
                    hasValidAction: true
                });
                hasValidAction = true;
                continue;
            }

            // 检查 keywords
            if (!filter.keywords || typeof filter.keywords !== 'string') {
                continue;
            }

            // 预编译正则
            const ignoreCase = /\(\?i\)/i.test(filter.keywords);
            const pattern = filter.keywords.replace(/\(\?i\)/gi, '');

            try {
                const regex = new RegExp(pattern, ignoreCase ? 'i' : '');
                compiledFilters.push({
                    action: filter.action,
                    regex: regex,
                    hasValidAction: true
                });
                hasValidAction = true;
            } catch (e) {
                console.warn(`无效的正则表达式: ${filter.keywords}`, e);
            }
        }

        return {
            ...outbound,
            _compiledFilters: compiledFilters,
            _hasValidAction: hasValidAction
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
        processedOutbounds.splice(insertIndex, 0,
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
            }
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
            const filtered = item.outbounds.filter(tag => !removedTags.has(tag));

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

// 策略组处理
export function loadAndSetOutbounds(Outbounds, ApiUrlname, e) {
    // 处理每个 outbound 的过滤器
    const processOutboundFilters = (outbound) => {
        let matchedOutbounds = [];
        let hasValidAction = false;

        outbound.filter?.forEach((filter) => {
            if (filter.action !== 'all') {
                // 检查 keywords 是否存在且有效
                if (!filter.keywords || typeof filter.keywords !== 'string') {
                    return;
                }
            }

            let currentMatched = [];

            if (filter.action === 'all') {
                currentMatched = ApiUrlname;
                hasValidAction = true;
            } else {
                // 处理正则表达式模式
                const { pattern, ignoreCase } = parseRegexPattern(filter.keywords);
                const regex = new RegExp(pattern, ignoreCase ? 'i' : '');

                // 根据不同的 action 类型处理匹配
                currentMatched = applyFilterAction(ApiUrlname, regex, filter.action);
                hasValidAction = true;
            }

            if (currentMatched.length > 0) {
                matchedOutbounds = [...matchedOutbounds, ...currentMatched];
            }
        });

        return { matchedOutbounds: [...new Set(matchedOutbounds)], hasValidAction };
    };

    // 解析正则表达式模式
    const parseRegexPattern = (keywords) => {
        if (!keywords || typeof keywords !== 'string') {
            return { pattern: '^$', ignoreCase: false }; // 返回不匹配任何内容的模式
        }

        const ignoreCase = /\(\?i\)/i.test(keywords);
        const pattern = keywords.replace(/\(\?i\)/gi, '');
        return { pattern, ignoreCase };
    };

    // 应用过滤器操作
    const applyFilterAction = (items, regex, action) => {
        switch (action) {
            case 'include':
                return items.filter((name) => regex.test(name));
            case 'exclude':
                return items.filter((name) => !regex.test(name));
            default:
                return [];
        }
    };

    // 更新 outbounds 数组
    const updateOutboundsArray = (outbound, matchedOutbounds, hasValidAction) => {
        if (matchedOutbounds.length > 0) {
            outbound.outbounds = outbound.outbounds ? [...new Set([...outbound.outbounds, ...matchedOutbounds])] : matchedOutbounds;
        } else if (outbound.outbounds && outbound.outbounds.length > 0) {
            // 保留原有的 outbounds（没有匹配到但原本有内容）
        } else {
            delete outbound.outbounds;
        }

        // 删除 filter 字段
        delete outbound.filter;
        return outbound;
    };

    // 清理被删除的 tags
    const cleanRemovedTags = (outbounds) => {
        // 找出所有 outbounds 为空的项（将被删除的 tags）
        const removedTags = outbounds
            .filter((item) => !item.outbounds || (Array.isArray(item.outbounds) && item.outbounds.length === 0))
            .map((item) => item.tag)
            .filter((tag) => tag !== undefined);

        // 从所有 outbounds 数组中删除这些 tags
        const cleanedOutbounds = outbounds.map((item) => {
            if (item.outbounds && Array.isArray(item.outbounds)) {
                // 严格匹配 tag 名称（完全相等）
                item.outbounds = item.outbounds.filter((tag) => !removedTags.includes(tag));
            }
            return item;
        });

        // 过滤掉 outbounds 数组为空或不存在的策略组
        return cleanedOutbounds.filter((item) => {
            return item.outbounds && Array.isArray(item.outbounds) && item.outbounds.length > 0;
        });
    };

    // 主处理流程
    const processedOutbounds = Outbounds.map((outbound) => {
        const { matchedOutbounds, hasValidAction } = processOutboundFilters(outbound);
        return updateOutboundsArray(outbound, matchedOutbounds, hasValidAction);
    });
    if (e.relay && e.proxyname && e.dialerproxy) {
        if (processedOutbounds[1].outbounds) {
            processedOutbounds[1].outbounds.splice(0, 0, '🔗链式落地');
        } else {
            processedOutbounds[1].outbounds = ['🔗链式落地'];
        }
        if (processedOutbounds[0].outbounds) {
            processedOutbounds[0].outbounds.splice(0, 0, processedOutbounds[1].tag);
        } else {
            processedOutbounds[0].outbounds = [processedOutbounds[1].tag];
        }
        processedOutbounds[0].outbounds = [...new Set(processedOutbounds[0].outbounds)];
        processedOutbounds.splice(2, 0, {
            tag: '🔗链式前置',
            type: 'selector',
            interrupt_exist_connections: true,
            outbounds: e.proxyname,
        });
        processedOutbounds.splice(3, 0, {
            tag: '🔗链式落地',
            type: 'selector',
            interrupt_exist_connections: true,
            outbounds: e.dialerproxy,
        });
    }
    return cleanRemovedTags(processedOutbounds);
}