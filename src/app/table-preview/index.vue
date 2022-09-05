<template>
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
export default {
  components:{CrmDataTable},
  computed:{
    conf(){
      return this.$store.getters.conf
    }
  },
  created(){
    console.log(this.$store.getters.conf)
  }
}
</script>