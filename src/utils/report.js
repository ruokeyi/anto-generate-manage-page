import {useAuthData} from '@/app/services/auth/auth.provider';
import router from '@/router';

export function report(event, val = {}) {
  try {
    const username = useAuthData().username
    if (Object.prototype.toString.call(val) !== "[object Object]") {
      val = { value: val, username }
    } else {
      val = { ...val, username }
    }
    if (router.currentRoute.meta?.title) {
      val.meta_title = router.currentRoute.meta?.title
    }
    if (window['isUat'] || process.env.NODE_ENV === 'development') {
      // console.log('[log report]:', event, val)
      return
    }
    let reportObserver = window.reportObserver;
    let spmReportData = window.spmReportData;
    if (reportObserver && spmReportData) {
      spmReportData[event] = val
      reportObserver.forceCommit();
    }
  } catch (error) {
    console.log('[report error]:', error)
  }
}