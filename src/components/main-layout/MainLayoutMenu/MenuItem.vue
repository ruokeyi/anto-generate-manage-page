<template>
  <el-sub-menu
      :index="node.privilege.id" :key="node.privilege.id"
      v-if="node.nodeType==='menu'" class="LayoutSubMenu"
  >
    <template #header>{{ node.menu_item?.title }}</template>
    <menu-item
        v-for="item of (node?.children??[])" :key="item.privilege.id"
        :node="item"
        style="padding: 0 10px;"
    />
  </el-sub-menu>
  <el-menu-item
      :index="node.privilege.id" :key="node.privilege.id"
      v-else-if="node.nodeType==='page'" class="LayoutMenuItem"
  >
    <a
        style="
          vertical-align: baseline;
          color: inherit;
          line-height:48px;
          display:inline-block;"
        :href="toUniversalURL(node.menu_item?.url)">
      <div>
        {{ node.menu_item?.title }}
      </div>
    </a>
  </el-menu-item>
</template>

<script>
import {toUniversalURL} from '@/config/menu-redirect';

export default {
  name: 'MenuItem',
  props: {
    node: {type: Object, required: true},
  },
  methods: {
    toUniversalURL,
  },
};
</script>

<style scoped lang="stylus">
//.LayoutSubMenu::v-deep > {
//  .el-sub-menu__title {
//    padding: 0 10px
//    color #444444
//  }
//}

.LayoutSubMenu::v-deep(.el-sub-menu__title) {
  padding: 0 10px
  color #444444
}

.LayoutMenuItem {
  padding: 0 10px

  &.el-menu-item {
    color #444444

    &:hover {
      color var(--color-primary)
    }
  }
}


</style>
