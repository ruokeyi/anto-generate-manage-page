/**
 * 获取环境数据
 * 注意：DEPLOY_ENV及相关的isUAT、isPre、isProd还不能保证可靠（因为本地发布等原因）
 * @returns {{mode: any, baseURL: any, isUAT: boolean, isPre: boolean, isProd: boolean, isDev: any, projectName: any, deployEnv: any}}
 */
export function useEnv() {
  // return import.meta.env;
  const {
    MODE: mode,
    DEV: isDev,
    PROD: isBuild,
    BASE_URL: baseURL,
    VITE_PROJECT_NAME: projectName,
  } = import.meta.env;
  let deployEnv = `CONST_deployEnv` ?? '未知';
  // 适配vite堪称诡异的define功能
  try {
    if (typeof CONST_deployEnv === 'string') {
      deployEnv = CONST_deployEnv;
    } else {
      deployEnv = ` CONST_deployEnv `.trim();
    }
  } catch (e) {
    console.log(e);
  }

  let isProd = false;
  let isUAT = false;
  let isPre = false;


  if (isBuild) {
    switch (deployEnv) {
      case 'uat':
        isUAT = true;
        break;
      case 'pre':
        isPre = true;
        break;
      case 'prod':
        isProd = true;
        break;
    }
  }

  return {
    mode,
    baseURL,
    deployEnv,
    projectName,
    isDev,
    /** @deprecated */ isProd,
    /** @deprecated */ isUAT,
    /** @deprecated */ isPre,
  };

}
