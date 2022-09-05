<template>
  <main-layout :auth-point="authPoint" :breadcrumb="[{ title: pageTitle }]">
    <template #header>
      <xxx-toolbar
        ref="xxxToolbar"
        :initP="toolbarParams"
        :confPaint="toolbarConfPaint"
        :rowSpan="toolbarRowSpan"
        :hasExport="!!exportListApi"
        :exportAuthKey="exportAuthKey"
        @reset="initList"
        @query="handleRefreshList"
        @export="handleExportList"
      />
    </template>

    <template #content>
      <empty-state v-if="listConf?.length === 0" />
      <div v-else>
        <Component
          :is="currentTableComponent"
          :tableData="listData"
          :tableConf="listConf"
          :itemComponent="itemComponent"
          :cardRowSpan="cardRowSpan"
          :cardItemRowSpan="cardItemRowSpan"
          @refreshList="handleRefreshList"
          @refreshListBySort="handleRefreshListBySort"
          @viewItem="handleViewItem"
          @deleteItem="handleDeleteItem"
          @editItem="openUpdateDialog"
          @createItem="openCreateItemDialog"
          @openDialog="handleOpenDialog"
          @importList="handleImportList"
          @exportList="handleExportList"
        />
      </div>
      <Component
        :is="currentDialogComponent"
        :read-only="readOnly"
        v-model:visible="createDialogVisible"
        :form-data="dialogParams"
        :conf-paint="dialogConfPaint"
        @submit="(v)=>{createAndUpdateItem(v,false)}"
        @update="(v)=>{createAndUpdateItem(v,true)}"
        @refresh="handleRefreshList"
      />
    </template>

    <template #footer>
      <m-pager
        v-model:page="pager.page"
        v-model:size="pager.page_size"
        :pageSizes="pageSizes"
        :total="pager.total"
        @change="handleRefreshList"
      />
    </template>
  </main-layout>
