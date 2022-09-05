<template>
  <div class="m-operate-panel">
    <div :class="`content ${fold ? 'fold' : ''}`">
      <slot name="default"></slot>
    </div>
    <div class="operators">
      <slot name="operators"></slot>
    </div>
    <div class="switch" @click="handleSwitch">
      <el-tooltip placement="top" :content="iconText">
        <i :class="`el-icon-arrow-down ${fold ? 'fold-icon' : 'unfold-icon'}`"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'm-operate-panel',
  emits: ['switch'],
  data() {
    return {
      fold: true,
      iconText: '展开'
    }
  },
  methods: {
    handleSwitch() {
      this.fold = !this.fold
      this.iconText = this.fold ? '展开' : '收起'
      this.$emit('switch', this.fold)
    }
  }
};
</script>

<style scoped>
.m-operate-panel {
  padding: 20px;
  background: #f3f2f1;
  position: relative;
  overflow: visible;
}
.content {
  overflow: hidden;
}
.fold {
  height: 48px;
}
.operators {
  padding-left: 90px;
}
.switch {
  position: absolute;
  right: 28px;
  bottom: -16px;
  width: 30px;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  background: white;
  color: #448af4;
  border-radius: 0 0 6px 6px;
}
.el-icon-arrow-down {
  transform-origin: center center;
  transition: transform .3s;
}
.fold-icon {
  transform: rotate(0deg);
}
.unfold-icon {
  transform: rotate(180deg);
}
</style>
