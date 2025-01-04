import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import svgr from 'vite-plugin-svgr';

const pathSrc = resolve(__dirname, './src');

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  let proxy = {};
  if (process.env.VITE_API_HOST) {
    proxy = {
      '/api': {
        target: process.env.VITE_API_HOST,
        secure: false,
        changeOrigin: true
      }
    };
  }

  return defineConfig({
    plugins: [
      react(),
      createSvgIconsPlugin({
        iconDirs: [resolve(pathSrc, 'assets/svg')],
        symbolId: 'icon-[name]'
      }),
      svgr()
    ],
    resolve: {
      alias: {
        ui: resolve(pathSrc, 'components/ui'),
        '@': pathSrc,
        '~': __dirname
      }
    },
    define: {
      'process.env': {}
    },
    build: {
      outDir: 'build',
      target: 'esnext'
    },
    server: {
      proxy
    }
  });
};
