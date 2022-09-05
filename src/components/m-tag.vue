<template>
  <div class="MTag"
       :class="`MTag--${type} ${plain&&'MTag--plain'} ${noBorder&&'MTag--no-border'}`">
    <template v-if="!$slots.default">{{ content }}</template>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'm-tag',
  props: {
    content: String,
    type: {type: String, default: 'primary'},
    plain: {type: Boolean, default: false},
    noBorder: {type: Boolean, default: false},
  },
};
</script>

<style scoped lang="stylus">
.MTag {
  display: flex;
  flex-shrink 0
  flex-grow 0
  align-items: center;
  justify-content: center;
  height: 22px;
  line-height: 22px;
  border-radius 4px;
  padding: 0 10px;
  font-size: 14px;
  color white;
  border: 1px solid transparent

  &.MTag--primary {
    background: var(--theme-primary)
  }

  &.MTag--normal {
    background: #aaa
  }

  &.MTag--em {
    background var(--theme-sub-color)
  }

  &.MTag--info {
    background: var(--theme-lighter)
    color var(--theme-dark)
  }

  &.MTag--no-border {
    border-color transparent
    background: transparent
    &.MTag--primary {
      color: var(--theme-primary)
    }

    &.MTag--em {
      color var(--theme-sub-color)
    }

    &.MTag--info {
      color: var(--theme-lighter)
    }

    &.MTag--normal {
      color: var(--theme-normal)
    }
  }

  &.MTag--plain {
    background: transparent

    &.MTag--primary {
      border-color: var(--theme-primary)
      color: var(--theme-primary)
    }

    &.MTag--em {
      border-color var(--theme-sub-color)
      color var(--theme-sub-color)
    }

    &.MTag--info {
      border-color: var(--theme-lighter)
      color: var(--theme-lighter)
    }
    &.MTag--normal {
      border-color: var(--theme-normal)
      color: var(--theme-normal)
    }
  }

}
</style>
