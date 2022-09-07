<template>
  <div class="fr">
    <div style="width: 80%">
      <div class="nav-index fr"></div>
      <el-form
        class="form-wrapper fr-wrap"
        v-model="basicForm"
        size="small"
        label-position="left"
        max-label-width="120px"
      >
        <el-form-item v-for="item in basic" :key="item.key" :label="item.label">
          <el-input
            type="textarea"
            v-model="basicForm[item.key]"
            :rows="item.type === 'String' ? 1 : 3"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-radio-group v-model="isTable">
        <el-radio :label="true">表格</el-radio>
        <el-radio :label="false">卡片</el-radio>
      </el-radio-group>
      <el-form
        class="wrapper"
        v-model="configForm"
        size="small"
        label-position="left"
        label-width="80px"
      >
        <el-form-item>
          <template #label>
            <span style="margin: 20px 0 0 12px">筛选项</span>
          </template>
          <el-radio-group
            v-model="toolbarType"
            @change="$emit('foldMenu', { flag: toolbarType, type: 'toolbar' })"
          >
            <el-radio :label="2"
              >配置填写
              <el-tooltip
                :content="toolbarParamsDemo"
                placement="top"
                effect="light"
                ><el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </el-radio>
            <el-radio :label="1"
              >拖拽
              <small v-if="toolbarType === 1"
                >当前支持输入框、下拉框、时间范围，以及自定义组件</small
              >
            </el-radio>
          </el-radio-group>
          <el-input
            v-if="toolbarType === 2"
            type="textarea"
            v-model="toolbarConfString"
            rows="3"
          ></el-input>
          <dragable
            v-else
            class="drag-wrapper toolbar"
            dataSource="application/menuItem"
            @change="updateToolbar"
          >
            <div>
              <toolbar
                :confPaint="necessaryConfigForm.toolbarConf"
                @delete="deleteToolbarItem"
                @openRightPanel="
                  (data) => openRightPanelMethod(data, 'toolbar')
                "
              />
            </div>
          </dragable>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="margin: 20px 0 0 12px">功能区</span>
          </template>
          <el-radio-group
            v-model="funcType"
            @change="$emit('foldMenu', { flag: funcType, type: 'func' })"
          >
            <el-radio :label="2"
              >配置填写
              <el-tooltip
                :content="topOperationDemo"
                placement="top"
                effect="light"
                ><el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </el-radio>
            <el-radio :label="1">拖拽</el-radio>
          </el-radio-group>
          <el-input
            v-if="funcType === 2"
            type="textarea"
            v-model="topOperationString"
            rows="3"
          ></el-input>
          <dragable
            v-else
            class="drag-wrapper func"
            dataSource="application/menuItem"
            @change="updateFunc"
          >
            <funcbar
              :func="{ list: necessaryConfigForm.topOperation }"
              @openRightPanel="(data) => openRightPanelMethod(data, 'func')"
            />
          </dragable>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="margin: 20px 0 0 12px">默认对话框</span>
          </template>
          <div class="fc" style="width: 100%">
            <div>
              <label>基本参数</label>
              <el-descriptions :column="5" border direction="vertical">
                <el-descriptions-item label="对话框名称">
                  <el-input v-model="necessaryConfigForm.dialogConf.title" />
                </el-descriptions-item>
                <el-descriptions-item label="表单label宽度">
                  <el-input
                    v-model="necessaryConfigForm.dialogConf.labelWidth"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="对话框宽度">
                  <el-input
                    v-model="necessaryConfigForm.dialogConf.dialogWidth"
                    placeholder="请填写完整css width,如“680px”"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="表单记录对应的索引">
                  <el-input
                    v-model="necessaryConfigForm.dialogConf.idKey"
                    placeholder="默认为id"
                  />
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <el-radio-group
              v-model="dialogType"
              @change="$emit('foldMenu', { flag: dialogType, type: 'dialog' })"
            >
              <el-radio :label="2"
                >配置填写
                <el-tooltip
                  :content="dialogParamsDemo"
                  placement="top"
                  effect="light"
                  ><el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </el-radio>
              <el-radio :label="1"
                >拖拽
                <small v-if="dialogType === 1"
                  >当前支持输入框、下拉框、时间范围，以及自定义组件</small
                >
              </el-radio>
            </el-radio-group>
            <el-input
              v-if="dialogType === 2"
              type="textarea"
              v-model="dialogConfString"
              rows="3"
            ></el-input>
            <dragable
              v-else
              class="drag-wrapper toolbar"
              dataSource="application/menuItem"
              @change="updateDialog"
            >
              <div>
                <dialogbar
                  :confPaint="necessaryConfigForm.dialogConf"
                  @delete="deleteDialogbarItem"
                  @openRightPanel="
                    (data) => openRightPanelMethod(data, 'dialog')
                  "
                />
              </div>
            </dragable>
          </div>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="margin: 20px 0 0 12px">数据项</span>
          </template>
          <div class="fc" style="width: 100%">
            <div>
              <label>基本参数</label>
              <el-descriptions :column="5" border direction="vertical">
                <el-descriptions-item label="数据conf的名称">
                  <el-input
                    v-model="necessaryConfigForm.title"
                    placeholder="数据conf的名称，可以不加"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="记录id">
                  <el-input
                    v-model="necessaryConfigForm.idKey"
                    placeholder="对应记录的唯一索引名称，一般为id"
                  />
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <label>列项配置</label>
            <el-radio-group v-model="listType">
              <el-radio :label="2"
                >json填写
                <el-tooltip
                  :content="listItemParamsDemo"
                  placement="top"
                  effect="light"
                  ><el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </el-radio>
              <el-radio :label="1"
                >图形化配置
                <span v-if="listType === 1"
                  >列数<el-input-number v-model="tableCol"></el-input-number
                ></span>
              </el-radio>
            </el-radio-group>
            <el-input
              v-if="listType === 2"
              type="textarea"
              v-model="listItemsString"
              rows="5"
            ></el-input>
            <table-column
              v-else
              :tableColumn="{ cols: this.necessaryConfigForm.listItems }"
              @openRightPanel="
                (data) => openRightPanelMethod(data, 'dataTable')
              "
              @back="backListItem"
              @next="nextListItem"
              @delete="deleteListItem"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span style="margin: 0 0 0 12px">操作项</span>
          </template>
          <span class="fr-wrap">
            <span v-for="item in necessaryConfigForm.operation" :key="item.key">
              <el-icon
                v-if="item.type === 'icon'"
                :class="`el-icon-${item.key}`"
              />
              <el-button link v-if="item.type === 'text'" size="small">{{
                item.label
              }}</el-button>
              <el-button v-else size="small">{{ item.label }}</el-button>
            </span>
          </span>
          <el-icon @click="operationDialogShow = true" class="mgl20"
            ><Edit
          /></el-icon>
        </el-form-item>
      </el-form>
      <span class="mgt20 crm-txtc-primary">API相关</span>
      <div class="fr ac form-wrapper">
        接口基础路径填写
          <el-radio-group v-model="useApiPath" size="small">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
          <el-input
            size="small"
            v-if="useApiPath === 1"
            class="mg12"
            placeholder="接口基础路径"
            v-model="apiPath"
          />
          <small v-if="useApiPath === 1" class="crm-txtc-emphasis"
            >注意：若开启接口基础路径填写，api拼接规则为${接口基础路径}${获取列表API}</small
          >
          <small v-if="useApiPath === 2" class="crm-txtc-emphasis"
            >当前已关闭接口基础路径填写，以下api都必须填写完整bapi接口路径，如：/x/admin/crm-components/datatable/list</small
          >
        </div>
      <el-form
        class="fr-wrap form-wrapper"
        v-model="api"
        size="small"
        label-position="right"
        label-width="100px"
      >
        <el-form-item v-for="item in api" :key="item.key" :label="item.label">
          <el-input
            type="textarea"
            v-model="apiForm[item.key]"
            :rows="item.type === 'String' ? 1 : 3"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 20%; padding-left: 20px">
      <el-button-group size="small">
        <el-button @click="$emit('preView')">预览</el-button>
         <el-button @click="$emit('copyComponent')" type=""
          >复制组件</el-button
        >
        <el-button @click="$emit('exportCode')" type="primary"
          >导出代码</el-button
        >
      </el-button-group>
      <div
        style="
          border: 1px dashed #c0bdbd;
          border-radius: 12px;
          position: fixed;
          top: 172px;
        "
      >
        <span class="mg12 crm-txtc-primary">配置参数面板</span>
        <empty-state
          v-if="!currentParam"
          :width="'200px'"
          style="margin-top: 50%"
        />
        <filter-params
          v-else
          class="mg12"
          :params="currentParam"
          :area-type="currentAreaType"
          :item-type="currentItemType"
          @updateBaseParams="updateBaseParams"
        />
      </div>
    </div>
    <el-dialog
      v-model="operationDialogShow"
      width="80%"
      @close="handleOperationDialogShowClose"
    >
      <div>
        <el-table :data="pieceOpArr" size="small">
          <el-table-column prop="key" label="按钮key" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.key" @change="checkSelect">
                <el-option
                  v-for="k in operationKeyOptions"
                  :key="k"
                  :label="k"
                  :value="k"
                  :disabled="checkSelect(k)"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="label" label="按钮文字说明" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.label" />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="按钮类型" width="100">
            <template #default="scope">
              <el-select v-model="scope.row.type">
                <el-option label="图标" value="icon" />
                <el-option label="文字" value="text" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="auth_key" label="权限点" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.auth_key" />
            </template>
          </el-table-column>
          <el-table-column prop="auth_key" label="二次确认组件文案" width="180">
            <template #default="scope">
              <el-input
                v-model="scope.row.confirmText"
                placeholder="一般在删除操作时使用"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="format_params"
            label="参数处理函数"
            width="180"
          >
            <template #default="scope">
              <el-input
                type="textarea"
                v-model="scope.row.format_params"
                placeholder="一般在删除操作时使用"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <el-button @click="addOperation(index)">+</el-button>
            <el-button
              @click="deleteOperation(index)"
              v-if="pieceOpArr.length > 0"
              >-</el-button
            >
          </el-table-column>
        </el-table>
        <span class="footer">
          <el-button @click="confirmAdd" class="mgl20" type="primary"
            >确认</el-button
          >
          <el-button @click="handleOperationDialogShowClose">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  NECESSARY_CONFIG_PROPS,
  BASIC_PROPS,
  CONFIG_PROPS,
  API_PROPS,
  toolbarParamsDemo,
  listItemParamsDemo,
  dialogParamsDemo,
  topOperationDemo,
  operationKeyOptions,
} from "./data";
import { transObj, initParam } from "./util";
import FilterParams from "./params/filter-params.vue";
import Dragable from "@/components/Dragable.vue";
import Toolbar from "./components/toolbar.show-component.vue";
import Dialogbar from "./components/dialog.show-component.vue";
import Funcbar from "./components/func.show-components.vue";
import TableColumn from "./components/data-table.show-components.vue";
import CodeMirror from "./components/codemirror-input.vue";
import EmptyState from "@/components/EmptyState.vue";

