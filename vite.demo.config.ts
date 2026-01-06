import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    root: 'demo',
    base: '/react-nano-timepicker/',
    plugins: [react()],
    build: {
        outDir: resolve(__dirname, 'dist-demo'),
        emptyOutDir: true,
    },
});
