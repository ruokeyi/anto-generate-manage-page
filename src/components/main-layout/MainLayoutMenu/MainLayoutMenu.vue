<template>
  <el-menu
      mode="horizontal" size="small"
      :default-active="selected?.privilege.id"
      v-if="root?.children?.length>0"
      active-text-color="#448af4"
      class="MainLayoutMenu"
  >
    <menu-item
        v-for="item of root.children" :key="item.privilege.id"
        :node="item"/>
  </el-menu>
</template>

<script lang="tsx">
import {defineComponent, h} from 'vue';
import {PermissionNodeDef} from '../../../app/services/auth/permission.entity';
import MenuItem from '@/components/main-layout/MainLayoutMenu/MenuItem.vue';

let React = {createElement: h};

export default defineComponent({
  name: 'MainLayoutMenu',
  components: {MenuItem},
  props: {
    selected: Object,
    root: Object,
  },
  render() {

    function renderMenuItem(node) {
      const {nodeType} = node;
      switch (nodeType) {
        case 'menu':
          return renderMenu(node);
        case 'page':
          return renderPage(node);
      }
    }

    function renderMenu(node) {
      const {privilege, children} = node as PermissionNodeDef;
      const {id} = privilege;
      if (children) {
        return <el-sub-menu index={id}>
          {children.map(item => renderMenuItem(item))}
        </el-sub-menu>;
      }
    }

    function renderPage(node) {
      const {privilege, menu_item} = node;
      const {id} = privilege;
      const {title, url} = menu_item;
      return <el-menu-item key={id} index={id}>{title}</el-menu-item>;
    }

    return <el-menu mode="horizontal" defaultActive={this.selected?.privilege?.id}>
      {renderMenuItem(this.root)}
    </el-menu>;
  },
});
</script>

<style scoped lang="stylus">

.MainLayoutMenu ::v-deep() {
  .el-menu-item, .el-sub-menu__title {
    height: 48px !important;
    line-height: 50px !important;
    color: #444444
  }
}

</style>
