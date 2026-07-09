#!/usr/bin/env node
import { build } from 'esbuild';
import { cp } from 'fs/promises';
!(async () => {
    const artifacts = [{ src: 'src/vercel.js', dest: 'dist/min.js' }];

    for await (const artifact of artifacts) {
        await build({
            entryPoints: [artifact.src],
            bundle: true,
            minify: true,
            sourcemap: false,
            platform: 'node',
            format: 'esm',
            outfile: artifact.dest,
            banner: {
                js: `
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
`,
            },
        });
    }
    await cp('./template', './dist/template', {
        recursive: true,
    });
})()
    .catch((e) => {
        console.log(e);
    })
    .finally(() => {
        console.log('done');
    });
