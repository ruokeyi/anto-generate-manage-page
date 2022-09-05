<template>
  <div class="fc mgt12">
    <el-descriptions :column="5" border direction="vertical">
      <el-descriptions-item
        v-for="index in tableCol"
        :key="index"
      >
      <template #label>
        <span>
          <span>{{`列${index}`}}</span>
          <el-button-group size="small">
        <el-button type="primary" @click="$emit('back',index)" icon="Back" />
        <el-button type="primary" @click="$emit('next',index)" icon="Right" />
        <el-button type="primary" @click="$emit('delete',index)" icon="Delete" />
          </el-button-group>
          
        </span>
      </template>
        <div class="fr">
          <el-tag size="small" @click="
          $emit('openRightPanel', {
            index: index-1,
            item: tableColumn.cols[index-1],
            eleType: 'tableColumn',
          })
        ">{{`${tableColumn.cols[index-1]?.label}(${tableColumn.cols[index-1]?.key})` || ''}}</el-tag>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import {cloneDeep} from 'lodash'
const itemTemplate = {
  type: "text",
  label: "这是一个demo列",
  key: "name",
  width: "200px",
  render: null,
};
export default defineComponent({
  emits: ["openRightPanel","back","next","delete"],
  props: {
    tableColumn: { type: Object },
  },
  watch: {
    tableColumn: {
      handler(nv){
        this.tableCol = nv.cols?.length
      },
      deep:true
    }
  },
  data() {
    return {
      tableCol: this.tableColumn?.cols?.length,
    };
  },
  setup() {
    return { itemTemplate };
  },
});
</script>
