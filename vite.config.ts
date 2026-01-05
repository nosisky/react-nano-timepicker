import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
    root: command === 'serve' ? 'demo' : undefined,
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            name: 'ReactTimepicker',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.names && assetInfo.names.some(name => name.endsWith('.css'))) {
                        return 'styles.css';
                    }
                    return '[name].[ext]';
                },
            },
        },
        sourcemap: true,
        minify: 'esbuild',
    },
}));
