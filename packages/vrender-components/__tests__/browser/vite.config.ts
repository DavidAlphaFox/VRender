import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
    port: 3333
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    __VERSION__: JSON.stringify(require('../../package.json').version)
  },
  resolve: {
    alias: {
      '@visactor/vrender': path.resolve(__dirname, '../../../vrender/src/index.ts'),
      '@visactor/vrender-core': path.resolve(__dirname, '../../../vrender-core/src/index.ts'),
      '@visactor/vrender-kits': path.resolve(__dirname, '../../../vrender-kits/src/index.ts')
    }
  }
});
