const { readBody } = require("./util")
const {parse} = require('es-module-lexer')
function reWriteImports(source) {
    let imports = parse(source)
    console.log(imports)
}
function reWritePlugin({app,root}) {
app.use(async (ctx, next) =>{
    await next() // 先走静态服务，因为默认会先执行 静态服务中间件，将结果放到ctx.body
    // 需要将流转换为字符串，而且我们只需要处理其中JS的引用问题
    console.log('reWritePlugin:')
    if(ctx.body && ctx.response.is('ts')){
        // console.log(ctx.body) // 这个打出来是main.ts的文件流
        let res = await readBody(ctx.body)
        const reWriteRes = reWriteImports(res)
        console.log(reWriteRes)
        console.log('ctx.body已打印完毕')
    }
})
}
module.exports = reWritePlugin