import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
    
    },
  },

    server: {
    host: '127.0.0.1', // force to use 127.0.0.1 instead of localhost
    port: 5173,
    strictPort: true,
    }
});
