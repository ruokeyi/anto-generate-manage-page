const Koa = require('koa')
const app = new Koa()
const cors = require("koa2-cors");//导入跨域模块
// 定义允许跨域的origin
const allowOrigins = [
  // "http://local:8065",
  "http://up-profit.bilibili.co/"
];
app.use(cors({
  origin: function(ctx) {
    if (allowOrigins.includes(ctx.header.origin)) {
      return ctx.header.origin;
    }
    return false;
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 0,
  credentials: true,
  withCredentials:true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
const bodyparser = require('koa-bodyparser')
app.use(bodyparser()) 
app.use(cors());
 // 2.使用koa-json-error中间件进行异常处理
const error = require('koa-json-error')
app.use(error({
    // development环境下返回错误栈stack，production环境下不返回错误栈stack
    postFormat: (e, {stack,...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
}))
 
// 3.使用koa-parameter中间件校验参数格式是否正确
const parameter = require('koa-parameter')
app.use(parameter(app)) // app参数使koa-parameter可以全局使用

const router=require('./routes/home.js')
const tableRouter=require('./routes/table.js')
 
app.use(router.routes())
app.use(tableRouter.routes())
app.use(tableRouter.allowedMethods())
 
app.listen(3012,()=>{
    console.log('Koa Server running at http://127.0.0.1:3012')
})