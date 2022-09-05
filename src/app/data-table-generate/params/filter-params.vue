<template>
  <el-form v-model="formData" label-position="top" size="small">
    <div v-if="areaType === 'toolbar'">
      <toolbar-params :params="formData" @updateParams="updateParams" />
    </div>
    <div v-if="itemType === 'select'">
      <el-divider content-position="center">下拉框</el-divider>
      <el-form-item label="是否多选">
        <el-radio-group v-model="formData.multiple" class="ml-4">
          <el-radio label="true">多选</el-radio>
          <el-radio label="false">单选</el-radio>
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
        <el-input
          v-model="formData.inRender"
          type="textarea"
          rows="5"
          :placeholder="inRenderTemplate"
        />
      </el-form-item>
      <el-form-item label="输出render函数">
        <el-input
          v-model="formData.inRender"
          type="textarea"
          rows="5"
          :placeholder="outRenderTemplate"
        />
      </el-form-item>
    </div>
    <div v-if="areaType === 'dataTable'">
      <data-table-params :params="formData" @updateParams="updateParams" />
    </div>
    <div v-if="areaType === 'func'">
      <func-params :params="formData" @updateParams="updateParams" />
    </div>
    <div v-if="areaType === 'dialog'">
      <dialog-params
        :params="formData"
        :itemType="itemType"
        @updateParams="updateParams"
      />
    </div>
  </el-form>
</template>
<script>
import { ref } from "vue";
import DataTableParams from "./data-table.params.vue";
import DialogParams from "./dialog.params.vue";
import FuncParams from "./func.params.vue";
import ToolbarParams from "./toolbar.params.vue";
export default {
  emits: ["updateBaseParams"],
  props: {
    areaType: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
    },
    params: {
      type: Object,
    },
  },
  components: { DataTableParams, DialogParams, FuncParams, ToolbarParams },
  watch: {
    params: {
      handler(nv) {
        debugger
        this.formData = nv;
      },
      deep: true,
    },
    formData: {
      handler(nv) {
        this.$emit("updateBaseParams", nv);
      },
      deep: true,
    },
  },
  setup(props) {
    const formData = ref({});
    if (props.params) {
      formData.value = { ...props.params };
    }
    const addOption = () => {
      formData.value.options.push({ key: "", value: "" });
    };
    const updateParams = (p) => {
      formData.value = p;
    };
    return {
      formData,
      updateParams,
      addOption,
    };
  },
};
</script>