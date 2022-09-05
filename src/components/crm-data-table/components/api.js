import { http } from '@/app/services/http/http';
import qs from 'qs'
// 列表
export const getList = async (params,url,mockId) => {
  const {data} = await http.get(url, {
    params,
    mockId
  });
  return data
}
// 新建
export const createData = async (obj,url,mockId) => {
  const {data} = await http.post(url, obj, {mockId});
  return data
}
// 查询单条 id id
export const viewData = async (params,url,mockId) => {
  const {data} = await http.get(url, {
    params,
    mockId
  });
  return data
}
// 删除
export const deleteData = async (obj,url,mockId) => {
  const {data} = await http.post(url, obj, {mockId});
  return data
}
// // 更新
// export const updateData = async (obj,url,mockId) => {

// }
// 更新
export const updateData = async (params,url,mockId,method)=> {
  if(method){
    let res = await http[method](url, {
      ...params
    })
    return res.data
  }else{
    const {data} = await http.post(url, params, {mockId});
    return data
  }
}
//导入
export async function importList(obj,url,mockId) {
  const {data} = await http.post(url, obj, {mockId});
  return data
}
//导出
export async function exportList(params,url,mockId) {
  const req = mockId?`/mock/${mockId}/allowance/api${url}`:`/allowance/api${url}`
  // let query = '?'
  // const keys = Object.keys(params)
  // keys.map(k=>{
  //   query+=`&${k}=${params[k]}`
  // })
  window.open(`${req}?${qs.stringify(params)}`)
  // let data = await axios({
  //   method: 'get',
  //   url: mockId?`/mock/${mockId}/allowance/api${url}`:`/allowance/api${url}`, // 接口地址
  //   params:params,
  //   responseType: 'blob'
  // })
  // let filename = data.headers['content-disposition']?data.headers['content-disposition']
  // .split(";")[1]
  // .split("=")[1]:'列表.csv'
  // handleFileDownload(data.data, filename)
}
function handleFileDownload(data, fileName) {
  let file = data
  let url = window.URL || window.webkitURL;
  let fileURL = url.createObjectURL(file);
  let a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  a.target = "_self";
  a.click();
  url.revokeObjectURL(fileURL);
}