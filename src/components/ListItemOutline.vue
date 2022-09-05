<template>
  <div class="outer" :class="`to-${to}`" :style="{width}">
    <div class="inner">
      <div class="title" v-if="title">
        {{ title }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-item-outline',
  props: {
    title: String,
    to: {type: String, default: 'right'},
    width: {type: String},
  },
};
</script>

<style scoped lang="stylus">

c1 = desaturate(rgba(192, 202, 214, 0), 100%)
c2 = desaturate(rgba(235, 206, 208, 0), 100%)
c3 = desaturate(rgba(216, 202, 175, 0), 100%)


.outer {
  border: 1px solid rgba(216, 202, 175, 0.4)
  padding: 1px
  flex-shrink 0
  background: rgba(216, 202, 175, 0.1)
}

.inner {
  display: flex
  height: 100%
  width: 100%
  position: relative
}

.title {
  position: absolute
  z-index: 123
  font-size: 12px
  left: -15px
  top: -10px
  background: #c9c0d3
  color: #f6f7f8
  border: 1px solid darken(#c9c0d3cc, 15)
  padding: 0 4px
  border-radius: 6px
  transform scale(.9)
  user-select none
  cursor:default

  &:hover {
    transform scale(1.1)
    border-color: rgba(black, 0.6)
    background: var(--theme-color--crm)
  }
}
</style>
