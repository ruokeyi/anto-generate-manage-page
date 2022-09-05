const fs = require('fs')
function transData(conf){
  const obj = JSON.parse(conf).configObj
  let temp = "export const conf = {"
  Object.keys(obj).map(o=>{
    temp+=` ${o} = ${JSON.stringify(obj[o])},\n`
  })
  temp+="}"
  return temp
}
const indexTemp =`<template>
<div>
<crm-data-table 
  :authPoint="conf.authPoint" 
  :pageTitle="conf.pageTitle" 
  :toolbarConf="conf.toolbarConf"
  :toolbarRowSpan="conf.toolbarRowSpan"
  :dialogConf="conf.dialogConf"
  :listConf="conf.listConf"
  :dialogComponent="conf.dialogComponent"
  :pageSizes="conf.pageSizes"
  :detailPage="conf.detailPage"
  :exportAuthKey="conf.exportAuthKey"
  :getListApi="conf.getListApi"
  :exportListApi="conf.exportListApi"
  :createApi="conf.createApi"
  :deleteApi="conf.deleteApi"
  :viewApi="conf.viewApi"
  />
</div>
</template>
<script>
import CrmDataTable from '@/components/crm-data-table/index.vue'
import { conf } from './config'
export default {
  components:{ CrmDataTable },
  setup(){
   return {
      conf
    }
  }
}
</script>`
function createFile(data) {
  fs.existsSync('table-data') || fs.mkdirSync('table-data')
  const data_trans = transData(data)
  fs.writeFile('table-data/config.jsx', data_trans, 'utf8', (err) => {
    if (err) {
      throw err
    }
    console.log('文件写入成功')
  })
  fs.writeFile('table-data/index.vue', indexTemp, 'utf8', (err) => {
    if (err) {
      throw err
    }
    console.log('文件写入成功')
  })
}
module.exports = createFile
