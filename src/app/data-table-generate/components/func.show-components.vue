<template>
  <div class="fr-wp">
    <el-button v-for="(item,index) in func.list" :key="item.key" :type="item.button_type" class="mg12"
    @click="$emit('openRightPanel', { index: index, item: item, eleType:'button' })">{{item.label}}</el-button>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  emits:['openRightPanel'],
  props:{
    func:{type:Object}
  },
  watch: {
    func:{
      handler(nv){
        console.log(nv)
      },
      deep:true
    }
  },
})
</script>
