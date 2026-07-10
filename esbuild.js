const { build } = require('esbuild');
const { cp } = require('fs/promises');

const objectHasOwnPolyfill = require.resolve('core-js/actual/object/has-own');

!(async () => {
    const artifacts = [{ src: 'src/worker.js', dest: 'dist/_worker.js' }];
    for (const artifact of artifacts) {
        await build({
            entryPoints: [artifact.src],
            bundle: true,
            minify: true,
            sourcemap: false,
            platform: 'browser',
            format: 'esm',
            outfile: artifact.dest,
            inject: [objectHasOwnPolyfill],
        });
        console.log(`✔️ 打包完成: ${artifact.src} → ${artifact.dest}`);
    }
    const verfacts = [{ src: 'src/vercel.js', dest: 'dist/vercel.js' }];
    for (const artifact of verfacts) {
        await build({
            entryPoints: [artifact.src],
            bundle: true,
            minify: true,
            sourcemap: false,
            platform: 'node',
            format: 'cjs',
            outfile: artifact.dest,
            inject: [objectHasOwnPolyfill],
        });
        console.log(`✔️ 打包完成: ${artifact.src} → ${artifact.dest}`);
    }
    const copyTasks = [
        ['./template', './dist/template'],
        ['./favicon.png', './dist/favicon.png'],
        ['./icon', './dist/icon'],
    ];

    await Promise.all(copyTasks.map(([src, dest]) => cp(src, dest, { recursive: true })));
})();
