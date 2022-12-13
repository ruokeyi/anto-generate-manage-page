<template>
  <div v-if="calcHasPermission" class="MainLayout">
    <el-dialog
      title="预览图片"
      width="calc(60vmin + 40px)"
      :model-value="!!preview.url"
      @update:model-value="preview.url = $event"
      append-to-body
      v-if="preview.url"
      @close="preview.url = ''"
    >
      <div>
        <el-carousel
          height="60vmin"
          :autoplay="false"
          :initial-index="preview.urls.indexOf(preview.url)"
        >
          <el-carousel-item
            v-for="item of preview.urls ?? [preview.url]"
            :key="item"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 60vmin;
                height: 60vmin;
                background: #00000044;
              "
            >
              <el-image
                :src="item"
                fit="scale-down"
                style="width: 60vm; height: 60vm"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <!--header-->
    <header class="Header">
      <button
        class="HeaderToolButton Logo"
        @click="drawerMenuVisible = !drawerMenuVisible"
        style="position: relative"
      >
        <AppstoreOutlined />
        <span
          v-if="!isMac"
          style="
            position: absolute;
            font-size: 10px;
            width: 60px;
            bottom: -4px;
            margin-left: 2px;
            transform: scale(0.8);
          "
        >
          (alt+'~')
        </span>
      </button>
      <router-link to="/">
        <div class="LogoText">基于element plus的数据表格生成器</div>
      </router-link>
      <div
        v-if="breadcrumb"
        style="display: flex; flex: 1; align-items: center; min-width: 980px"
      >
        <div v-if="breadcrumb.length > 0" class="separator-line"></div>
        <div style="display: flex">
          <div
            class="NavItem"
            v-for="(item, index) of breadcrumb"
            :key="item.title || item"
            style="
              font-size: 14px;
              cursor: default;
              flex-shrink: 0;
              color: var(--color-neutral-30);
            "
          >
            <router-link v-if="item.path" :to="item.path">{{
              item.title
            }}</router-link>
            <span v-else>{{ item.title || item }}</span>
            <i
              v-if="index < breadcrumb.length - 1 || menuRootAside?.children"
              class="el-icon-arrow-right RightArrow"
            />
          </div>
        </div>
        <div v-if="menuRootAside?.children?.length > 0" class="MenuOuter">
          <main-layout-menu :selected="currentNode" :root="menuRootAside" />
          <div
            v-if="$slots['nav-append']"
            style="display: flex; align-items: center"
          >
            <i
              class="el-icon-arrow-right RightArrow"
              style="margin-right: 20px"
            />
            <slot name="nav-append"></slot>
          </div>
        </div>
      </div>
      <slot v-else-if="$slots['nav']" name="nav" />

      <div
        style="display: flex; justify-content: flex-end; align-items: center"
      >
        <a
          target="_blank"
          :href="helpLink"
          v-if="helpLink"
          class="HeaderToolButton"
          style="font-size: 12px; width: 70px; margin-right: 20px"
        >
          使用手册
        </a>
        <el-popover
          v-else-if="$slots.help"
          title="帮助"
          placement="bottom"
          width="800"
        >
          <slot name="help"></slot>
          <template #reference>
            <div class="HeaderToolButton">?</div>
          </template>
        </el-popover>
        <div
          v-if="hasGuild"
          class="HeaderToolButton"
          style="margin-right: 20px"
        >
          <el-button @click="$emit('guild')" size="small" link
            >功能引导</el-button
          >
        </div>
        <a-popconfirm title="要登出吗？" placement="topRight" @confirm="logout">
          <div class="UserAvatar">
            {{
              (userdata.username[0] || '').toUpperCase() +
              (userdata.username || '').slice(1, 2)
            }}
          </div>
        </a-popconfirm>
      </div>
    </header>
    <!--main-->
    <div class="Main">
      <div class="Main__header" style="z-index: 1">
        <slot name="header" />
      </div>
      <div
        class="Main__content"
        :style="{
          flex: '1',
          overflowY: 'scroll'
        }"
      >
        <slot name="content" />
        <el-backtop target=".Main__content" />
      </div>
      <div
        class="footer"
        style="flex-shrink: 0; display: flex; width: 100vw; align-items: center"
        v-if="$slots['footer']"
      >
        <div style="flex: 1; padding-left: 8px">
          {{ progressBarSignal > 0 ? '加载中，请稍候...' : '' }}
        </div>
        <slot name="footer" />
      </div>
    </div>
    <!--drawer-->
    <!-- <a-drawer
      id="side-drawer"
      placement="left"
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      :maskStyle="{ background: 'transparent' }"
      :width="240"
      v-model:visible="drawerMenuVisible"
    >
      <template v-if="menuRoot">
        <site-nav
          @visbilityControl="drawerMenuVisible = false"
          :visibilty="drawerMenuVisible"
          :menus="menuRoot.children"
          :permission-node-def-group="menuRoot.children"
        />
      </template>
    </a-drawer> -->
  </div>
  <div v-else class="no-permission">
    抱歉，您没有此页面的权限 <br />
    <router-link to="/">去首页</router-link>
  </div>
