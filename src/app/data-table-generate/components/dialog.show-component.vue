<template>
  <el-form label-position="left" max-label-width="120px">
    <div class="row mg12">
      <el-form-item
        v-for="(item, index) in items"
        :key="item.label"
        :label="item.label"
        @click="
          $emit('openRightPanel', {
            index: index,
            item: item,
            eleType: item.type,
          })
        "
        :style="{
          paddingRight: '12px',
          color: curIndex===index?'':''
        }"
      >
        <div class="fr">
          <el-input
            :style="{ width: item?.width || '100%' }"
            v-if="item.type === 'input'"
             disabled
            :placeholder="item.placeholder || `请输入${item.label}`"
          />
          <el-input-number
            :style="{ width: item?.width || '100%' }"
            v-if="item.type === 'inputNumber'"
            :min="item.min"
            :placeholder="item.placeholder || `请输入${item.label}`"
            disabled
          />
          <el-input
            :style="{ width: item?.width || '100%' }"
            v-if="item.type === 'textarea'"
            type="textarea"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :maxlength="item.maxlength"
            :show-word-limit="item.showwordlimit || true"
            disabled
          />
          <el-select
            :style="{ width: item?.width || '100%' }"
            :multiple="item.multiple"
            :disabled="true"
            v-if="item.type === 'select'"
          >
            <el-option
              v-for="op in item.options"
              :key="op.key"
              :label="op.label"
              :value="op.key"
            />
          </el-select>
          <el-date-picker
           disabled
            :style="{ width: item?.width || '100%' }"
            v-if="item.type === 'date'"
            type="datetime"
            format="YYYY/MM/DD HH:mm:ss"
          ></el-date-picker>
          <el-tag
            :style="{ width: item?.width || '100%' }"
            v-if="item.type === 'component'|| item.type === 'html'"
          >{{item.label}}</el-tag>
          <el-icon @click="$emit('delete', index)"><Delete /></el-icon>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
import MDatetimeRangePicker from "@/components/m-date-picker/mDatetimeRangePicker.vue";
export default {
  emits: ["openRightPanel"],
  components: { MDatetimeRangePicker },
  props: {
    confPaint: { type: Object, required: true },
    rowSpan: { type: Number, default: 4 },
    curIndex: { type: Number },
  },
  watch: {
    confPaint: {
      handler(nv) {
         this.items = nv.items
      },
      deep: true,
    },
  },
  data() {
    return{
      items:this.confPaint.items
    }
  },
};
</script>
<style lang="less" scoped>
.row {
  display: flex;
  flex-wrap: wrap;
}
</style>