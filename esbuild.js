import esbuild from 'esbuild';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const objectHasOwnPolyfill = require.resolve('core-js/actual/object/has-own');
const artifacts = [{ src: 'src/_worker.js', dest: 'dist/worker.js' }];

(async () => {
    for (const artifact of artifacts) {
        await esbuild.build({
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
})();
