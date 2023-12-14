import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['./src/main.ts'],
    outfile: './build/main.js',
    minify: true,
    bundle: true,
    sourcemap: true,
    format: 'cjs',
    platform: 'node',
    external: ['electron', 'electron-devtools-installer']
});
