// /controllers/home.js
 
class HomeCtrl{
  index(ctx){
      ctx.body = '<h1>首页</h1>'
  }
}

module.exports=new HomeCtrl()