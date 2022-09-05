<template>
  <collapsible-panel :foldOperatorBtn="true" @switch="handlePanelSwitch">
    <template #canFold>
      <el-form
        v-if="filterParams"
        size="small"
        :model="filterParams"
        label="120px"
        label-position="right"
        class="operate-panel"
      >
        <div class="row">
          <el-form-item
            v-for="item in items"
            :key="confPaint[item].label"
            :label="confPaint[item].label"
            :style="{
              width: confPaint[item].width
                ? confPaint[item].width
                : `${100 / (rowSpan)}%`,
              paddingRight: '12px',
            }"
          >
            <el-input
              v-if="confPaint[item].type === 'input'"
              :placeholder="
                confPaint[item].placeholder || `请输入${confPaint[item].label}`
              "
              v-model="filterParams[item]"
            />
            <el-select
              v-if="confPaint[item].type === 'select'"
              v-model="filterParams[item]"
              style="width:100%;"
              :multiple="confPaint[item].multiple"
            >
              <el-option
                v-for="op in confPaint[item].options"
                :key="op.key || op.value"
                :label="op.label"
                :value="op.key || op.value"
              />
            </el-select>
             <el-cascader
              style="width:100%;"
              v-if="confPaint[item].type === 'casecader'"
              v-model="filterParams[item]"
              :options="confPaint[item].options"
              :props="confPaint[item].prop"
              :collapse-tags="confPaint[item].colloapseTags"
            ></el-cascader>
            <m-datetime-range-picker
              v-if="confPaint[item].type === 'datetimerange'"
            v-model:start="
                filterParams[
                  confPaint[item]?.param
                    ? confPaint[item].param[0]
                    : 'start_time'
                ]
              "
              v-model:end="
                filterParams[
                  confPaint[item]?.param ? confPaint[item].param[1] : 'end_time'
                ]
              "
              type="datetimerange"
              range-separator="-"
              :start-placeholder="dateStartPlaceholder"
              :end-placeholder="dateEndPlaceholder"
              size="small"
              style="width:100%;"
            ></m-datetime-range-picker>
          </el-form-item>
          <el-form-item style="padding-left: 30px">
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
          </el-form-item>
        </div>
      </el-form>
    </template>
  </collapsible-panel>
</template>
<script>
import { ref } from "@vue/runtime-core";
import CollapsiblePanel from "@/components/collapsePanel/index.vue";
import MDatetimeRangePicker from "@/components/m-date-picker/mDatetimeRangePicker.vue";
export default {
  props: {
    confPaint: {
      type: Object,
      required: true,
    },
    initP: {
      type: Object,
      required: true,
    },
    rowSpan: {
      type: Number,
      default:4,
    },
    dateStartPlaceholder: {
      type: String,
      default: "开始时间",
    },
    dateEndPlaceholder: {
      type: String,
      default: "结束时间",
    },
    hasExport: {
      type: Boolean,
      default: true,
    },
    exportAuthKey: {
      type: String,
    },
  },
  emits:['reset','query','export'],
  components: { MDatetimeRangePicker, CollapsiblePanel },
  watch:{
    initP(ov){
      this.filterParams = {...ov}
    }
  },
  setup(props) {
    const filterParams = ref({});
    const items = ref([]);
    items.value = Object.keys(props.confPaint);
    filterParams.value = { ...props.initP };
    return {
      filterParams,
      items,
    };
  },
  methods: {
    handlePanelSwitch(folded) {
      // this.panelFolded = folded;
    },
    clear() {
      this.filterParams = { ...this.initP };
      this.$emit("query", this.filterParams);
    },
  },
};
</script>
<style lang="less" scoped>
.operate-panel {
  padding: 20px 30px 5px 30px;
  background: #f3f2f1;
  display: flex;
  justify-content: space-between;
  .row {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
  }
}
</style>
