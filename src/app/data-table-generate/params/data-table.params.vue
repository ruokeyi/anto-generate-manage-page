<template>
  <div>
    <el-form-item label="列字段名">
      <el-input v-model="formData.key" />
    </el-form-item>
    <el-form-item label="列展示名">
      <el-input v-model="formData.label" />
    </el-form-item>
    <el-form-item label="列展示类型">
      <el-select v-model="formData.type" style="width: 100%">
        <el-option label="文字" value="text" />
        <el-option label="tag" value="tag" />
        <el-option label="日期时间" value="date" />
        <el-option label="自定义html" value="html" />
        <el-option label="自定义组件" value="component" />
      </el-select>
      <small
        class="crm-txtc-emphasis"
        v-if="['html', 'component'].indexOf(formData.type) !== -1"
      >
        若选择自定义html或者组件，请务必在render函数中添加对应内容</small
      >
    </el-form-item>
    <el-form-item v-model="formData.width" label="列宽度">
      <el-input v-model="formData.width" />
    </el-form-item>
    <el-form-item label="render函数">
      <el-input
        type="textarea"
        rows="3"
        v-model="formData.render"
        placeholder="列字段展示的回调处理函数，若选择component/html类型，必填render函数"
      />
      <small class="crm-txtc-primary"> 所有用到的组件名称，将会在代码中进行创建，具体内容请在下方填写，多个请用英文逗号分隔</small>
      <el-input v-model="useComponens" @blur="checkUdfComponents" />
    </el-form-item>
  </div>
</template>
<script>
import { ref,getCurrentInstance } from "vue";
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