</template>
<script>
import {
  getCurrentInstance,
  reactive,
  ref,
  shallowRef,
} from "@vue/runtime-core";
import MPager from "@/components/MPager.vue";
import EmptyState from "@/components/EmptyState.vue";
import CrmList from "./components/list.vue";
import CrmTable from "./components/table.vue";
import XxxToolbar from "./components/toolbar.list.vue";
import CreateEditDialog from "./components/dialog.create-edit.vue";
import { getUrlQuery } from "@/utils/string";
import {
  createData,
  updateData,
  deleteData,
  getList,
  exportList,
  importList,
  viewData,
} from "./components/api";
import lodash from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  components: {
    MPager,
    EmptyState,
    CrmList,
    CrmTable,
    CreateEditDialog,
    XxxToolbar,
  },
  props: {
    authPoint: {
      type: String,
      required: true,
    },
    exportAuthKey: {
      type: String,
    },
    pageTitle: {
      type: String,
      required: true,
    },
    isTable: {
      type: Boolean,
      default: true,
    },
    dialogConf: {
      type: Object,
    },
    toolbarConf: {
      type: Array,
    },
    listConf: {
      type: Object,
    },
    cardRowSpan: {
      type: Number,
      default: 2,
    },
    toolbarRowSpan: {
      type: Number,
      default: 4,
    },
    cardItemRowSpan: {
      type: Number,
      default: 4,
    },
    dialogComponent: {
      type: Object,
      default: null,
    },
    updateDialogomponent: {
      type: Object,
      default: null,
    },
    tableComponent: {
      type: Object,
      default: null,
    },
    itemComponent: {
      type: Object,
      default: null,
    },
    listRender: {
      type: Object,
    },
    detailPage: {
      type: Object,
      default: { flag: false, requestDetail: false },
    },
    getListApi: {
      type: String,
    },
    createApi: {
      type: String,
    },
    viewApi: {
      type: String,
    },
    updateApi: {
      type: String,
    },
    deleteApi: {
      type: String,
    },
    exportListApi: {
      type: String,
      default:null
    },
    exportFormat: {
      type: String,
      default: "excel",
    },
    importListApi: {
      type: String,
    },
    mockId: {
      type: Number,
    },
    psKey: {
      type: String,
      default: "page_size",
    },
    pnKey: {
      type: String,
      default: "page",
    },
    pageSizes:{
      type:Array,
      default:[10,20,30,50,100]
    }
  },
  computed: {
    currentTableComponent() {
      if (this.tableComponent) {
        return this.tableComponent;
      }
      return this.isTable ? CrmTable : CrmList;
    },
  },
  watch: {
    createDialogVisible(nv) {
      if (nv) {
        let flag = false
        this.listConf.operation.map(op=>{
          if(op.key===this.curDialogKey&&op?.componentRender){
            this.currentDialogComponent = op.componentRender(this.dialogParams)
            flag = true
          }
        })
        this.listConf.topOperation.map(op=>{
          if(op.key===this.curDialogKey&&op?.componentRender){
            this.currentDialogComponent = op.componentRender(this.dialogParams)
            flag = true
          }
        })
        if(!flag){
           this.currentDialogComponent = this.isUpdate?
          this.updateDialogomponent??CreateEditDialog:this.dialogComponent ?? CreateEditDialog;
        }
      }else{
        this.readOnly = false
        this.isUpdate = false
        this.curDialogKey = ''
      }
    },
  },
  setup(props) {
    const currentDialogComponent = shallowRef(null);
    currentDialogComponent.value = props.dialogComponent || CreateEditDialog;
    const { proxy } = getCurrentInstance();
    let createDialogVisible = ref(false);
    let listData = ref([]);
    const pager = reactive({
      page: 1,
      page_size: 20,
      total: 0,
    });
    const sorter = reactive({
      sort: "ASC",
      order: "",
    });
    const readOnly = ref(false);
    const isUpdate = ref(false);
    const curDialogKey = ref('')
    if (props?.listConf?.sorter) {
      sorter.sort = props.listConf.sorter.sort;
      sorter.order = props.listConf.sorter.order;
    }
    const mock = props.mockId ? props.mockId : false;
    const dialogParams = ref(null);
    const dialogConfPaint = ref({});
    const toolbarParams = ref({});
    const toolbarConfPaint = ref({});
    const getDialogAndToolbarData = (dataArr) => {
      const conf = {};
      const params = {};
      dataArr.map((a) => {
        conf[a.key] = a;
        if (a.type === "datetimerange") {
          if (a.param) {
            params[a.param[0]] = null;
            params[a.param[1]] = null;
          } else {
            params["start_time"] = null;
            params["end_time"] = null;
          }
        } else {
          params[a.key] = a.inRender ? a.inRender(a.value) : a.value;
        }
      });
      return { conf, params };
    };
    let toolbar = getDialogAndToolbarData(props.toolbarConf);
    toolbarParams.value = toolbar.params;
    toolbarConfPaint.value = toolbar.conf;
    const getDialogParams = () => {
      if (props.dialogConf) {
        if (props.dialogComponent) {
          dialogParams.value = props.dialogConf;
        } else {
          const dialog = getDialogAndToolbarData(props.dialogConf.items);
          dialogParams.value = dialog.params;
          dialogConfPaint.value.items = dialog.conf;
          dialogConfPaint.value.dialogTitle = props.dialogConf?.title || null;
          dialogConfPaint.value.rules = props.dialogConf?.rules || [];
          dialogConfPaint.value.idKey =
            props.dialogConf?.idKey || "id";
          dialogConfPaint.value.labelWidth =
            props.dialogConf?.labelWidth || "120px";
          dialogConfPaint.value.dialogWidth =
            props.dialogConf?.dialogWidth || "580px";
        }
      }
    };
    getDialogParams();
    const handleOpenDialog = (key) => {
      curDialogKey.value = key
      if (key === "createItem") {
        openCreateItemDialog();
      } else {
        createDialogVisible.value = true;
      }
    };
    //打开创建弹框
    const openCreateItemDialog = () => {
      readOnly.value = false;
      isUpdate.value = false;
      getDialogParams();
      createDialogVisible.value = true;
    };
    //打开更新弹框
    const openUpdateDialog = (itemInfo) => {
      curDialogKey.value = 'edit'
      readOnly.value = false;
      isUpdate.value = true;
      if (!props.detailPage?.flag) {
        dialogParams.value = { ...itemInfo };
        createDialogVisible.value = true;
      } else {
        const cru_url = proxy.$router.fullPath;
        const queryParams = {};
        props.detailPage?.query.map((q) => {
          queryParams[q] = itemInfo[q];
        });
        let route = proxy.$router.resolve({
          path: `${cru_url}/detail`,
          query: queryParams,
        });
        window.open(route.href);
      }
    };
    //  新建或更新
    const createAndUpdateItem = async (info, is_update) => {
      let params = null;
      let method = undefined;
      if (info.method) {
        params = info.params;
        method = info.method;
      } else {
        params = info;
      }
      if (is_update) {    
        await updateData(params, props.updateApi, mock, method);
        ElMessage.success("更新成功");
        isUpdate.value = false
      } else {
        // create
        await createData(params, props.createApi, mock);
        ElMessage.success("新建成功");
      }
      createDialogVisible.value = false;
      proxy.$refs.xxxToolbar.clear();
      handleRefreshList(toolbarParams.value);
    };
    //  查看
    const handleViewItem = async (itemInfo) => {
      curDialogKey.value="view"
      readOnly.value = true;
      if (!props.detailPage?.flag) {
        if (props.detailPage?.requestDetail) {
          const params = { id: itemInfo[props.listConf?.idKey || "id"] };
          const data = await viewData(params, props.viewApi, mock);
          dialogParams.value = { ...data.group_message_info };
        } else {
          dialogParams.value = { ...itemInfo };
        }
        createDialogVisible.value = true;
      } else {
        const cru_url = proxy.$route.fullPath;
        const queryParams = {};
        props.detailPage?.query.map((q) => {
          queryParams[q] = itemInfo[q];
        });
        let route = proxy.$router.resolve({
          path: `${cru_url}/detail`,
          query: queryParams,
        });
        window.open(route.href);
      }
    };
    const transformParams = ({ params, sorter }) => {
      let req = null;
      if (params) {
        req = { ...params };
      } else {
        req = lodash.cloneDeep(toolbarParams.value);
      }
      const urlQuery = getUrlQuery();
      if (urlQuery) {
        req = { ...req, ...urlQuery };
      }
      const renders = Object.keys(props.toolbarConf);
      for (let i = 0; i < renders.length; i++) {
        if (typeof props.toolbarConf[renders[i]]?.outRender === "function") {
          const key = props.toolbarConf[renders[i]].key;
          req[key] = props.toolbarConf[renders[i]].outRender(req[key]);
        }
      }
      const curPager = {};
      curPager[props.psKey] = pager.page_size;
      curPager[props.pnKey] = pager.page;
      if (sorter) {
        return {
          ...req,
          ...sorter,
          ...curPager,
        };
      }
      if (props?.listConf?.sorter) {
        return {
          ...req,
          ...sorter,
          ...curPager,
        };
      }
      return {
        ...req,
        ...curPager,
      };
    };
    //  删除
    const handleDeleteItem = async (info) => {
      let text = '确定执行该操作吗？'
      let params = null
      props.listConf.operation.map(op=>{
        if(op.key==='delete'||op.key==='close'){
          if(op.confirmText){
            text=op.confirmText
          }
          if(op?.format_params){
            params = info
          }
        }
      })
      await ElMessageBox.confirm(text, "确定").then(
        async () => {
          const id = info[props?.listConf?.idKey || "id"];
          let req = {id}
          if(params){
            req = params
          }
          await deleteData(req, props.deleteApi, mock);
          ElMessage.success("操作成功");
          createDialogVisible.value = false;
          proxy.$refs.xxxToolbar.clear();
          handleRefreshList(toolbarParams.value);
        }
      );
    };
    const handleExportList = async (params) => {
      let p = transformParams({ params });
      if (props.exportListApi === props.getListApi) {
        p = { ...p, export: props.exportFormat };
      }
      await exportList(p, props.exportListApi, mock);
    };
    const handleImportList = async (params) => {
      // await exportList(transformParams(params),props.exportListApi, mock);
    };
    const handleRefreshListBySort = async (sorter) => {
      const params = transformParams({ sorter });
      const data = await getList(params, props.getListApi, mock);
      listData.value = data?.list ?? [];
      if (props.listRender) {
        listData.value = props.listRender.cb(listData.value);
      }
      pager.total = data?.total || 0;
    };
    // 查询列表
    const handleRefreshList = async (params) => {
      if (params) {
        toolbarParams.value = params;
      }
      let p = transformParams({ params });
      const data = await getList(p, props.getListApi, mock);
      const list = data?.list ?? [];
      listData.value = props.listRender ? props.listRender.cb(list) : list;
      pager.total = data?.total || 0;
    };
    // 初始化列表
    handleRefreshList(toolbarParams.value);
    const initList = () => {
      toolbar = getDialogAndToolbarData(props.toolbarConf);
      toolbarParams.value = toolbar.params;
      toolbarConfPaint.value = toolbar.conf;
      handleRefreshList(toolbarParams.value);
    };
    return {
      pager,
      readOnly,
      isUpdate,
      curDialogKey,
      createDialogVisible,
      currentDialogComponent,
      listData,
      dialogParams,
      dialogConfPaint,
      toolbarParams,
      toolbarConfPaint,
      openCreateItemDialog,
      createAndUpdateItem,
      handleViewItem,
      openUpdateDialog,
      handleOpenDialog,
      handleDeleteItem,
      handleRefreshList,
      handleRefreshListBySort,
      handleExportList,
      handleImportList,
      initList,
    };
  },
};
</script>

<style scoped>
</style>