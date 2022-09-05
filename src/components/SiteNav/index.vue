<template>
  <!--  <div>-->
  <!--    <div class="search-input-wrapper">-->
  <!--      <menu-search-input :permission-nodes="permissionNodeDefGroup"/>-->
  <!--    </div>-->
  <div class="left-side-bar">
    <!--     <div class="close-btn-wrapper" @click="closeDrawer">
      <div class="close-btn">
        <i class="el-icon-close" />
      </div>
    </div> -->
    <div class="site-nav-wrapper">
      <div class="left-menu-body">
        <ul
          style="margin-right: 2px"
          v-for="(item, index) in transMenuGroup.firstMenuGroup"
          :index="item.key"
        >
          <li
            ref="sideMenuGroup"
            class="default-li"
            :class="isActive(item.key) ? 'active' : 'in-active'"
            @mouseenter="handleSelect(item.key, index)"
            @click="toUrl(item.url)"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              {{ item.title }}
              <em v-if="!item.url" class="el-icon-arrow-right"></em>
            </div>
            <div
              v-if="visibilty && !item.url && isActive(item.key)"
              class="children-panel"
              ref="childrenPanel"
            >
              <div
                class="right-body"
                :style="{ padding: `${childNum === 0 ? 10 : 20}px` }"
              >
                <div
                  :style="{
                    columnCount: colCount
                  }"
                  class="right-menu-wrapper"
                >
                  <ul
                    v-for="item in curExpandMenuGroup"
                    :index="item.id"
                    class="ul-panel-item"
                  >
                    <li>
                      <span v-if="item.children?.length > 0" class="text-title"
                        >{{ item.name }}
                      </span>
                      <a
                        v-else
                        :href="toUniversalURL(item.url)"
                        class="link-title"
                        :class="childNum === 0 ? 'only-second' : ''"
                        >{{ item.name || '-' }}
                        <em class="el-icon-link"></em>
                      </a>
                    </li>
                    <ul v-if="item.children?.length > 0" class="children-group">
                      <li v-for="child in item.children" :index="child.id">
                        <a :href="toUniversalURL(child.url)" class="text-menu"
                          >{{ child.name || '-' }}
                        </a>
                      </li>
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, nextTick } from 'vue'
import { toUniversalURL } from '@/config/menu-redirect'
// import MenuSearchInput from './components/MenuSearchInput.vue';
export default {
  name: 'SiteNav',
  // components: { MenuSearchInput },
  props: {
    menus: { type: Array, default: () => [] },
    visibilty: { type: Boolean, default: false },
    permissionNodeDefGroup: { type: Array, default: () => [] }
  },
  emits: ['visbilityControl'],
  setup(props) {
    const { proxy } = getCurrentInstance()
    const authDataToNavConf = (data) => {
      // 将权限数据转化成导航组件的数据
      const buildItem = (source, target) => {
        if (!source.menu_item) return
        if (!source.children && !source.menu_item) return
        if ((!source.children || !source.menu_item) && !source?.menu_item?.url)
          return
        target.id = source.privilege.id
        if (source.menu_item && source.menu_item.url) {
          target.name = source.menu_item.title
          target.url = source.menu_item.url
        } else if (source.children) {
          target.name = source.privilege.title
          target.children = []
          target.open = false
          source.children.forEach((item) => {
            if (!item.menu_item) return
            if (!item.children && !item.menu_item?.url) return
            const newTarget = {
              path: [...(target.path || []), target.id]
            }
            target.children.push(newTarget)
            buildItem(item, newTarget)
          })
        }
      }
      const menu = {}
      buildItem(data, menu)
      return menu.children
    }
    const transMenuGroup = computed(() => {
      const firstMenuGroup = []
      const menuGroupMap = {}
      props.menus.map((permissionNodeDef) => {
        if (permissionNodeDef && permissionNodeDef.menu_item) {
          const item = permissionNodeDef.menu_item
          firstMenuGroup.push({
            key: item.privilege_id,
            title: item.title,
            url: item.url
          })
          if (
            permissionNodeDef.children &&
            permissionNodeDef.children.length > 0
          ) {
            menuGroupMap[item.privilege_id] =
              authDataToNavConf(permissionNodeDef)
          }
        }
      })
      return {
        firstMenuGroup: firstMenuGroup,
        menuGroupMap: menuGroupMap
      }
    })
    let curSelectMenuKey = ref('')
    let curExpandMenuGroup = ref([])

    const handleSelect = async (key, idx) => {
      const viewHeight =
        window.innerHeight || document.documentElement.clientHeight
      curSelectMenuKey.value = key
      curExpandMenuGroup.value =
        transMenuGroup.value.menuGroupMap[curSelectMenuKey.value]
      await nextTick()
      const liItem = proxy.$refs.sideMenuGroup[idx]
      let { top } = liItem.getBoundingClientRect()
      const liHeight = liItem.offsetHeight
      const navHeight = 48
      if (proxy.$refs.childrenPanel?.length) {
        const panel = proxy.$refs.childrenPanel[0]
        const elHeight = panel.offsetHeight
        if (
          top - elHeight > 0 &&
          top > viewHeight / 2 &&
          top + elHeight > viewHeight
        ) {
          // 1.当前面板头部不超过可视顶部
          // 2.且当前 item 位于可视偏底部区域，
          // 3.且面板底部超过了浏览器底部 => 将面板上置
          top = top - elHeight + liHeight / 2
        } else {
          if (top - elHeight / 2 > 0) {
            top = top - (elHeight - liHeight) / 2
          }
        }
        panel.style.top = `${top - navHeight}px`
      }
    }
    const isActive = (key) => {
      return key === curSelectMenuKey.value
    }
    return {
      isActive: isActive,
      handleSelect: handleSelect,
      transMenuGroup: transMenuGroup,
      curSelectMenuKey: curSelectMenuKey,
      curExpandMenuGroup: curExpandMenuGroup
    }
  },
  computed: {
    childNum() {
      let count = 0
      if (this.curExpandMenuGroup) {
        for (let item of this.curExpandMenuGroup) {
          item.children && count++
        }
      }
      return count
    },
    hasLongChildren() {
      if (this.curExpandMenuGroup) {
        return this.curExpandMenuGroup.some((item) => item.children?.length > 3)
      }
    },
    colCount() {
      if (this.childNum > 0) {
        // 不管多少子项，最多4列
        // 若只有少数子项，且各子项均较短，按照子项个数减1排列
        return this.hasLongChildren
          ? Math.min(this.childNum, 4)
          : Math.min(this.childNum - 1, 4)
      } else {
        return 1
      }
    }
  },
  watch: {
    visibilty(val) {
      if (!val) {
        this.curSelectMenuKey = null
      }
    }
  },
  methods: {
    toUniversalURL: toUniversalURL,
    toUrl(url) {
      if (url !== '') {
        const path = toUniversalURL(url)
        window.open(path, '_self')
      }
    }
  }
}
</script>

