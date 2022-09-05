<template>
  <div class="content-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.content-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-sizing: border-box;
  margin: 40px auto;
  width: calc(100% - 80px);
  max-width: 1440px;
  min-width: 1100px;
}
</style>