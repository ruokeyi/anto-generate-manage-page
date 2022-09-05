<template>
  <!--隐藏域/业务域-->
  <template v-if="['hidden'].includes(viewType)"/>

  <!--标准输入框-->
  <template v-else-if="['input'].includes(viewType)"></template>

  <!--mid输入框-->
  <template v-else-if="['mid'].includes(viewType)"></template>

  <!--数字输入框-->
  <template v-else-if="['number'].includes(viewType)"></template>

  <!--数值区间-->
  <template v-else-if="['range'].includes(viewType)"></template>

  <!--日期区间-->
  <template v-else-if="['date_range'].includes(viewType)"></template>

  <!--选择-->
  <template v-else-if="['select'].includes(viewType)">

    <!--单选/复选组-->
    <template v-if="['check','radio'].includes(viewFormat)"></template>

    <!--下拉-->
    <template v-else></template>

  </template>

  <!--单选组-->
  <template v-else-if="['radioGroup'].includes(viewType)"></template>
</template>

<script>
export default {
  name: 'toolbar-field',
  props: {
    modelValue: {type: Object, default: () => null},
    prop: {type: [String, Array]},
    viewType: {type: String, default: 'input'},
    viewFormat: {type: [Array, String], default: []},
    placeholder: {type: String, default: null},
  },
};
</script>

<style scoped>

</style>
