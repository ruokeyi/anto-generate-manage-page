<template>
  <el-tooltip content="点我复制" placement="top-start">
    <span @click.stop ref="span">
        <slot></slot>
    </span>
  </el-tooltip>

</template>

<script>
import ClipboardJS from 'clipboard'

export default {
  name: 'CopyWord',
  mounted() {
    const dom = this.$refs['span']
    this.clipboard = new ClipboardJS(dom, {
      target: () => {
        this.$message.success('复制成功')
        return dom
      }
    })
  },
  unmounted() {
    this.clipboard.destroy()
  }
}
</script>
