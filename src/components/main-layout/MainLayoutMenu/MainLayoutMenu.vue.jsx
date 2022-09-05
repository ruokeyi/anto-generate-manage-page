import { defineComponent, h } from 'vue';
import MenuItem from '@/components/main-layout/MainLayoutMenu/MenuItem.vue';
let React = { createElement: h };
export default defineComponent({
    name: 'MainLayoutMenu',
    components: { MenuItem },
    props: {
        selected: Object,
        root: Object,
    },
    render() {
        function renderMenuItem(node) {
            const { nodeType } = node;
            switch (nodeType) {
                case 'menu':
                    return renderMenu(node);
                case 'page':
                    return renderPage(node);
            }
        }
        function renderMenu(node) {
            const { privilege, children } = node;
            const { id } = privilege;
            if (children) {
                return <el-sub-menu index={id}>
          {children.map(item => renderMenuItem(item))}
        </el-sub-menu>;
            }
        }
        function renderPage(node) {
            const { privilege, menu_item } = node;
            const { id } = privilege;
            const { title, url } = menu_item;
            return <el-menu-item key={id} index={id}>{title}</el-menu-item>;
        }
        console.log('render', this.root);
        return <el-menu mode="horizontal" defaultActive={this.selected?.privilege?.id}>
      {renderMenuItem(this.root)}
    </el-menu>;
    },
});
//# sourceMappingURL=MainLayoutMenu.vue.jsx.map