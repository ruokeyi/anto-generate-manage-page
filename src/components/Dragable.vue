<template>
  <div class="dragable-ctn" @dragleave="dragleave" @dragenter="dragenter" @dragover="dragover" @drop="drop" :class="{'active': isDragging}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Dragable',
  props: {
    dataSource: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      files: [],
      isDragging: false
    }
  },
  methods: {
    dragenter(e) {
      this.isDragging = true
      e.preventDefault()
    },
    dragover(e) {
      this.isDragging = true
      e.preventDefault()
    },
    dragleave(e) {
      this.isDragging = false
      e.preventDefault()
    },
    drop(e) {
      e.stopPropagation()
      e.preventDefault()
      this.isDragging = false
      if (this.dataSource) {
        const data = e.dataTransfer.getData(this.dataSource)
        this.$emit('change', e.dataTransfer, data)
      } else {
        this.$emit('change', e.dataTransfer)
      }
      e.dataTransfer.clearData()
    },
  }
}
</script>