<style scoped lang="scss">
$ListSpacing: 48px;
.search-input-wrapper {
  padding: 12px;
}
.close-btn-wrapper {
  padding-left: 48px;
  cursor: pointer;
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  line-height: 24px;
  color: #448af4;
  background: #e2f3fe;
}
.site-nav-wrapper {
  display: flex;
  margin: 0 0px 6px 16px;
  padding: 4px;
  .left-menu-body {
    overflow-y: auto;
    width: 100%;
    padding-top: 10px;
    height: calc(100vh - $ListSpacing - 6px);

    .default-li {
      padding: 12px 18px;
      cursor: pointer;
      color: #000;
      border-radius: 8px;
      letter-spacing: 0.08em;
      &.active {
        color: #448af4;
        background: #e7f4ff;
      }
      .children-panel {
        position: absolute;
        left: 250px;
      }
    }
  }

  .right-body {
    background: #ffffff;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    border-radius: 6px;

    .right-menu-wrapper {
      column-gap: 40px;
      .only-second {
        display: block;
        width: 100%;
        letter-spacing: 0.1em;
        padding: 8px 12px;
        border-radius: 6px;
        color: #313131 !important;
        text-decoration: none !important;
        transition: none;
        &:hover {
          color: #448af4 !important;
          background-color: #e2f3fe;
        }
      }

      .text-title {
        cursor: auto;
        color: #448af4;
      }
      .link-title {
        text-decoration: underline;
        text-underline-offset: 4px;
        color: #448af4;
      }
      .text-menu {
        display: block;

        padding: 2px 12px;
        color: #4a4949;

        &:hover {
          color: #448af4;
          background-color: #e2f3fe;
        }

        > .is-hover::before {
          opacity: 0;
        }

        > .is-hover {
          opacity: 1;
        }
      }
    }
  }
  .ul-panel-item {
    break-inside: avoid;
    width: 200px;
  }
  .children-group {
    position: relative;
    margin: 0 0 4px;
    box-sizing: border-box;
    &:hover {
      &::before {
        background-color: #7faaec;
        height: 100%;
      }
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 2px;
      transition: all 0.3s ease-out;
    }
  }
}
</style>
