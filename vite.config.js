import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
    jsxFactory: 'React.createElement',
  },
  define: {
    d3: 'window.d3',
  },
});
