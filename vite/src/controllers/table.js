// /controllers/users.js
 const createFile = require("../createFiles")
 const compress = require("../zip")
// 虚拟数据
const db = [{
  name: '小明',
  age: '13',
  sex: '男'
}, {
  name: '小红',
  age: '15',
  sex: '女'
}]

class tableCtrl{
  getTable(ctx){
      ctx.set('Allow', 'GET,POST') // 设置响应头Headers
      ctx.body = db
  }
  generateTable(ctx){
    try{
       createFile(JSON.stringify(ctx.request.body))
       compress()
       ctx.body = {meassage:'执行成功',code: 0}
    }catch(e){
      ctx.body = {meassage:e,code: -1}
    }
    
     
      // ctx.body = ctx.request.body
      ctx.body = {meassage:'执行成功',code: 0}
  }
}

module.exports=new tableCtrl()