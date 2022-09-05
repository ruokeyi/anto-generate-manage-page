<template>
  <slot :name="match" v-if="$slots[match]"/>
  <slot v-else name="default"/>
</template>

<script>
export default {
  name: 'xnSwitch',
  props: {
    tagName: { type: String, default: 'div', required: false },
    match: { type: [String, Number], default: 'default', required: false },
  },
};
</script>
