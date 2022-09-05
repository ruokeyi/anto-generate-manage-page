<template>
  <main-layout :breadcrumb="['配置页面']">
    <template #content>
      <div class="fr pd20 rc">
        <div class="menu">
          <Menu :fold="fold" />
        </div>
        <div class="mian-wrapper">
          <basic-props
            @updateConfigForm="updateConfigForm"
            @updateIsTable="updateIsTable"
            @updateNecessaryConfigForm="updateNecessaryConfigForm"
            @updateBasciParams="updateBasciParams"
            @updateApiForm="updateApiForm"
            @foldMenu="checkFoldMenu"
            @preView="preView"
            @exportCode="exportCode"
          />
        </div>
      </div>
    </template>
  </main-layout>
</template>
<script>
import Dragable from "@/components/Dragable.vue";
import Menu from "./Menu.vue";
import BasicProps from "./form.basic-props.vue";
import { ref } from "vue";
import axios from 'axios'
export default {
  components: { Dragable, Menu, BasicProps },
  setup() {
    const configs = ref({
      cardRowSpan: 2,
      toolbarRowSpan: 4,
      cardItemRowSpan: 4,
      dialogComponent: null,
      updateDialogomponent: null,
      tableComponent: null,
      itemComponent: null,
      listRender: {},
      detailPage: { flag: false, requestDetail: false },
    });
    const apis = ref({
      getListApi: "",
      createApi: "",
      viewApi: "",
      updateApi: "",
      deleteApi: "",
      exportListApi: null,
      exportFormat: "excel",
      importListApi: "",
      mockId: null,
      psKey: "page_size",
      pnKey: "page",
      pageSizes: [10, 20, 30, 50, 100],
    });
    const propObj = ref({
      authPoint: "",
      exportAuthKey: "",
      pageTitle: "",
      isTable: true,
      dialogConf: {
        title: "",
        labelWidth: "",
        dialogWidth: "",
        idKey: "",
        items: [],
        rules: {},
      },
      toolbarConf: [],
      listConf: { title: "", items: [], operation: [], topOperation: [] },
      ...configs.value,
      ...apis.value,
    });
    const updateIsTable = (isTable) => {
      propObj.value.isTable = isTable;
    };
    const updateConfigForm = (data) => {
      configs.value = data;
      propObj.value = { ...propObj.value, ...configs.value };
    };
    const updateBasciParams = (data) => {
      propObj.value.pageTitle = data.pageTitle;
      propObj.value.authPoint = data.authPoint;
      propObj.value.exportAuthKey = data.exportAuthKey;
    };
    const updateNecessaryConfigForm = (data) => {
      propObj.value.dialogConf = data.dialogConf;
      propObj.value.toolbarConf = data.toolbarConf;
      propObj.value.listConf.operation = data.operation;
      propObj.value.listConf.topOperation = data.topOperation;
      propObj.value.listConf.items = data.listItems;
    };
    const updateApiForm = (data) => {
      apis.value = data;
      propObj.value = { ...propObj.value, ...apis.value };
    };
    const fold = ref(true);
    const toolbarFold = ref(true);
    const funcFold = ref(true);
    const dialogFold = ref(true);
    const checkFoldMenu = ({ flag, type }) => {
      if (type === "toolbar") {
        toolbarFold.value = flag === 2;
      } else if (type === "func") {
        funcFold.value = flag === 2;
      } else if (type === "dialog") {
        dialogFold.value = flag === 2;
      }
      fold.value = toolbarFold.value && funcFold.value && dialogFold.value;
    };
    const toolbarList = ref([]);
    const funcList = ref([]);
    const table = ref([]);
    return {
      checkFoldMenu,
      toolbarList,
      funcList,
      table,
      propObj,
      updateBasciParams,
      updateConfigForm,
      updateNecessaryConfigForm,
      updateIsTable,
      updateApiForm,
      fold,
    };
  },
  computed: {
    menuWidth() {
      return this.fold ? "5%" : "15%";
    },
    mainWidth() {
      return this.fold ? "95%" : "85%";
    },
  },
  methods: {
    generateConfigFile() {
      console.log(this.propObj);
    },
    preView() {
      //在线预览页面
      this.generateConfigFile();
      this.$store.dispatch("previewTable", this.propObj);
      // let route = this.$router.resolve({ path: "/table-preview" });
      // window.open(route.href, "_target");
      this.$router.push({ path: "/table-preview" });
    },
    async exportCode() {
      // const configObj = {
      //   toolbarConf: this.propObj.toolbarConf,
      //   dialogConf: this.propObj.dialogConf,
      //   listConf: this.propObj.listConf,
      // };
      const configObj = this.propObj
      const _this = this
       axios
      .post("http://127.0.0.1:3000/table",{configObj},{
        headers:{
                'X-Requested-With': 'XMLHttpRequest',
                "Access-Control-Allow-Origin": "*"
            }
      })
      .then(function (response) {
       if(response.data.code===0){
          _this.$message.success("下载成功，请到桌面查看～");
       }else{
          _this.$message.danger("服务器错误，代码导出失败！");
       }
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .then(function () {
        // always executed
      })
    }
  },
};
</script>
<style lang="less" scoped>
.menu {
  width: v-bind(menuWidth);
  display: flex;
  flex-wrap: wrap;
  .menu-item {
    margin: 12px;
    padding: 4px;
    border: solid 1px #020304;
    cursor: pointer;
  }
}
.mian-wrapper {
  width: v-bind(mainWidth);
}
.drag-wrapper {
  width: 100%;
  border: 1px dashed #c0bdbd;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  &.toolbar {
    min-height: 100px;
  }
  &.func {
    min-height: 60px;
  }
  &.table {
    min-height: 400px;
  }
  &.active {
    border: 1px dashed #00a1d6;
    overflow: hidden;
    position: relative;
  }
}
</style>