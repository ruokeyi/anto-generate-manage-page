// /routes/table.js
const Router = require('koa-router')
const tableRouter = new Router({ // 配置路由前缀为table的路由
    prefix: '/table'
})
const { generateTable, getTableComponent }=require('../controllers/table.js')
 
tableRouter.get('/table/getTableComponent', getTableComponent)
tableRouter.post('/', generateTable)
 
module.exports=tableRouter