// 通用业务方法
const baseUpDetailUri = `/york/crm-data-platform/#/data-platform/up-analyze`
const upSpaceUrl = `https://space.bilibili.com/`

/**
 * 根据mid 或uid 拼接up主profile页的url
 * @param mid
 * @returns {string}
 */
export function getUpDetailUrl(mid){
    return `${baseUpDetailUri}?mid=${mid}`
}
/**
 * 根据mid 或uid 拼接up主空间个人页的url
 * @param mid
 * @returns {string}
 */
export function getUpSpaceUrl(mid){
    return `${upSpaceUrl}${mid}`
}
