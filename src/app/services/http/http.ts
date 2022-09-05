import axios from 'axios';
import {done, start} from '../progress-bar';
import {Modal} from 'ant-design-vue';
import {ElMessage} from 'element-plus';


export const host = window.location.host;
export const baseURL = `//${host}/allowance/api`;

export const http = axios.create({
  baseURL: baseURL,
});

export const mHttpConfig = {
  warn: 0,
};

export async function runWithoutWarn(cb: Function) {
  mHttpConfig.warn++;
  try {
    return await cb();
  } catch (e) {
    throw e;
  } finally {
    mHttpConfig.warn--;
  }
}

http.interceptors.request.use(
  async (config: any) => {
    start();
    config.withCredentials = true;
    // 方便mock
    if (config.mockId) {
      config.baseURL = config.baseURL?.replace(host, `bapi.bilibili.co/mock/${config.mockId}`);
    }
    return config;
  },
  error => Promise.reject(error),
);

export async function reLogin() {
  Modal.info({
    title: '提醒',
    content: '您尚未登录或者登录信息残缺，即将为您打开新窗口，重新登录dashboard......',
    onOk: async () => {
      window.open('https://dashboard-mng.bilibili.co/logout');
      Modal.info({
        title: '提醒',
        content: '请刷新......',
        onOk: () => location.reload(),
      });
    },
  });
}

http.interceptors.response.use(
  response => {
    done();
    const {data} = response;
    const {code, message, mocking} = data;
    if (mocking) {
      return data;
    }
    switch (code) {
      case 0:
        return data;
      case 169117: // up tag下，mid不存在
        return data;
      case -401:
        reLogin();
        throw message;
      default:
        if (mHttpConfig.warn === 0) {
          ElMessage(
            {
              message: `发生错误: ${message}`,
              type: 'error',
              showClose: true,
              duration: 5000,
            },
          );
        }
        throw message;
    }
  },
  async error => {
    done();
    ElMessage.error(error.toString());
    throw error;
  },
);
