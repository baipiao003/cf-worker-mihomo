/**
 * Base64 解码 UTF-8 字符串。
 *
 * @param {string} str - Base64 编码字符串
 * @returns {string} UTF-8 解码后的字符串
 */
function base64DecodeUtf8(str) {
    if (!str) return '';
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

export { base64DecodeUtf8 };
