const { defineConfig } = require("vite");

export default defineConfig({
    root: 'public',
    build: {
        outDir: './dist',
        emptyOutDir: true,
    },
});
