<template>
  <el-form label-position="left" max-label-width="120px">
    <div class="row mg12">
      <el-form-item
        v-for="(item, index) in items"
        :key="confPaint[item].label"
        :label="confPaint[item].label"
        @click="
          $emit('openRightPanel', { index: index, item: confPaint[item], eleType: confPaint[item].type})
        "
        :style="{
          paddingRight: '12px',
        }"
      >
        <div class="fr">
          <el-input
            v-if="confPaint[item].type === 'input'"
            :placeholder="
              confPaint[item].placeholder || `请输入${confPaint[item].label}`
            "
            disabled
          />
          <el-select
            v-if="confPaint[item].type === 'select'"
            style="width: 100%"
             disabled
          >
            <el-option
              v-for="op in confPaint[item].options"
              :key="op.key || op.value"
              :label="op.label"
              :value="op.key || op.value"
            />
          </el-select>
          <el-cascader
            style="width: 100%"
            v-if="confPaint[item].type === 'casecader'"
            :options="confPaint[item].options"
            :props="confPaint[item].prop"
            :collapse-tags="confPaint[item].colloapseTags"
          ></el-cascader>
          <m-datetime-range-picker
            v-if="confPaint[item].type === 'datetimerange'"
            type="datetimerange"
            range-separator="-"
            :start-placeholder="dateStartPlaceholder"
            :end-placeholder="dateEndPlaceholder"
            size="small"
            style="width: 100%"
          ></m-datetime-range-picker>
          <el-icon @click="$emit('delete', index)"><Minus /></el-icon>
        </div>
      </el-form-item>

      <!-- <el-form-item style="padding-left: 30px">
            <el-button size="small" @click="$emit('reset')">重置</el-button>
            <el-button
              size="small"
              type="primary"
              @click="$emit('query', filterParams)"
              >查询</el-button
            >
            <span v-if="exportAuthKey" class="mgl12">
              <el-button
                v-if="hasExport && $auth(exportAuthKey)"
                size="small"
                type="success"
                @click="$emit('export', filterParams)"
                >导出列表</el-button
              >
            </span>
            <span v-if="!exportAuthKey" class="mgl12">
              <el-button
                v-if="hasExport"
                size="small"
                type="success"
                @click="$emit('export', filterParams)"
                >导出列表</el-button
              >
            </span>
          </el-form-item> -->
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
  },
  watch: {
    confPaint: {
      handler(nv) {
        console.log(nv);
      },
      deep: true,
    },
  },
  computed: {
    items() {
      return Object.keys(this.confPaint);
    },
  },
};
</script>
<style lang="less" scoped>
.row {
  display: flex;
  flex-wrap: wrap;
}
</style>