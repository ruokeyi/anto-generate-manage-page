/*
  这个文件并非服务于webpack。仅用于向IDE指示路径别名的功能。
  本文件中的别名配置应同步于./vite.config.ts及./tsconfig.json中的别名配置。
 */

let path = require('path');
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
