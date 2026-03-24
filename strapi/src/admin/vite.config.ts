import path from 'path';
import { mergeConfig, type UserConfig } from 'vite';

const adminDir = path.resolve(process.cwd(), 'src/admin');

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
        path: 'path-browserify',
        fs: path.join(adminDir, 'stubs/fs.ts'),
        url: path.join(adminDir, 'stubs/url.ts'),
        'source-map-js': path.join(adminDir, 'stubs/source-map-js.ts'),
        'sanitize-html': path.join(adminDir, 'stubs/sanitize-html.ts'),
        dompurify: path.resolve(process.cwd(), 'node_modules/dompurify/dist/purify.es.mjs'),
      },
    },
    optimizeDeps: {
      include: ['path-browserify', 'dompurify'],
    },
  });
};
