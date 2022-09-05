<template>
  <el-tooltip v-if="title" :show-after="1000">
    <template #content>{{ title }}</template>
    <button
        class="XnToolbarButton"
        @click.stop="handleClick"
        :class="`XnToolbarButton--${circle?'circle':'default'}  XnToolbarButton--${size} ${disabled?'XnToolbarButton--disabled':''}`">
    <span class="toolbar-inner">
      <slot/>
    </span>
    </button>
  </el-tooltip>

  <button v-else
          class="XnToolbarButton"
          @click.stop="handleClick"
          :class="`XnToolbarButton--${circle?'circle':'default'}  XnToolbarButton--${size} ${disabled?'XnToolbarButton--disabled':''}`">
    <span class="toolbar-inner">
      <slot/>
    </span>
  </button>
</template>

<script>
export default {
  name: 'xn-toolbar-button',
  emits: ['click'],
  props: {
    title: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small',
      validator: value => ['min', 'mini', 'small', 'normal', 'lager'].includes(value),
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },
  emit: ['click'],
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.XnToolbarButton {
  border: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  color #444
  background: transparent
  padding: 0

  &.XnToolbarButton--min > .toolbar-inner {

  }

  &.XnToolbarButton--mini > .toolbar-inner {
    padding: 0 6px
  }

  &.XnToolbarButton--small > .toolbar-inner {
    padding: 0 16px
  }

  &.XnToolbarButton--normal > .toolbar-inner {
    padding: 0 20px
  }

  &.XnToolbarButton--lager > .toolbar-inner {
    padding: 0 24px
  }

  &.XnToolbarButton--disabled {
    cursor: not-allowed !important;
    color: #999;
    font-weight 400;

    &:hover {
      color: #999;
      font-weight 400;
      background: transparent;

    }
  }

  &.XnToolbarButton--default:hover {
    background: rgba(0, 0, 0, .2);
    color: #222
  }

  &.XnToolbarButton--default:active {
    background: rgba(0, 0, 0, .25)
  }

  &.XnToolbarButton--circle:hover {
    //background: rgba(0, 0, 0, .2);
    color: #222
    font-weight bold

    & .toolbar-inner {
      background: darken(#2b5c9a, 5)
      box-shadow 0px 0px 4px rgba(0, 0, 0, .8)
      color lemonchiffon
    }
  }

  &.XnToolbarButton--circle:active {
    & .toolbar-inner {
      background: darken(#2b5c9a, 15)
      color lemonchiffon
    }
  }
}

.XnToolbarButton--circle .toolbar-inner {
  width: 18px
  height: 18px
  background: var(--theme-color--crm)
  color: #fff
  border-radius: 50%
  font-size: 12px
  margin: 4px
}

.toolbar-inner {
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  background: rgba(0, 0, 0, .01);
}
</style>
