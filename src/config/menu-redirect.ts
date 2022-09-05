import {host} from '@/app/services/http/http';
import mainRouter from '@/router/index';
import {sleep} from '@/utils/sleep';

const toV1URL = url => `http://${host}/allowance/#${url}`;
const toV2URL = url => `http://${host}${location.pathname}#${url}`;

export const v2Paths = mainRouter.getRoutes()
  .map(item => item.path);

sleep(200)
  .then(() => {
    let group = console.groupCollapsed;
    // @ts-ignore 部分浏览器没有group函数（虽然大概率是遇不到了）
    group
      ? console.groupCollapsed('CRM/next项目托管了部分CRM路径。')
      : console.log('crm/next项目托管了以下URL：');
    v2Paths.forEach(path => console.log(path));
    console?.groupEnd();
  });


export function toUniversalURL(url: string) {
  if (v2Paths.includes(url)) {
    return toV2URL(url);
  } else {
    return toV1URL(url);
  }
}
