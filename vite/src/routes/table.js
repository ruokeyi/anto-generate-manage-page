// /routes/users.js
 
const Router = require('koa-router')
const tableRouter = new Router({ //配置路由前缀为table的路由
    prefix: '/table'
})
const {generateTable, getTable}=require('../controllers/table.js')
 
tableRouter.get('/', getTable)
tableRouter.post('/', generateTable)
 
module.exports=tableRouter