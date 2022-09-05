<template>
  <div style="display: flex; flex-wrap: nowrap" class="XnNumberRange">
    <el-input
      class="lvalue"
      style="width: 100%"
      :modelValue="modelValue"
      @update:modelValue="update('modelValue', $event, 'number')"
      @keypress.enter.prevent="$emit(`update-all`, $event)"
      placeholder="整数"
    />
    <span class="xn-range-number-middle" style="padding: 0 4px">~</span>
    <el-input
      class="rvalue"
      style="width: 100%"
      :modelValue="value2"
      @update:modelValue="update('value2', $event, 'number')"
      @keypress.enter.prevent="$emit(`update-all`, $event)"
      placeholder="整数"
    />
    <div style="margin-left: 4px">
      <el-popover
        trigger="hover"
        v-if="rangeDefaultValues && rangeDefaultValues.length > 0"
        width="250px"
      >
        <el-tag
          v-for="item of rangeDefaultValues"
          size="small"
          :key="item.title"
          style="margin: 8px 4px; cursor: pointer"
          @click="rangeUpdate(item)"
        >
          {{ item.title }}
        </el-tag>
        <el-tag
          size="small"
          type="info"
          style="margin: 8px 4px; cursor: pointer"
          @click="rangeUpdate({ value: [null, null] })"
          >清空
        </el-tag>
        <template #reference>
          <el-button link type="primary"><i class="el-icon-more"></i></el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
let allTypes = [String, Number, Object, Boolean, Array];
export default {
  props: {
    modelValue: { type: allTypes },
    value2: { type: allTypes },
    rangeDefaultValues: {
      type: Array,
      default: [
        { title: "<5k", value: [null, 4999] },
        { title: "5k ~ 1w", value: [5000, 9999] },
        { title: "1w ~ 10w", value: [10000, 99999] },
        { title: "10w ~ 50w", value: [100000, 499999] },
        { title: "50w ~ 100w", value: [500000, 999999] },
        { title: "100w+", value: [1000000, null] },
      ],
    },
  },
  methods: {
    async rangeUpdate(item) {
      this.update("modelValue", item.value[0], "number");
      this.update("value2", item.value[1], "number");
    },
    update(key, eventValue, type) {
      let value = eventValue;
      this.$emit(`update:${key}`, value);
      this.$emit(`update-all`, value);
    },
  },
};
</script>

<style lang="stylus">
.XnNumberRange {
  .lvalue {
    input {
      border-right: 1px solid #DCDFE6;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;

      &:focus {
        border-color: #409EFF;
      }
    }
  }

  .rvalue {
    input {
      border-left: 1px solid #DCDFE6;
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;

      &:focus {
        border-color: #409EFF;
      }
    }
  }

  .xn-range-number-middle {
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    box-sizing: border-box;
    // background: #f5f6f7
    height: 28px;
  }
}
</style>
