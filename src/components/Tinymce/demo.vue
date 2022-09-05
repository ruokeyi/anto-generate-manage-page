<template>
    <Tinymce ref="editor" v-model="content" :height="400" />
</template>
<script>
import Tinymce from './index.vue'
import { ref } from 'vue'
export default {
  components:[Tinymce],
  setup() {
    const content = ref('')
    return {
      content
    }
  },
}
</script>