<template>
  <div class="m-fold-panel">
    <div class="fixed-wrapper">
      <slot name="fixed"></slot>
    </div>
    <div class="folded-wrapper" v-show="fold">
      <slot name="canFold"></slot>
    </div>
    <div class="operators" v-show="!foldOperatorBtn||(foldOperatorBtn&&fold)">
      <slot name="operators"></slot>
    </div>
    <div class="switch" @click="handleSwitch">
      <!-- <el-tooltip :content="foldText" effect="dark" placement="top"> -->
        <i :class="`el-icon-arrow-down ${fold ? 'fold-icon' : 'unfold-icon'}`"></i>
        <span>{{foldText}}</span>
      <!-- </el-tooltip> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'foldablePanel',
  emits: ['switch'],
  props: {
    isFold:{ type: Boolean, default: true },
    foldOperatorBtn:{ type: Boolean, default: false },
  },
  data() {
    return {
      fold: this.isFold,
      foldText: this.isFold ? '收起' : '展开'
    }
  },
  methods: {
    handleSwitch() {
      this.fold = !this.fold
      this.foldText = this.fold ? '收起' : '展开'
      this.$emit('switch', this.fold)
    }
  }
};
</script>

<style scoped lang="scss">
.m-fold-panel {
  padding: 0 20px;
  background: #f3f2f1;
  position: relative;
  overflow: visible;
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
  transform: rotate(180deg);
}
.unfold-icon {
  transform: rotate(0deg);
}
</style>