import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path';
import * as fs from 'fs';
import {svgBuilder} from './src/plugins/svgBuilder';
import MdLoader from "./doc/md-loader/index";

function pathRewritePlugin() {
  return {
    name: 'm-path-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        req.url = req.url.replace(/.*bibi\.co/, '');
        next();
      });
    },
  };
}

export const inProd = process.env.DEPLOY_ENV || '';
const isUat = process.env.DEPLOY_ENV === 'uat';
// @ts-ignore
const isProd = process.env.DEPLOY_ENV === 'prod';
// @ts-ignore
const isPre = process.env.DEPLOY_ENV === 'pre';
export let projectName = 'generate-data-table';
let prefix = isUat
  ? 'uat-'
  : '';
export let basePath = inProd
  ? `//${prefix}boss.bibi.co/york/york/${projectName}/`
  : 'york/generate-data-table';


function htmlFileRenamePlugin() {
  return {
    name: 'm-html-rename',
    closeBundle() {
      try {
        if (inProd) {
          const indexHtml = fs.readFileSync(path.join(__dirname, './dist/index.html'), 'utf8');
          fs.writeFileSync(path.join(__dirname, `./dist/${projectName}_${commitId}.html`), indexHtml);
        }
      } catch (e) {
        console.error(e);
      }
    },
  };
}

let getCommitId = function () {
  try {
    return require('child_process')
      .execSync('git rev-parse HEAD')
      .toString()
      .replace(/\s/, '');
  } catch (e) {
    return Math.random()
      .toString(36)
      .substr(2);
  }
};
let commitId = getCommitId();
// @ts-ignore
let nodeEnv = process.env.NODE_ENV;
console.log('node env is:', nodeEnv);

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    pathRewritePlugin(),
    // @ts-ignore
    htmlFileRenamePlugin(),
    MdLoader(),
    svgBuilder('./src/assets/icons/'),
  ],
  define: {
    CONST_inProd: JSON.stringify(inProd),
    CONST_projectName: JSON.stringify(projectName),
    CONST_basePath: JSON.stringify(basePath),
    CONST_isUat: JSON.stringify(isUat),
    CONST_isProd: JSON.stringify(isProd),
    CONST_isPre: JSON.stringify(isPre),
    CONST_isDev: JSON.stringify(nodeEnv === 'development'),
    CONST_env: JSON.stringify(nodeEnv),
    // @ts-ignore
    CONST_deployEnv: JSON.stringify(process.env.DEPLOY_ENV),
  },
  base: basePath,
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  envDir: 'environment',
  server: {
    host: '0.0.0.0',
    port: 8065,
    strictPort: true,
    cors: true,
    hmr: {
      host: 'localhost',
      port: 8065,
    },
  },
  build: {
    target: 'es2015'
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  esbuild: { // 为了tsx中的jsx语法服务，自动补齐React h
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
});
