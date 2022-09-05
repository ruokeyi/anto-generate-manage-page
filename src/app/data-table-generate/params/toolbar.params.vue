<template>
  <div>
      <el-form-item label="字段名">
        <el-input v-model="formData.key" />
      </el-form-item>
      <el-form-item label="字段展示">
        <el-input v-model="formData.label" />
      </el-form-item>
      <el-form-item label="placeholder">
        <el-input v-model="formData.placeholder" />
      </el-form-item>
      <el-form-item label="初始值">
        <el-input v-model="formData.value" />
      </el-form-item>
      <el-form-item v-model="formData.width" label="宽度">
        <el-input v-model="formData.width" />
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
    },
    watch: {
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