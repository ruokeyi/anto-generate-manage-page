const static = require('koa-static')
const path = require('path')
function staticPlugin({app,root}) {
  app.use(static(root)) // 这个root指的是根目录哦~~当我访问我的服务localhost:8970的时候，它会去找根目录下面的index.html
  app.use(static(path.resolve(root,'src')))
}
module.exports = staticPlugin