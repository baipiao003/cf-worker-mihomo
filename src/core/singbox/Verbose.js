import { ConfigLatest, ConfigPre } from '../../config/singbox.js';

/**
 * 根据客户端 UA 生成 sing-box 配置。
 *
 * - 校验客户端类型，仅允许 sing-box / sing-box for Android(SFA) /
 *   sing-box for iOS(SFI) / sing-box for macOS(SFM) 等客户端。
 * - 根据参数决定是否注入 ECH DNS 配置。
 *
 * @param {Object} e 配置生成参数
 * @param {string} e.userAgent 客户端 User-Agent，用于判断版本和类型
 * @param {boolean} [e.checkUA=false] 是否启用客户端 UA 校验
 * @param {boolean} [e.ech=false] 是否启用 ECH DNS 注入
 *
 * @returns {Object} sing-box 配置对象
 *
 * @throws {Error} 当启用 UA 校验且客户端类型不受支持时抛出异常
 */
function Verbose(e) {
    const ua = e.userAgent;

    if (e.checkUA && !/singbox|sing-box|sfa|sfm/i.test(ua)) {
        throw new Error('不支持的客户端');
    }

    if (/1\.14\.0-alpha\.\d+/.test(ua)) {
        return ConfigPre;
    }
    return ConfigLatest;
}

export { Verbose };
