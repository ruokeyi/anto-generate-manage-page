<!--可折叠面板-->
<template>
  <div>
<!--    <operations :code-content="content"/>-->
    <collapsible-panel class="operate-panel" @switch="handlePanelSwitch">
      <template #fixed>
        <el-form :inline="true" size="small" label-width="90px" :model="form">
          <div class="operate-panel-row">
            <el-form-item label="姓名">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="form.sex"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </template>
      <template #canFold>
        <el-form :inline="true" size="small" label-width="90px" :model="form">
          <div class="operate-panel-row">
            <el-form-item label="住址">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="form.iphone"></el-input>
            </el-form-item>
            <el-form-item label="国家">
              <el-input v-model="form.country"></el-input>
            </el-form-item>
          </div>
          <div class="operate-panel-row">
            <el-form-item label="职业">
              <el-input v-model="form.job"></el-input>
            </el-form-item>
            <el-form-item label="附加">
              <el-input v-model="form.expand"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </template>
      <template #operators>
        <el-button
            @click="doSomething"
            size="small"
            type="primary"
            icon="el-icon-search"
        >
          按钮1
        </el-button>
        <el-button
            size="small"
            icon="el-icon-refresh-right"
        >
          按钮2
        </el-button>
        <el-button
            size="small"
            type="primary"
            icon="el-icon-download"
        >
          按钮3
        </el-button>
        <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
        >
          按钮4
        </el-button>
      </template>
    </collapsible-panel>
    <div class="main-list-content"/>
  </div>
</template>

<script>
import CollapsiblePanel from "./index.vue";

export default {
  setup() {
    const readDemoCode = ()=>{
      let modules = [];
      const modulesFiles = import.meta.globEager('./*.vue');
      for (const path in modulesFiles) {
        if(path.indexOf('demo')!==-1) {
          modules = [].concat(modules, modulesFiles[path].default);
        }
      }

      return modules
    }
    const content = readDemoCode()
    console.log(content)
    return {
      content: '',
      form: { name: '', age: '', sex: '', address: '', email: '', iphone: '18200xxxxxxx', job: '', country: '', expand: ''}
    };
  },
  components: {
    CollapsiblePanel,
  },
  methods: {
    handlePanelSwitch(folded) {
      this.panelFolded = folded;
    }
  },
};
</script>

<style lang="scss" scoped>
.main-list-content {
  height: 100%;
  position: relative;
}
</style>
