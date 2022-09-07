<template>
  <div>
    <el-form-item label="字段名">
      <el-input v-model="formData.key" />
    </el-form-item>
    <el-form-item label="字段展示">
      <el-input v-model="formData.label" />
    </el-form-item>
    <el-form-item v-if="['input','inputNmuber','textarea'].indexOf(itemType)!==-1"  label="placeholder">
      <el-input v-model="formData.placeholder" />
    </el-form-item>
    <el-form-item v-if="itemType!=='component'" label="初始值">
      <el-input v-model="formData.value" />
    </el-form-item>
    <el-form-item label="宽度">
      <el-input v-model="formData.width" />
    </el-form-item>
    <el-form-item label="render处理函数">
      <el-input type="textarea" rows="4" v-model="formData.render" />
    </el-form-item>
    <el-form-item v-if="itemType === 'textarea'" label="填写字数上限">
      <el-input v-model="formData.maxlength" />
    </el-form-item>
    <el-form-item v-if="itemType === 'textarea'" label="是否展示字数上限">
      <el-radio-group v-model="formData.showwordlimit">
        <el-radio :label="true">展示</el-radio>
        <el-radio :label="false">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="itemType === 'date'" label="日期时间选择器禁用日期函数">
      <el-input v-model="formData.disableDate" />
    </el-form-item>
    <el-form-item v-if="itemType === 'component'" label="自定义组件名称">
      <el-input v-model="formData.componentRender" />
    </el-form-item>
    <el-form-item v-if="itemType === 'html'" label="自定义html">
      <el-input type="textarea" rows="4" v-model="formData.componentRender" />
    </el-form-item>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  emits: ["updateParams"],
  props: {
    params: {
      type: Object,
    },
    itemType: {
      type: String,
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
    return {
      formData,
      addOption,
    };
  },
};
</script>