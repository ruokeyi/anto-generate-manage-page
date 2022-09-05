<template>
  <span
    class="level-tag"
    :style="{
      backgroundPosition,
    }"
  >
  </span>
</template>

<script>
export default {
  props: {
    level: Number
  },
  computed: {
    backgroundPosition() {
      return `-115px -${10 + 36 * this.level}px`
    }
  }
}
</script>

<style lang="scss" scoped>
.level-tag {
  display: inline-block;
  background-image: url("./level.png");
  width: 20px;
  height: 15px;
}
</style>