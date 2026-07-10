let nodeConversion = null;

/**
 * 动态导入 sub-store
 *
 * @returns {Promise<Function>}
 */
async function getNodeConversion() {
    if (!nodeConversion) {
        nodeConversion = import('../core/sub/index.js')
            .then((module) => module.default);
    }

    return nodeConversion;
}

export { getNodeConversion };
