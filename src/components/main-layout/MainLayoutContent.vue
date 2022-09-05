<template>
  <div class="MainLayoutContent__Wrapper">
    <div class="MainLayoutContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayoutContent',
};
</script>

<style scoped>
.MainLayoutContent__Wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 32px;
  padding-bottom: 64px;
}

.MainLayoutContent {
  width: calc(100vw - 128px);
  background: #FFFFFF;
  min-height: 400px;
}
</style>
