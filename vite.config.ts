import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    root: '.',
    base: '/', // Custom domain: badori.io
    publicDir: 'public', // Ensure CNAME and other static files are copied
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'public/.well-known',
                    dest: '.',
                },
            ],
        }),
    ],
    build: {
        target: 'es2020',
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                main: 'index.html',
            },
            output: {
                // Optimize chunk splitting for better caching
                manualChunks: {},
                // Add hash to filenames for cache busting
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: assetInfo => {
                    if (assetInfo?.name?.endsWith('.css')) {
                        return 'assets/[name].[hash].css';
                    }
                    return 'assets/[name].[hash].[ext]';
                },
            },
        },
        // Enable minification
        minify: 'esbuild',
        // Optimize assets
        assetsInlineLimit: 4096,
    },
    server: {
        port: 3000,
        open: true,
        host: true,
    },
    preview: {
        port: 4173,
        open: true,
        host: true,
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    define: {
        // Enable production optimizations
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
    // Optimize for GitHub Pages
    optimizeDeps: {
        include: [],
        exclude: [],
    },
});
