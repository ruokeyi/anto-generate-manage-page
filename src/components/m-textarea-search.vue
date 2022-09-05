<template>
  <el-input class="textarea-search" v-bind="$attrs" type="textarea" :placeholder="placeholder" resize="none"></el-input>
</template>

<script>


export default {
  name: 'm-textarea-search',
  props: {
    placeholder: {type: String, default: '可输入多个，回车分隔'},
  },
};
</script>

<style lang="scss" scoped>
.textarea-search > ::v-deep textarea {
  height: 28px;
  transition: height .2s;
  &:focus {
    height: 56px;
  }
}
</style>
