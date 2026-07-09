/**
 * 获取 Mihomo 代理分组信息
 * @param {Array} proxies - 代理列表
 * @param {Array} groups - 策略组
 * @returns {Object} 分组信息
 */
export function getProxies_Grouping(proxies, groups, e) {
    // 1. 预处理：提前构建代理名称集合，用于快速查找
    const proxyNames = new Set(proxies.proxies.map(p => p.name));

    // 2. 预处理：编译所有正则表达式
    const compiledGroups = groups['proxy-groups'].map(group => {
        let regex = null;
        let hasIgnoreCase = false;
        let cleanedFilter = '';

        if (typeof group.filter === 'string') {
            hasIgnoreCase = /\(\?i\)/i.test(group.filter);
            cleanedFilter = group.filter.replace(/\(\?i\)/gi, '');
            try {
                regex = new RegExp(cleanedFilter, hasIgnoreCase ? 'i' : '');
            } catch (e) {
                console.warn(`无效的正则表达式: ${group.filter}`, e);
                // 无效正则视为无filter
                regex = null;
            }
        }

        return {
            ...group,
            _regex: regex,
            _hasFilter: regex !== null
        };
    });

    const deletedGroups = [];

    // 3. 过滤策略组
    const updatedGroups = compiledGroups.filter((group) => {
        // 没有filter或filter无效，直接保留
        if (!group._hasFilter) {
            return true;
        }

        // 使用Set快速检查是否有匹配的代理
        let matchFound = false;
        for (const proxyName of proxyNames) {
            if (group._regex.test(proxyName)) {
                matchFound = true;
                break;
            }
        }

        // 如果没有匹配且组内没有手动指定代理，则删除
        if (!matchFound && (!group.proxies || group.proxies.length === 0)) {
            deletedGroups.push(group.name);
            return false;
        }

        return true;
    });

    // 4. 处理链式代理
    if (e.relay && e.proxyname && e.dialerproxy) {
        // 添加链式代理组
        if (updatedGroups[1]) {
            if (!updatedGroups[1].proxies) {
                updatedGroups[1].proxies = [];
            }
            updatedGroups[1].proxies.unshift('🔗链式落地');
        }

        if (updatedGroups[0]) {
            if (!updatedGroups[0].proxies) {
                updatedGroups[0].proxies = [];
            }
            updatedGroups[0].proxies.unshift(updatedGroups[1]?.name || '');
            // 去重
            updatedGroups[0].proxies = [...new Set(updatedGroups[0].proxies)];
        }

        // 插入新组
        const insertIndex = 2;
        updatedGroups.splice(insertIndex, 0,
            {
                name: '🔗链式前置',
                type: 'select',
                lazy: true,
                proxies: e.proxyname,
            },
            {
                name: '🔗链式落地',
                type: 'select',
                lazy: true,
                proxies: e.dialerproxy,
            }
        );
    }

    // 5. 删除已删除组中的代理引用（使用Set优化）
    if (deletedGroups.length > 0) {
        const deletedSet = new Set(deletedGroups);
        updatedGroups.forEach((group) => {
            if (group.proxies && Array.isArray(group.proxies)) {
                group.proxies = group.proxies.filter((proxyName) => {
                    // 检查代理名称是否在删除集合中（或作为删除组名的子串）
                    return !deletedSet.has(proxyName);
                });
            }
        });
    }

    // 清理临时属性
    updatedGroups.forEach(group => {
        delete group._regex;
        delete group._hasFilter;
    });

    return updatedGroups;
}

/**
 * 获取 Mihomo 代理分组信息
 * @param {Array} proxies - 代理列表
 * @param {Array} groups - 策略组
 * @returns {Object} 分组信息
 */
export function getProxies_Groupings(proxies, groups, e) {
    const deletedGroups = []; // 用于记录已删除的组名
    const updatedGroups = groups['proxy-groups'].filter((group) => {
        let matchFound = false;
        // 确保 filter 存在并且是一个字符串
        let filter = group.filter;
        if (typeof filter !== 'string') {
            return true; // 保留没有 filter 的组
        }

        // 移除所有 (?i)，但保留后续内容
        const hasIgnoreCase = /\(\?i\)/i.test(filter);
        const cleanedFilter = filter.replace(/\(\?i\)/gi, '');

        let regex;
        try {
            regex = new RegExp(cleanedFilter, hasIgnoreCase ? 'i' : '');
        } catch (e) {
            console.warn(`无效的正则表达式: ${filter}`, e);
            return true; // 遇到错误时保留该组
        }

        // 遍历每个代理，检查是否与当前组的正则匹配
        for (let proxy of proxies.proxies) {
            if (regex.test(proxy.name)) {
                matchFound = true;
                break;
            }
        }

        // 如果没有匹配，记录删除的组并返回 false (删除该组)
        if (!matchFound && (!group.proxies || group.proxies.length === 0)) {
            deletedGroups.push(group.name);
            return false;
        }

        return true;
    });
    if (e.relay && e.proxyname && e.dialerproxy) {
        if (updatedGroups[1].proxies) {
            updatedGroups[1].proxies.splice(0, 0, '🔗链式落地');
        } else {
            updatedGroups[1].proxies = ['🔗链式落地'];
        }
        if (updatedGroups[0].proxies) {
            updatedGroups[0].proxies.splice(0, 0, updatedGroups[1].name);
        } else {
            updatedGroups[0].proxies = updatedGroups[1].name;
        }
        updatedGroups[0].proxies = [...new Set(updatedGroups[0].proxies)];
        updatedGroups.splice(2, 0, {
            name: '🔗链式前置',
            type: 'select',
            lazy: true,
            proxies: e.proxyname,
        });
        updatedGroups.splice(3, 0, {
            name: '🔗链式落地',
            type: 'select',
            lazy: true,
            proxies: e.dialerproxy,
        });
    }
    // 遍历所有策略组，删除 deletedGroups 中的代理
    updatedGroups.forEach((group) => {
        if (group.proxies) {
            group.proxies = group.proxies.filter((proxyName) => {
                // 只删除那些在 deletedGroups 中的代理
                return !deletedGroups.some((deletedGroup) => {
                    return deletedGroup.includes(proxyName); // 检查 deletedGroups 中是否包含该代理名称
                });
            });
        }
    });

    return updatedGroups;
}
