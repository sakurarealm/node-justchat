import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';

export default defineConfig({
    input: 'src/index.ts',
    output: {
        format: 'commonjs',
        file: 'lib/index.js'
    },
    plugins: [
        ts({
            tsconfig: 'tsconfig.json'
        })
    ]
});
