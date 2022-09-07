<template>
  <div>
    <el-form-item label="按钮emit事件">
      <el-select v-model="formData.key" style="width: 100%">
        <el-option label="刷新记录列表" value="refreshList" />
        <el-option label="查看记录" value="viewItem" />
        <el-option label="删除记录" value="deleteItem" />
        <el-option label="新建记录" value="createItem" />
        <el-option label="编辑记录" value="editItem" />
        <el-option label="打开对话框" value="openDialog" />
        <el-option label="列表导入" value="importList" />
        <el-option label="列表导出" value="exportList" />
      </el-select>
    </el-form-item>
    <el-form-item label="按钮名称">
      <el-input v-model="formData.label" />
    </el-form-item>
    <el-form-item label="按钮类型">
      <el-select v-model="formData.button_type" style="width: 100%">
        <el-option label="默认" value="''" />
        <el-option label="success" value="success" />
        <el-option label="primary" value="primary" />
        <el-option label="warning" value="warning" />
        <el-option label="info" value="info" />
        <el-option label="danger" value="danger" />
      </el-select>
    </el-form-item>
    <el-form-item label="按钮权限点">
      <el-input
        v-model="formData.auth_key"
        placeholder="默认开放，无权限控制"
      />
    </el-form-item>
    <el-form-item label="按钮点击对应的回调函数">
      <el-input
        v-model="formData.componentRender"
        type="textarea"
        placeholder="如不填写，默认为系统弹框事件"
      />
      <small class="crm-txtc-emphasis">如：(row)=>{</small>
      <small class="crm-txtc-emphasis">if(row.state===1){return Test1}</small>
      <small class="crm-txtc-emphasis">else{return Test2}</small>
      <small class="crm-txtc-emphasis">}</small>
      <small class="crm-txtc-primary"> 所有用到的组件名称，将会在代码中进行创建，具体内容请在下方填写，多个请用英文逗号分隔</small>
      <el-input v-model="useComponens" @blur="checkUdfComponents" />
    </el-form-item>
    <!-- todo确认是否为无效参数 -->
    <el-form-item label="按钮对应事件名称">
      <el-input v-model="formData.init" placeholder="可能为无效参数" />
    </el-form-item>
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
export default {
    emits: ["updateParams","updateUdfComps"],
    props: {
      params: {
        type: Object,
      },
    },
    watch: {
      params:{
        handler(nv) {
          this.formData = nv;
        },
        deep: true,
      },
      formData: {
        handler(nv) {
          this.$emit("updateParams", nv);
        },
        deep: true,
      },
    },
    setup(props) {
      const formData = ref({});
      if (props.params) {
        formData.value = { ...formData.value, ...props.params };
      }
      const addOption = () => {
        formData.value.options.push({ key: "", value: "" });
      };
       const useComponens = ref('')
      const {proxy} = getCurrentInstance()
      const checkUdfComponents=()=>{
        proxy.$emit("updateUdfComps", useComponens.value.split(","))
      }
      return {
        formData,
        useComponens,
        checkUdfComponents,
        addOption,
      };
    },
};
</script>