</template>

<script lang="ts">
import { AppstoreOutlined, RightOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import MenuItemRenderer from './MenuItemRenderer.vue'
import { useAuthData } from '@/app/services/auth/auth.provider'
import { sleep } from '@/utils/sleep'
import SiteNav from '@/components/SiteNav/index.vue'
import router from '@/router'
import { progressBarSignal } from '@/app/services/progress-bar'
import { preview } from '@/app/services/preview'
import MainLayoutMenu from '@/components/main-layout/MainLayoutMenu/MainLayoutMenu.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    MainLayoutMenu,
    SiteNav,
    MenuItemRenderer,
    RightOutlined,
    AppstoreOutlined
  },
  props: {
    breadcrumb: Array,
    authPoint: [Number, String],
    helpLink: { type: String, default: null, required: false },
    hasGuild: { type: Boolean, default: false },
    /**
     * 当一个页面，没有建立页面权限点的时候，请建立按钮权限点，并手动传入权限点进行页面展示
     * 如，舆情库详情页，没有侧边入口，所以不会被自动被权限管控。所以需要建立一个按钮权限，并传入permissionPoint到MainLayout进行权限控制
     * <MainLayout permissionPoint="xxxDetail"
     */
    permissionPoint: {
      type: String,
      default: undefined
    },
    hasPermission: {
      default: undefined
    }
  },
  computed: {
    calcHasPermission() {
      // props中 hasPermission优先级 > permissionPoint
      const self = this as any
      if (self.hasPermission !== undefined) return self.hasPermission
      if (self.permissionPoint) return self.$hasPermission(self.permissionPoint)
      return true
    }
  },
  setup(props) {
    const authData = useAuthData()
    const root = computed(() => authData.permissions_root)

    onMounted(async () => {
      await sleep(2000)
    })

    return {
      preview,
      root,
      progressBarSignal: progressBarSignal,
      isMac: navigator.platform.toLowerCase().includes('mac'),
      userdata: useAuthData(),
      menuRootAside: computed(() => {
        return authData.permissions.find(
          (x) => x.privilege.id === props.authPoint
        )
      }),
      menuRoot: computed(() => {
        return root?.value?.children?.find((x) => x.privilege.id === '1')
      }),
      currentNode: computed(() => {
        const path = router.currentRoute.value.path
        const nodes = Object.values(authData.permissions_full)
        return nodes.find((x) => x.menu_item?.url === path)
      }),
      breadcrumbItems: computed(() => {
        const list = ([] as any[]).concat(props.breadcrumb)
        return list.map((item) => {
          const { title, to } = item
          if (to) {
            return {
              breadcrumbName: title,
              path: to
            }
          } else {
            return { breadcrumbName: title || item }
          }
        })
      }),
      drawerMenuVisible: ref(false),
      logout() {
        location.href = 'https://www.baidu.com'
      }
    }
  },
  mounted() {
    document.onkeydown = (event: any) => {
      let tagName = event.target?.tagName?.toLowerCase()
      if (!tagName) return
      if (['input', 'textarea'].includes(tagName)) return
      let isBackQuote =
        event.code.toLowerCase() === 'Backquote' ||
        event.keyCode === 192 ||
        event.key === '~' ||
        event.key === '`'
      if (event.altKey && isBackQuote) {
        this.drawerMenuVisible = !this.drawerMenuVisible
      }
    }
  },
  data() {
    return {}
  }
})
</script>

