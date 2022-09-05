<template>
  <el-tooltip :disabled="!disabled" :placement="placement" :content="disableMessage">
    <div class="m-button">
      <el-button v-if="type!=='text'" :size="size" :type="type" :disabled="!!disabled" @click="$emit('click')">
        <slot name="default"></slot>
      </el-button>
       <el-button v-else :size="size" link type="primary" :disabled="!!disabled" @click="$emit('click')">
        <slot name="default"></slot>
      </el-button>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'm-button',
  emits: ['click'],
  props: {
    type: {type: [String]},
    disabled: {type: [Boolean, String], default: false},
    placement: {type: String, default: 'top', required: false},
    size: {type: String, default: 'small'},
  },
  computed: {
    disableMessage() {
      if (typeof this.disabled === 'string') {
        return this.disabled;
      } else {
        return '';
      }
    },
  },
};
</script>

<style>
.m-button {
  display: flex;
}

.m-button + .m-button {
  margin-left: 10px;
}

.el-button + .m-button {
  margin-left: 10px;
}

.m-button + .el-button {
  margin-left: 10px;
}
</style>
