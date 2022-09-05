<template>
  <div
    class="el-tag"
    :type="type"
    :id='`target-${label}`'
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd">
    {{ label }}
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    itemData: {
      type: Object,
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    label() {
      return this.itemData?.name;
    },
    type() {
      return this.draggable?'':'info';
    },
  },
  methods: {
    handleDragStart(evt) {
      evt.dataTransfer.setData("application/menuItem", JSON.stringify(this.itemData));
      evt.dataTransfer.dropEffect = "move";
    },
    handleDragEnd(evt) {
      evt.dataTransfer.dropEffect = "move";
    },
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  border-radius: 4px;
  text-align: center;
  &+.el-tag {
    margin-top: 8px;
  }
  cursor: move;

  &--default {
    color: #909399;
    background-color: #f4f4f5;
    border-color: #e9e9eb;
  }

  &--deafult-outline {
    color: #909399;
    background-color: #ffffff;
    border-color: #909399;
  }
}
</style>
