import { fetchResponse } from './fetchResponse.js'

/**
 * 获取应用包名列表。
 *
 * 从远程规则文件中提取 PROCESS-NAME，
 * 并过滤浏览器等排除列表。
 *
 * @returns {Promise<string[]>} 应用包名数组
 */
async function fetchpackExtract() {
    const processNames = new Set();
    const excludeList = [
        { pkg: 'com.android.chrome', comment: 'Chrome浏览器' },
        { pkg: 'mark.via', comment: 'Via浏览器' },
        { pkg: 'com.baidu.browser.apps', comment: '百度浏览器' },
        { pkg: 'com.browser2345', comment: '2345浏览器' },
        { pkg: 'com.cat.readall', comment: '悟空浏览器' },
        { pkg: 'com.estrongs.android.pop', comment: 'ES文件浏览器' },
        { pkg: 'com.mmbox.xbrowser.pro', comment: 'X浏览器' },
        { pkg: 'com.mx.browser', comment: '傲游浏览器' },
        { pkg: 'com.oupeng.browser', comment: '欧朋浏览器极速版' },
        { pkg: 'com.oupeng.mini.android', comment: '欧朋浏览器' },
        { pkg: 'com.qihoo.browser', comment: '360浏览器' },
        { pkg: 'com.tencent.mtt', comment: 'QQ浏览器' },
        { pkg: 'com.UCMobile', comment: 'UC浏览器' },
        { pkg: 'com.ucmobile.lite', comment: 'UC浏览器极速版' },
        { pkg: 'com.ume.browser', comment: '微米浏览器' },
        { pkg: 'com.vivo.browser', comment: 'vivo浏览器' },
        { pkg: 'org.mozilla.fennec_mylinux', comment: '蚂蚁浏览器' },
        { pkg: 'sogou.mobile.explorer', comment: '搜狗浏览器极速版' },
    ];

    const excludeNames = new Set(excludeList.map(({ pkg }) => pkg));

    const urls = [
        'https://cdn.jsdelivr.net/gh/mnixry/direct-android-ruleset@rules/@Merged/GAME.mutated.yaml',
        'https://cdn.jsdelivr.net/gh/mnixry/direct-android-ruleset@rules/@Merged/APP.mutated.yaml',
    ];

    const results = await Promise.all(urls.map((url) => fetchResponse(url)));
    for (const res of results) {
        const payload = res?.data?.payload;
        if (!Array.isArray(payload)) {
            continue;
        }
        for (const line of res.data.payload) {
            const match = line.match(/PROCESS-NAME\s*,\s*([^\s,]+)/);
            if (!match) continue;
            const name = match[1];
            if (excludeNames.has(name)) continue;
            processNames.add(name);
        }
    }
    return [...processNames];
}
export { fetchpackExtract };
