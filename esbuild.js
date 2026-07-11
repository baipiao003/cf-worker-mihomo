const { build } = require('esbuild');
const { cp } = require('fs/promises');
const fs = require('fs/promises');
const path = require('path');
const objectHasOwnPolyfill = require.resolve('core-js/actual/object/has-own');
const replaceOpenApiIsNode = {
    name: 'replace-open-api-is-node',
    setup(build) {
        build.onLoad(
            {
                filter: /open-api\.js$/,
            },
            async (args) => {
                let contents = await fs.readFile(args.path, 'utf8');

                if (args.path.includes(path.join('src', 'core', 'Sub-Store', 'backend', 'src', 'vendor'))) {
                    contents = contents.replace(/const\s+isNode\s*=\s*eval\(`typeof process !== "undefined"`\)\s*;/, 'const isNode = false;');
                }

                return {
                    contents,
                    loader: 'js',
                };
            },
        );
    },
};
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
            plugins: [replaceOpenApiIsNode],
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
            format: 'iife',
            outfile: artifact.dest,
            inject: [objectHasOwnPolyfill],
        });
        console.log(`✔️ 打包完成: ${artifact.src} → ${artifact.dest}`);
    }

    code = await fs.readFile(verfacts[0].dest, 'utf8');
    code = code.replace(
        /eval\(('|")(require\(('|").*?('|")\))('|")\)/g,
        '$2',
    );
    code = code.replace(/eval\((`[^`]*`|"[^"]*"S|'[^']*')\)/g, '$1');

    await fs.writeFile(verfacts[0].dest, code);
    const verserver = [{ src: verfacts[0].dest, dest: 'src/server.js' }];
    for (const artifact of verserver) {
        await build({
            entryPoints: [artifact.src],
            bundle: true,
            minify: true,
            sourcemap: false,
            platform: 'node',
            format: 'iife',
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
