/**
 * 获取url链接参数
 * @param name
 * @returns {Object|*}
 */
export function getUrlParams(key){
    //key存在先通过search取值如果取不到就通过hash来取
    let after = window.location.search.substr(1) || window.location.hash.split("?")[1];
    if(after) {
        const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        const r = after.match(reg);
        if(r != null) {
            return  decodeURIComponent(r[2]);
        } else {
            return null;
        }
    }
}
export function getUrlQuery() {
  let str = window.location.search.substr(1) || window.location.hash.split("?")[1];
  let query = null;
  if (str) {
    query={}
      const pairs = str.split("&");
      for(let i = 0; i < pairs.length; i ++) {
           const pair = pairs[i].split("=");
          query[pair[0]] = pair[1];
      }
  }
  return query ;  // 返回对象
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export function  extractPurText (html) {
  const hh = html.replace(/<[^>]+>/g, "").replace("&nbsp;", "\n");
  return hh
};