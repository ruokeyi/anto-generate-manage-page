<template>
  <el-input
      :modelValue="modelValue" placeholder="搜索mid或者昵称"
      @update:modelValue="$emit('update:modelValue',$event)"/>
</template>

<script>
export default {
  name: 'xn-mid-input',
  props: {
    modelValue: String,
  },
  methods: {
    doNothing() {
    },
  },
};
</script>

<style scoped>

</style>
