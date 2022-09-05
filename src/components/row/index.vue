<template>
  <!--用来做一些常用的行布局-->
  <div class="bc-row">
    <div
      class="left"
      :style="{
        gap: gap + 'px',
      }"
    >
      <slot></slot>
    </div>
    <div
      class="right"
      :style="{
        gap: gap + 'px',
      }"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "bc-row",
  props: {
    gap: {
      default: 0,
    },
  },
};
</script>


<style scoped>
.bc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left,
.right {
  display: flex;
  align-items: center;
}
</style>