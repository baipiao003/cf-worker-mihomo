#!/usr/bin/env node

const { build } = require('esbuild');
const { cp } = require('fs/promises');
!(async () => {
    const artifacts = [{ src: 'src/vercel.js', dest: 'dist/min.js' }];

    for await (const artifact of artifacts) {
        await build({
            entryPoints: [artifact.src],
            bundle: true,
            minify: false,
            sourcemap: false,
            platform: 'node',
            format: 'cjs',
            outfile: artifact.dest,
        });
    }
    const copyTasks = [
        ['./template', './dist/template'],
        ['./favicon.png', './dist/favicon.png'],
        ['./icon', './dist/icon'],
    ];

    await Promise.all(copyTasks.map(([src, dest]) => cp(src, dest, { recursive: true })));
})()
    .catch((e) => {
        console.log(e);
    })
    .finally(() => {
        console.log('done');
    });
