const redirectMap = {
  '/crm/upManage/upList': () => {
    return location.origin + '/york/crm-data-platform/#/data-platform/find-up'
  },
  '/crm/upManage/upDetail': (query) => {
    return location.origin + `/york/crm-data-platform/#/data-platform/up-analyze?mid=${query.mid}`
  }
}
export const handleRedirect = (routeConf) => {
  const handler = redirectMap[routeConf.path]
  if (!handler) return
  const redirectUrl = typeof handler === 'function' ? handler(routeConf.query, routeConf.params) : handler
  if (redirectUrl) window.location.href = redirectUrl
  return true
}