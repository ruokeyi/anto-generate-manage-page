import {useEnv} from '@/utils/useEnv';

/**
 * 项目公开资源路径(/public)到支持York的路径的转换
 * @param {string} url public下的路径
 * @returns {string} 同时支持York和开发环境的路径
 */
export function toPublicURL(url: string) {
  const {baseURL} = useEnv();
  return `${baseURL}${url.replace(/^\//, '')}`;
}
