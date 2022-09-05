<template>
  <div style="display: flex;justify-content: center;">
    <img src="../assets/image/empty.png" :style="{width}"/>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    width: { type: String, default: '728px' },
  },
};
</script>

<style scoped>
</style>
