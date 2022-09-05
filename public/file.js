/**
 * @author: Benny
 * @description: 测试测试 自动创建文件
 * @param {type} 
 */
 let fs = require('fs')
 let path = require('path')
 
 
 /**
  * @author: Benny
  * @description: 读取目录文件
  * @param {dir} 指定读取目录路径 
  */
 function readFileList(dir,filesList = []){
     const files = fs.readdirSync(dir);
     files.forEach((item, index) => {
         var fullPath = path.join(dir, item);
         const stat = fs.statSync(fullPath);
         // console.log(path.dirname(fullPath))
         if (stat.isDirectory()) { //如果当前是文件目录     
             readFileList(path.join(dir, item), filesList);  //递归读取文件
         } else {                
             filesList.push(fullPath);                     
         }        
     });
     return filesList;
 }
 
 /**
  * @author: Benny
  * @description:递归创建目录 异步方法  
  * @param {dirname} 文件夹名称
  */
 function mkdirs(dirname, callback) {  
     fs.exists(dirname, function (exists) {  
         if (exists) {  
             // 是个目录则执行callback方法
             callback();  
         } else { 
             // 递归调用mkdirs
             /*console.log(dirname);  
             console.log(path.dirname(dirname)); */ 
             mkdirs(path.dirname(dirname), function () {  
                 fs.mkdir(dirname, callback);  
                 console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
             });  
         }  
     });  
 } 
 
 /**
  * @author: Benny
  * @description: 创建文件
  * @param {filename}  文件路径+名字
  */
 function makeFiles(filename,content){
     fs.writeFile(filename,content,function (err) {
         if(err){
             console.log("error");
             return;
         }
         console.log(`创建${filename}成功`);
 
     })
 }
 
 let filesList = readFileList('src/views')
 let jsTemplate = `export default {
     data() {
         return {
 
         }
     },
     created() {
         
     },
 }`
 let newList = []
 filesList.forEach((item)=>{
     let jsItem = item.replace(/views/g,'scripts');
     newList.push(jsItem)
     let cssItem = item.replace(/views/g,'styles');
     newList.push(cssItem)
 
 })
 
 newList.forEach((item)=>{
     let dir = path.parse(item).dir //文件夹路径
     let filename = path.parse(item).name.replace(/^\_([A-Z])/g,function(str){
         return str.toLowerCase().replace(/\_/g,'')
     }) //文件名称
     let newFileNamePath;
     //包含style且排除block
     // if(dir.indexOf('styles')>0 && dir.indexOf('block') == -1 ){
     if(dir.indexOf('styles')>0){
         newFileNamePath = `${dir}/${filename}.less`
         mkdirs(dir,(data)=>{
             //如果文件已存在
             if(fs.existsSync(newFileNamePath)){
                 console.log('已存在')
             }else{
                 //生成文件
                 makeFiles(newFileNamePath,'')
             }
         })
     }
 
     if(dir.indexOf('scripts')>0){
         newFileNamePath = `${dir}/${filename}.js`
         mkdirs(dir,(data)=>{
             //如果文件已存在
             if(fs.existsSync(newFileNamePath)){
                 console.log('已存在')
             }else{
                 //生成文件
                 makeFiles(newFileNamePath,jsTemplate)
             }
         })
     }
  
 }) 