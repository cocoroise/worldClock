import { defineConfig } from 'vite';
const vue = require('@vitejs/plugin-vue');
const path = require('path');
const { dependencies } = require('./package.json');

function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['vue'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export default defineConfig({
  plugins: [vue()],
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
});
