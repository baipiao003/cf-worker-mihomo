// YAML 格式化为内嵌 JSON 单行化
import fs from 'fs/promises';
import YAML from 'yaml';
// YAML 流式具象化
export default async function formatWholeYamlFile(inputFile, outputFile, singleLineScalars = true) {
    // 读取文件
    const text = await fs.readFile(inputFile, 'utf8');
    const ext = YAML.stringify(YAML.parse(text, { maxAliasCount: -1 }));
    // 解析成 Document
    const doc = YAML.parseDocument(ext, { merge: true, maxAliasCount: -1 });

    // 递归处理节点，找到所有数组，对其元素做流式对象格式化
    function processNode(node) {
        if (YAML.isSeq(node)) {
            // 判断数组里是否全部是标量
            const allScalars = node.items.every((item) => !YAML.isMap(item) && !YAML.isSeq(item));

            if (allScalars && singleLineScalars) {
                node.flow = true; // 标量数组单行化
            } else {
                node.flow = false; // 默认块格式
            }
            // 数组保持块格式，默认不设置 flow=true
            // 把数组中是映射的元素转成 flow map
            node.items = node.items.map((item) => {
                if (YAML.isMap(item)) {
                    const flowMap = new YAML.YAMLMap();
                    flowMap.flow = true;
                    for (const pair of item.items) {
                        flowMap.items.push(pair);
                    }
                    return flowMap;
                } else if (YAML.isSeq(item)) {
                    // 如果数组里还有数组，递归处理
                    processNode(item);
                    return item;
                } else {
                    return item;
                }
            });

            // 递归处理数组里的元素（已处理映射对象）
            node.items.forEach(processNode);
        } else if (YAML.isMap(node)) {
            // 处理映射的每个值
            node.items.forEach((pair) => {
                processNode(pair.value);
            });
        }
    }

    processNode(doc.contents);

    // 输出时关闭自动换行，让流式对象一行展示，数组块状换行
    const yamlStr = doc.toString({ lineWidth: Infinity });

    await fs.writeFile(outputFile, yamlStr, 'utf8');
    console.log(`✅ 完整格式化写入：${outputFile}`);
}
