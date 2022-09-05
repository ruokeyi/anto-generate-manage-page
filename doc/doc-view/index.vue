<template>
  <div class="demo-container">
    <div class="sidebar">
      <div
        class="item"
        :class="{
          active: key === currentKey,
        }"
        v-for="key in Object.keys(store)"
        @click="currentKey = key"
        :key="key"
      >
        {{ store[key].markdown.params["name"] || key }}
      </div>
    </div>
    <div class="component-view">
      <h2>Demo</h2>
      <div class="demo-wrap">
        <component :is="currentDemo"></component>
      </div>
      <h2>文档</h2>
      <div
        class="markdown-body"
        v-html="currentComponentInfo?.markdown?.html"
      ></div>
    </div>
  </div>
</template>

<script>
import "highlight.js/scss/default.scss";
import "highlight.js/styles/stackoverflow-light.css";
import Clipboard from "clipboard";

// webpack初始化缓存
// const cache = {}
// function importAll(r) {
//   r.keys().forEach(key => {
//     cache[key] = r(key)
//   })
// }
// importAll(require.context('@/components', true, /(\.md)|(\.vue)|(\.js)$/))

// vite 初始化缓存
const vueFiles = import.meta.globEager("../../src/components/**/*.vue");
const jsFiles = import.meta.globEager("../../src/components/**/*.js");
const mdFiles = import.meta.globEager("../../src/components/**/*.md");
const cache = {
  ...vueFiles,
  ...jsFiles,
  ...mdFiles,
};

const getComponent = (key) => {
  // 试图加载原组件
  let res = null;
  Object.keys(cache).forEach((path) => {
    if (path.indexOf(key + "/" + "index.") !== -1) {
      res = cache[path];
    }
  });
  return res;
};
const getDemoComponent = (key) => {
  // 试图加载Demo组件
  let res = null;
  Object.keys(cache).forEach((path) => {
    if (path.indexOf(key + "/" + "demo.") !== -1) {
      res = cache[path];
    }
  });
  return res;
};
let componentsMap = {};
Object.keys(cache).forEach((path) => {
  if (path.endsWith(".md")) {
    // 发现md，寻找demo.vue 以及index.vue
    const componentKey = path.split("/").slice(0, -1).pop();
    componentsMap[componentKey] = {};
    componentsMap[componentKey].markdown = cache[path].default || cache[path];
    componentsMap[componentKey].component = getComponent(componentKey);
    componentsMap[componentKey].demo = getDemoComponent(componentKey);
  }
});
const demoComponents = {};
Object.keys(componentsMap).forEach((key) => {
  demoComponents[key + "-" + "demo"] = componentsMap[key].demo.default;
  console.log(componentsMap);
});
export default {
  data() {
    return {
      currentKey: "",
      store: componentsMap,
    };
  },
  computed: {
    currentComponentInfo() {
      return this.store[this.currentKey];
    },
    currentDemo() {
      return this.currentKey + "-" + "demo";
    },
  },
  created() {
    this.currentKey = Object.keys(this.store)[0];
  },
  mounted() {
    this.clipboard = new Clipboard(".copy-btn");
    this.clipboard.on("success", () => {
      this.$message.success("复制成功");
    });
    this.clipboard.on("error", () => {
      this.$message.success("复制失败");
    });
  },
  unmounted() {
    this.clipboard.destroy();
  },
  components: demoComponents,
};
</script>

<style lang="scss">
@import url("./markdown.scss");
h2 {
  font-size: 20px;
  margin: 20px 0;
}

.demo-container {
  display: flex;
  height: 100%;
  font-size: 14px;
  .sidebar {
    width: 200px;
    padding: 20px;
    .item {
      line-height: 40px;
      cursor: pointer;
      &.active,
      &:hover {
        color: #3e8cd4;
      }
    }
  }
  .component-view {
    flex: 1;
    box-sizing: content-box;
    padding: 20px;
    width: 100%;
    overflow-y: scroll;
  }
}
.demo-wrap {
  border: 1px solid #eee;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 20px;
}
.markdown-body {
  margin-top: 10px;
  padding: 10px;
}
.markdown-body * {
  font-family: Consolas, Monaco, monospace !important;
}
.hljs-tag .hljs-attr {
  color: #999;
}
.copy-btn {
  position: absolute;
  right: 0;
  top: 0;
  color: #22609a;
  border: none;
  padding: 3px 10px;
  outline: none;
  cursor: pointer;
  border-radius: 2px;
}
b.name {
  position: relative;
  top: 10px;
  color: #3e8cd4;
}
</style>