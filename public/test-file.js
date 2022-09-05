const fs = require('fs')
// 导出代码
function addfile(bcName,) {
  // 检查当前目录中是否存在该文件。
  fs.access('./ftest', err => {
    if (err) {
      fs.mkdir('./ftest', { recursive: true }, err => {
        if (err) throw err;
      });
    } else {
      console.log('dir exists');
    }
  });
  const fpath = `${bcName}`;
  fs.access('./ftest/' + fpath, err => {
    if (err) {
      fs.mkdir('./ftest/' + fpath, { recursive: true }, err => {
        if (err) throw err;
      });
    } else {
      console.log('dir exists');
    }
  });

  console.log(bcName + ' mkdir completely');
}
addfile('BcTest')