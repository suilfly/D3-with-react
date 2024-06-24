import { defineConfig, loadEnv } from 'vite';

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
