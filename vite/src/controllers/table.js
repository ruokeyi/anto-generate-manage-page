// /controllers/users.js
 const createFile = require("../createFiles")
 const compress = require("../zip")
class tableCtrl{
  getTableComponent(ctx){
    try{
      compress(['src/components/crm-data-table'],'table-component')
      ctx.body = {meassage:'执行成功',code: 0}
    } catch(e){
      ctx.body = {meassage:e,code: -1}
    }
  }
  generateTable(ctx){
    try{
       createFile(JSON.stringify(ctx.request.body))
       compress(['table-data'],'data-table')
       ctx.body = {meassage:'执行成功',code: 0}
    }catch(e){
      ctx.body = {meassage:e,code: -1}
    }
  }
}

module.exports=new tableCtrl()