<style lang="stylus">
.MainLayout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  overflow-x: hidden;
}

.Header {
  background: #fff;
  z-index: 10;
  height: 48px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100vw;
  min-width: 1024px;
  border-bottom: 1px solid var(--theme-lighter);
  padding: 0 30px;
  overflow-x: hidden;

  .ant-menu-horizontal > .ant-menu-item::after, .ant-menu-horizontal > .ant-menu-submenu::after {
    content: none;
  }

  .ant-menu-horizontal > .ant-menu-item > a {
    // height :48px
    // line-height :48px
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    color: #448AF4;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid #448AF4;
  }
}

.footer {
  background: #ffffff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  z-index: 99;
}

.Main {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100vh - 48px);
  overflow-y: auto;
  overflow-x: hidden;
}

.Menu {
  width: 140px;
  flex-shrink: 0;
  height: calc(100vh - 48px);
  overflow-y: auto;
  background: var(--theme-color--crm-darken1);

  &::-webkit-scrollbar {
    /* 滚动条整体样式 */
    width: 5px; /* 高宽分别对应横竖滚动条的尺寸 */
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    /* 滚动条里面小方块 */
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0B3766;
  }

  &::-webkit-scrollbar-track {
    /* 滚动条里面轨道 */
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: lighten(#0B3766, 90);
  }
}

.HeaderToolButton {
  font-size: 24px;
  line-height: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;

  &:hover {
    color: #448AF4;
  }

  &:active {
    border: 0;
  }
}

.LogoText {
  align-items: center;
  font-weight: 600;
  font-family: SegoeUI-SemiBold-final, Segoe UI Semibold, SegoeUI-Regular-final, Segoe UI, 'Segoe UI Web (West European)', Segoe, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Tahoma, Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  color: #448AF4;
  user-select: none;
  margin-left: 8px;
}

.UserAvatar {
  border-radius: 20px;
  width: 40px;
  height: 40px;
  margin: 4px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 3px solid steelblue;
  background: lighten(steelblue, 40);
  cursor: pointer;
  user-select: none;
}

#side-drawer{
  margin-top:48px;
}

#side-drawer .ant-drawer-content{
  overflow:visible!important;
  position:static!important;
}
#side-drawer .ant-drawer-wrapper-body{
  overflow:visible!important
}
#side-drawer .ant-drawer-content-wrapper{
  box-shadow:4px 0 8px -8px rgba(0,0,0,0.8);
}

::v-deep(.el-breadcrumb__inner), ::v-deep(.el-breadcrumb__separator) {
  font-family: SegoeUI-SemiBold-final, Segoe UI Semibold, SegoeUI-Regular-final, Segoe UI, 'Segoe UI Web (West European)', Segoe, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Tahoma, Helvetica, Arial, sans-serif;
  color: white !important;
  font-size: 16px !important;
  height: 26px;
  display: flex;
  align-items: center;
}

.separator-line {
  height: 25px;
  width: 2px;
  background: rgba(0, 0, 0, 0.7);
  margin: 0 12px;
  flex-shrink: 0;
}

.Main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.NavItem {
  font-size: 16px;

  .RightArrow {
  }
}

.MenuOuter {
  flex: 1;
  display: flex;
  align-items: center;
}

.no-permission {
  font-size: 30px;
  text-align: center;
  padding-top: 100px;
  line-height: 100px;
}
</style>
