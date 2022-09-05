<template>
<div>
<crm-data-table 
  :authPoint="''" 
  :pageTitle="'crm数据表格'" 
  :toolbarConf="toolbarParams"
  :toolbarRowSpan="2"
  :dialogConf="dialogParams"
  :listConf="dataConfPaint"
  :mockId="9745"
  :getListApi="'/x/admin/crm-components/datatable/list'"
  :createApi="'x/admin/crm-components/datatable/create'"
  :viewApi="'/x/admin/crm-components/datatable/detail'"
  :updateApi="'/x/admin/crm-components/datatable/update'"
  :deleteApi="'/x/admin/crm-components/datatable/delete'"
  :exportListApi="'/x/admin/crm-components/datatable/export'"
  />
</div>
</template>
<script>
import CrmDataTable from './index.vue'
import {toolbarParams,dialogParams,dataConfPaint} from './components/config'
export default {
  components:{CrmDataTable},
  setup(){
    return {
      toolbarParams,
      dialogParams,
      dataConfPaint
    }
  }
  
}
</script>