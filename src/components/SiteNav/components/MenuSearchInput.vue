<template>
  <div style="position: relative;line-height: 1;">
    <el-input ref="input_search"
              style="border-radius: 0" class="home-search-input"
              clearable @input="handleSearch"
              @focus="showDDL"
              @blur="blur"
              @keydown.esc.native="cancelSearch"
              v-model="searchBar.value" placeholder="搜索系统内的页面"/>
    <div  class="search-dropdown">
      <ul class="search-advice-list">
        <template v-if="!searchBar.value||(searchResult||[]).length>0">
          <li
              v-for="log in searchResult" :key="log.id">
            <a :href="log.url" style="display: flex;flex: 1;height: 50px;align-items: center;">
              <div>
                {{ log.name }}
              </div>
            </a>
          </li>
        </template>
        <li v-else>
          没有找到相关内容...
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { sleep } from '@/utils/sleep';
import { computed, ref } from "vue";
import {toUniversalURL} from "@/config/menu-redirect";
export default {
name: "MenuSearchInput",
  props: {
  permissionNodes: { type: Array, required: true }
  },
  setup(props){
  const getFlattenNode = (node)=> {
    // 将权限数据转化成导航组件的数据
    const buildItem = (source, target) => {
      if (!source.children && !source.menu_item) return
      target.push(source)
      if (source.children) {
        source.children.forEach(item => {
          buildItem(item, target)
        })
      }
    }
    const menu = []
    buildItem(node, menu)
    return menu
  }
  const flattenNodes = computed(()=>{
    let result = []
    props.permissionNodes.forEach(node => {
      const tem = getFlattenNode(node)
      result = result.concat(tem)
    })
    return result
  })
    const searchResult = ref([])
    const handleSearch = (value) => {
    if(!value) {
      searchResult.value = []
      return
    }
      searchResult.value = []
      value = value.toUpperCase()
      flattenNodes.value.map(node => {
        if(node.menu_item && node.menu_item.title.indexOf(value)!==-1 && node.menu_item.url) {
          searchResult.value.push(
              { name: node.menu_item.title,
                url: toUniversalURL(node.menu_item.url),
                id: node.privilege.id })
        }
      })
    }
  return {
    flattenNodes: flattenNodes,
    searchResult: searchResult,
    handleSearch: handleSearch,
  }
  },
  methods: {
    async focusInput () {
      await sleep(200)
      this.$refs['input_search'].focus()
    },
    refocus () {
      this.no_blur = true
    },
    async blur () {
      await sleep(200)
      if (this.no_blur) {
        this.no_blur = false
        this.$refs['input_search'].focus()
        return
      }
      this.searchBar.focus = false
    },
    async showDDL () {
      // await sleep(200)
      this.searchBar.focus = true
    },
    async cancelSearch () {
      let ref = this.$refs['input_search']
      ref && ref.blur()
      await sleep(200)
      this.searchBar.value = ''
    },
  },
  data () {
    return {
      no_blur: false,
      searchBar: {
        focus: false,
        value: '',
        options: null,
      },
    }
  },
  computed: {
    isDDLVisible () {
      let ref = this.$refs['input_search']
      return this.searchBar.focus || (ref && ref.focused)
    },
  },
}
</script>

<style scoped>
.home-search-input input {
  border-radius: 0;
}
</style>
<style lang="scss" scoped="scoped">
a {
  color: #333;
}
.search-advice-list {
  background: #ffffff;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 500px;

  & > li {
    padding-left: 12px;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;

    a {
      font-size: 12px;
    }

    &:hover {
      background: aliceblue;
      color: #666666;
    }
  }
}
.search-dropdown {
  position: absolute;
  border: 1px solid silver;
  border-top: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
  z-index: 100;
}
</style>