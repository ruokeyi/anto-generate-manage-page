import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../app/Home.vue';

import { appRouterConfig } from '@/app/app.router';
import { sleep } from '@/utils/sleep';
import qs from 'qs';
import Cookie from 'js-cookie';
import { handleRedirect } from './redirect'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/demo',
    component: () => import('../../doc/doc-view/index.vue')
  },
  ...appRouterConfig,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(((to, from, next) => {
  if (handleRedirect(to)) {
    return
  }
  next();
}));
router.afterEach((to, form) => {
  let { reportObserver, spmReportData } = window as any;
  if (reportObserver && spmReportData) {
    (async () => {
      await sleep();
      if (process.env.NODE_ENV !== 'development' || true) {
        spmReportData['NavToPage__' + to.path] = qs.stringify(to.query as any); // vue的类型定义和qs的定义有些偏差
        spmReportData['username'] = Cookie.get('username');
        reportObserver.forceCommit();
      }
    })();
  }
});

export default router;
