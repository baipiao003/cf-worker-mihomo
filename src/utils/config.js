import { base64DecodeUtf8 } from './base64.js';
const backimg = base64DecodeUtf8('aHR0cHM6Ly90LmFsY3kuY2MveWN5');
const beiantext = base64DecodeUtf8('6JCMSUNQ5aSHMjAyNTAwMDHlj7c=');
const beiandizi = base64DecodeUtf8('aHR0cHM6Ly90Lm1lL01hcmlzYV9rcmlzdGk=');
/**
 * 判断字符串是否为有效的 HTTP/HTTPS URL
 *
 * @param {string} str - 待检测的字符串
 * @returns {boolean} 是否为有效 URL
 */
function isUrl(str) {
    try {
        const url = new URL(str);
        return ['http:', 'https:'].includes(url.protocol);
    } catch {
        return false;
    }
}
export { backimg, beiantext, beiandizi, isUrl };
