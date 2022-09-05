<template>
  <a-sub-menu
      v-if="node.nodeType==='menu'" :key="node.privilege.id"
      class="menu-item xn-menu-item-renderer"
  >
    <template #header>
      {{ node.menu_item.title }}
    </template>
    <MenuItemRenderer
        :node="item"
        v-for="item of node.children" :key="item.privilege.id"/>
  </a-sub-menu>
  <a-menu-item v-else-if="node.nodeType==='page'" :key="node.privilege.id"
               class="menu-item xn-menu-item-renderer">
    <a style="display: flex;align-items: center;" :href="toUniversalURL(node.menu_item.url)">
      <span style="padding-top: 2px;">{{ node.menu_item.title }}</span>
    </a>
  </a-menu-item>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {toUniversalURL} from '@/config/menu-redirect';

export default defineComponent({
  name: 'MenuItemRenderer',
  props: {
    node: Object,
  },
  setup(props) {
    return {
      toUniversalURL,
    };
  },
});
</script>

<style scoped lang="stylus">
.menu-item {
  padding: 0;
  margin-left: 10px !important;
}

.menu-item > ::v-deep( .ant-menu-submenu-title ) {
  padding: 0 !important;
}

.menu-item.ant-menu-submenu-open > ::v-deep( .ant-menu-submenu-title ) {
  color: #448af4 !important;
}

</style>

