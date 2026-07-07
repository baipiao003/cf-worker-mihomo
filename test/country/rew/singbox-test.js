// singbox 参数对此脚本 route & outbound，提示缺少的参数

import fs from 'fs';
import yaml from 'yaml';

// 读取配置文件
const file = fs.readFileSync('../../template/singbox_ACL4SSR_Online_Full.yaml', 'utf8');
const config = yaml.parse(file);

function collectRuleSets(rules) {
    let sets = new Set();
    function traverse(rulesArr) {
        for (const rule of rulesArr) {
            if (rule.rule_set) {
                for (const rs of rule.rule_set) {
                    sets.add(rs);
                }
            }
            if (rule.rules) {
                traverse(rule.rules); // 递归 logical rules
            }
        }
    }
    traverse(rules);
    return sets;
}

function collectOutbounds(rules) {
    let outs = new Set();
    function traverse(rulesArr) {
        for (const rule of rulesArr) {
            if (rule.outbound) {
                outs.add(rule.outbound);
            }
            if (rule.rules) {
                traverse(rule.rules);
            }
        }
    }
    traverse(rules);
    return outs;
}

// ----------------------------
// 提取 rule_set.tag & outbound
// ----------------------------
const usedRuleSets = collectRuleSets(config.route.rules);
const usedOutbounds = collectOutbounds(config.route.rules);

// 配置里实际存在的 tag
const definedRuleSets = new Set((config.route.rule_set || []).map((r) => r.tag));
const definedOutbounds = new Set((config.outbounds || []).map((o) => o.tag));

// ----------------------------
// 检查缺失
// ----------------------------
const missingRuleSets = [...definedRuleSets].filter((rs) => !usedRuleSets.has(rs));
const missingOutbounds = [...definedOutbounds].filter((o) => !usedOutbounds.has(o));
const notmissingRuleSets = [...usedRuleSets].filter((rs) => !definedRuleSets.has(rs));
const notmissingOutbounds = [...usedOutbounds].filter((o) => !definedOutbounds.has(o));

function logToFile(...message) {
    const logLine = `[${new Date().toISOString()}] ${message.join(' ')}\n`;
    fs.appendFileSync('singbox.log', logLine, 'utf8');
}
logToFile('✅ 使用到的 rule_set:', [...usedRuleSets]);
logToFile('✅ 配置的 rule_set:', [...definedRuleSets]);
console.log('❌ route.rule_set 缺少的 route.rules :', missingRuleSets);
console.log('❌ route.rules 缺少的 route.rule_set:', notmissingRuleSets);

logToFile('✅ 使用到的 outbound:', [...usedOutbounds]);
logToFile('✅ 配置的 outbound:', [...definedOutbounds]);
console.log('❌ route.route 缺少的 outbound :', missingOutbounds);
console.log('❌ outbound 缺少的 route.route:', notmissingOutbounds);
