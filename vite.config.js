import { defineConfig, loadEnv } from 'vite';
const { resolve } = require('path');
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    mode,
    esbuild: {
      jsxInject: `import React from 'react'`,
      jsxFactory: 'React.createElement',
    },
    define: {
      d3: 'window.d3',
    },
    base: './',
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src'),
        },
      ],
    },
    server: {
      proxy: {
        '/api': {
          target: env.SERVER_TARGET,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
