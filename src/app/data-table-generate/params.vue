<template>
  <el-form v-model="formData" label-position="top" size="small">
    <el-form-item label="字段名">
      <el-input v-model="formData.key" />
    </el-form-item>
    <el-form-item label="字段解释">
      <el-input v-model="formData.label" />
    </el-form-item>
    <el-form-item label="初始值">
      <el-input v-model="formData.value" />
    </el-form-item>
    <el-form-item label="宽度">
      <el-input-number v-model="formData.width" />
      <el-select v-model="widthUnit">
        <el-option label="px" value="px" />
        <el-option label="%" value="%" />
        <el-option label="em" value="em" />
      </el-select>
    </el-form-item>
    <div v-if="type === 'select'">
      <el-divider content-position="center">下拉框</el-divider>
      <el-form-item label="是否多选">
        <el-radio-group v-model="formData.multiple" class="ml-4">
          <el-radio :label="true" size="large">多选</el-radio>
          <el-radio :label="false" size="large">单选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="下拉选项">
        <span v-for="op in formData.options" :key="op.key" class="fr">
          key:<el-input v-model="op.key" /> value:<el-input
            v-model="op.value"
          /> </span
        ><el-icon @click="addOption"><Plus /></el-icon>
      </el-form-item>
       <el-form-item label="输入render函数">
      <el-input v-model="formData.inRender" type="textarea" rows="5" :placeholder="inRenderTemplate"/>
    </el-form-item>
       <el-form-item label="输出render函数">
      <el-input v-model="formData.inRender" type="textarea" rows="5" :placeholder="outRenderTemplate"/>
    </el-form-item>
    </div>
  </el-form>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    type: String,
    required:true,
  },
  setup(props) {
    const formData = ref({
      type: "",
      label: "",
      key: "",
      width: "",
      value: "",
      multiple: null,
      inRender: null,
      outRender: null,
      options: null,
    });
    const widthUnit = ref("px");
    const addOption = () => {
      formData.value.options.push({ key: "", value: "" });
    };
    const inRenderTemplate = `(v)=>{
      if(v.length<=0){
        return []
      }
      return v.split(',')
    }`
    const outRenderTemplate = `(v)=>{
      return v.join(',')
    }`
    return {
      formData,
      widthUnit,
      addOption,
      inRenderTemplate,
      outRenderTemplate
    };
  },
};
</script>