import { ref } from "vue";
import { cloneDeep } from "lodash-es";
const toolbarItem = {
  type: "",
  label: "",
  key: "",
  width: "auto",
  value: "",
  placeholder: "",
  multiple: false,
  inRender: null,
  outRender: null,
  options: [],
};
const dialogItem = {
  type: "",
  label: "",
  key: "",
  width: "auto",
  maxlength: "",
  showwordlimit: true,
  value: "",
  placeholder: "",
  multiple: false,
  render: null,
  componentRender: null,
  options: [],
  html: null,
  disableDate: null,
};
const tp = {
  key: "createItem", //默认为新建
  label: "",
  button_type: "",
  auth_key: null,
  componentRender: null,
  init: null,
};
const itemTemplate = {
  type: "text",
  label: "这是一个demo列",
  key: "name",
  width: "200px",
  render: null,
};
export default {
  emits: [
    "updateConfigForm",
    "updateIsTable",
    "updateBasicForm",
    "updateNecessaryConfigForm",
    "openRightPanel",
    "foldMenu",
    "preView",
    "exportCode",
    "copyComponent",
    "updateApiForm",
  ],
  components: {
    Dragable,
    Toolbar,
    Funcbar,
    TableColumn,
    CodeMirror,
    Dialogbar,
    FilterParams,
    EmptyState,
  },
  props: {
    // configConf:{
    //   type:Object
    // }
  },
  setup() {
    const api = ref([]);
    const basic = ref([]);
    const config = ref([]);
    const necessary_config = ref([]);
    const apiForm = ref({});
    const tableCol = ref(1);
    const basicForm = ref({
      pageTitle: "",
      authPoint: "",
      exportAuthKey: "",
    });
    const configForm = ref({});
    const necessaryConfigForm = ref({});
    Object.keys(API_PROPS).map((p) => {
      if (API_PROPS[p].default) {
        apiForm.value[p] = API_PROPS[p].default;
      } else {
        apiForm.value[p] = initParam(API_PROPS[p].type);
      }
    });
    const isTable = ref(true);
    Object.keys(CONFIG_PROPS).map((p) => {
      if (CONFIG_PROPS[p].default) {
        configForm.value[p] = CONFIG_PROPS[p].default;
      } else {
        configForm.value[p] = initParam(CONFIG_PROPS[p].type);
      }
    });
    Object.keys(NECESSARY_CONFIG_PROPS).map((p) => {
      if (NECESSARY_CONFIG_PROPS[p].default) {
        necessaryConfigForm.value[p] = NECESSARY_CONFIG_PROPS[p].default;
      } else {
        necessaryConfigForm.value[p] = initParam(
          NECESSARY_CONFIG_PROPS[p].type
        );
      }
    });
    api.value = transObj(API_PROPS);
    basic.value = transObj(BASIC_PROPS);
    config.value = transObj(CONFIG_PROPS);
    necessary_config.value = transObj(NECESSARY_CONFIG_PROPS);
    //todo 初始化数据项
    if (necessaryConfigForm.value.listItems.length === 0) {
      necessaryConfigForm.value.listItems.push({ ...itemTemplate });
    }
    tableCol.value = necessaryConfigForm.value.listItems.length;
    const pieceOpArr = ref(necessaryConfigForm.value.operation);
    const toolbarConfString = ref(
      JSON.stringify(necessaryConfigForm.value.toolbarConf)
    );
    const topOperationString = ref(
      JSON.stringify(necessaryConfigForm.value.topOperation)
    );
    const listItemsString = ref(
      JSON.stringify(necessaryConfigForm.value.listItems)
    );
    const dialogConfString = ref(
      JSON.stringify(necessaryConfigForm.value.dialogConf.items)
    );
    const currentIndex = ref(0);
    const currentAreaType = ref("");
    const currentItemType = ref("");
    const currentParam = ref(null);
    const updateBaseParams = (p) => {
      currentParam.value = p;
      switch (currentAreaType.value) {
        case "toolbar":
          necessaryConfigForm.value.toolbarConf[currentIndex.value] = p;
          break;
        case "func":
          necessaryConfigForm.value.topOperation[currentIndex.value] = p;
          break;
        case "dataTable":
          necessaryConfigForm.value.listItems[currentIndex.value] = p;
          break;
        case "dialog":
          necessaryConfigForm.value.dialogConf.items[currentIndex.value] = p;
          break;
      }
    };
    const openRightPanelMethod = (obj, area_type) => {
      currentIndex.value = obj.index;
      currentParam.value = obj.item;
      currentAreaType.value = area_type;
      currentItemType.value = obj.eleType;
    };
    return {
      currentIndex,
      currentAreaType,
      currentItemType,
      currentParam,
      openRightPanelMethod,
      toolbarConfString,
      topOperationString,
      listItemsString,
      dialogConfString,
      updateBaseParams,
      api,
      basic,
      config,
      necessary_config,
      apiForm,
      basicForm,
      configForm,
      necessaryConfigForm,
      isTable,
      toolbarType: ref(2),
      dialogType: ref(2),
      funcType: ref(2),
      listType: ref(2),
      tableDialogShow: ref(false),
      operationDialogShow: ref(false),
      tableItem: ref({ 0: "" }),
      toolbarParamsDemo,
      dialogParamsDemo,
      listItemParamsDemo,
      topOperationDemo,
      operationKeyOptions,
      pieceOpArr,
      tableCol,
      apiPath: ref(""),
      useApiPath: ref(2),
    };
  },
  watch: {
    tableCol(nv, ov) {
      if (nv > ov) {
        for (let i = 0; i < nv; i++) {
          if (!this.necessaryConfigForm.listItems[i]) {
            this.necessaryConfigForm.listItems[i] = { ...itemTemplate };
          }
        }
      } else {
        this.necessaryConfigForm.listItems =
          this.necessaryConfigForm.listItems.slice(0, nv);
      }
    },
    configForm: {
      handler(nv, ov) {
        this.$emit("updateConfigForm", nv);
      },
      deep: true,
    },
    apiForm: {
      handler(nv, ov) {
        let pp = nv;
        if (this.useApiPath === 1) {
          pp = {
            ...pp,
            getListApi: `${this.apiPath}${pp.getListApi}`,
            createApi: `${this.apiPath}${pp.createApi}`,
            viewApi: `${this.apiPath}${pp.viewApi}`,
            updateApi: `${this.apiPath}${pp.updateApi}`,
            deleteApi: `${this.apiPath}${pp.deleteApi}`,
            exportListApi: `${this.apiPath}${pp.exportListApi}`,
            importListApi: `${this.apiPath}${pp.importListApi}`,
          };
        }
        this.$emit("updateApiForm", pp);
      },
      deep: true,
    },
    isTable(nv) {
      this.$emit("updateIsTable", nv);
    },
    basicForm: {
      handler(nv, ov) {
        this.$emit("updateBasicForm", nv);
      },
      deep: true,
    },
    toolbarConfString(nv, ov) {
      try {
        this.necessaryConfigForm.toolbarConf = JSON.parse(nv);
      } catch (e) {
        console.log(e);
      }
    },
    topOperationString(nv, ov) {
      try {
        this.necessaryConfigForm.topOperation = JSON.parse(nv);
      } catch (e) {
        console.log(e);
      }
    },
    listItemsString(nv, ov) {
      try {
        this.necessaryConfigForm.listItems = JSON.parse(nv);
      } catch (e) {
        console.log(e);
      }
    },
    dialogConfString(nv, ov) {
      try {
        this.necessaryConfigForm.dialogConf.items = JSON.parse(nv);
      } catch (e) {
        console.log(e);
      }
    },
    necessaryConfigForm: {
      handler(nv, ov) {
        this.toolbarConfString = JSON.stringify(nv.toolbarConf);
        this.topOperationString = JSON.stringify(nv.topOperation);
        this.listItemsString = JSON.stringify(nv.listItems);
        this.dialogConfString = JSON.stringify(nv.dialogConf.items);
        this.$emit("updateNecessaryConfigForm", nv);
      },
      deep: true,
    },
  },
  methods: {
    checkSelect(e) {
      let flag = false;
      this.pieceOpArr.map((p) => {
        if (p.key === e) {
          flag = true;
        }
      });
      return flag;
    },
    addOperation(index) {
      this.pieceOpArr.splice(index + 1, 0, {
        key: "",
        label: "",
        type: "icon",
        confirmText: null,
        format_params: null,
        auth_key: null,
      });
    },
    deleteOperation(index) {
      this.pieceOpArr.splice(index, 1);
    },
    handleOperationDialogShowClose() {
      this.operationDialogShow = false;
    },
    confirmAdd() {
      this.necessaryConfigForm.operation = this.pieceOpArr;
      this.handleOperationDialogShowClose();
    },
    updateToolbar(e, data) {
      const json_data = JSON.parse(data);
      if (["input", "select", "datetimerange"].indexOf(json_data.key) === -1) {
        this.$message.warning(
          "不符合填入类型要求，当前支持输入框、下拉框、时间范围，以及自定义组件"
        );
        return;
      }
      const temp = cloneDeep(toolbarItem);
      this.necessaryConfigForm.toolbarConf.push({
        ...temp,
        key: `${json_data.key}${
          this.necessaryConfigForm.toolbarConf.length + 1
        }`,
        type: json_data.key,
        label: `${json_data.name}${
          this.necessaryConfigForm.toolbarConf.length + 1
        }`,
      });
    },
    updateDialog(e, data) {
      const json_data = JSON.parse(data);
      if (["pager", "button", "datetimerange"].indexOf(json_data.key) != -1) {
        this.$message.warning(
          "不符合填入类型要求，当前不支持按钮、分页、日期时间范围，可以拖入自定义组件已实现对应功能"
        );
        return;
      }
      const temp = cloneDeep(dialogItem);
      this.necessaryConfigForm.dialogConf.items.push({
        ...temp,
        key: `${json_data.key}${
          this.necessaryConfigForm.dialogConf.items.length + 1
        }`,
        type: json_data.key,
        label: `${json_data.name}${
          this.necessaryConfigForm.dialogConf.items.length + 1
        }`,
      });
    },
    deleteToolbarItem(index) {
      this.necessaryConfigForm.toolbarConf.splice(index, 1);
    },
    deleteDialogbarItem(index) {
      this.necessaryConfigForm.dialogConf.items.splice(index, 1);
    },
    updateFunc(e, data) {
      const json_data = JSON.parse(data);
      if (["button"].indexOf(json_data.key) === -1) {
        this.$message.warning("不符合填入类型要求，当前仅支持按钮类型");
        return;
      }
      this.necessaryConfigForm.topOperation.push({
        ...tp,
        label: `${json_data.name}${
          this.necessaryConfigForm.topOperation.length + 1
        }`,
      });
    },
    updateTableColumn(cols) {
      this.necessaryConfigForm.listItems = cols;
    },
    backListItem(index) {
      const true_index = index - 1;
      if (true_index === 0) {
        return;
      }
      [
        this.necessaryConfigForm.listItems[true_index - 1],
        this.necessaryConfigForm.listItems[true_index],
      ] = [
        this.necessaryConfigForm.listItems[true_index],
        this.necessaryConfigForm.listItems[true_index - 1],
      ];
    },
    nextListItem(index) {
      const true_index = index - 1;
      if (true_index === this.necessaryConfigForm.listItems.length - 1) {
        return;
      }
      [
        this.necessaryConfigForm.listItems[true_index],
        this.necessaryConfigForm.listItems[true_index + 1],
      ] = [
        this.necessaryConfigForm.listItems[true_index + 1],
        this.necessaryConfigForm.listItems[true_index],
      ];
    },
    deleteListItem(index) {
      const true_index = index - 1;
      this.necessaryConfigForm.listItems.splice(true_index, 1);
      this.tableCol = this.necessaryConfigForm.listItems.length;
    },
    handleClose() {
      this.tableDialogShow = false;
    },
  },
};
</script>
<style lang="less" scoped>
.nav-index {
  .index {
    background: #c0bdbd;
    border-bottom-right-radius: 12px;
    border-end-start-radius: 12px;
    color: black;
  }
  background: var(--color-primary-70);
  color: white;
}
.wrapper {
  border: 1px dashed #c0bdbd;
  border-radius: 12px;
}
.form-wrapper {
  width: 100%;
  border: 1px dashed #c0bdbd;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  padding: 12px;
  &.active {
    border: 1px dashed #00a1d6;
    overflow: hidden;
    position: relative;
  }
}
.fr-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
.footer {
  padding: 12px;
  display: flex;
  flex-direction: row-reverse;
}
</style>