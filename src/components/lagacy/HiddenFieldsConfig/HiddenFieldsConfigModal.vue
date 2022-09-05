<template>
  <el-dialog
      :title="title" @close="handleClose"
      :model-value="modelValue" @update:modelValue="$emit('update:modelValue',$event)">
    <el-checkbox-group v-model="fields">
      <el-checkbox v-for="field of allFields" :key="field.key" :label="field.key">
        {{ field.label }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <div>
        <el-button
            size="small" type="default" style="width: 100px;"
            @click="$emit('update:modelValue', false)">
          取消
        </el-button>
        <el-button
            size="small" type="primary" style="width: 100px;"
            @click="$emit('update:fields', fields)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {PageConfigStore} from '../../../app/services/PageConfigStore';

export default {
  name: 'HiddenFieldsConfigModal',
  props: {
    title: String,
    // switch show or hidden
    modelValue: {type: Boolean},
    // {key:string,label:string}[]
    allFields: {type: Array},
    // string[]
    fields: {type: Array},
  },
  data() {
    return {
      store: new PageConfigStore(this.id),
      hiddenFields: [],
    };
  },

  methods: {

    handleClose() {
    },
  },
};
</script>

<style scoped>

</style>
