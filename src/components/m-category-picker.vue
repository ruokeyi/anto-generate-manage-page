<template>
  <el-cascader
      style="width:177px;"
      :options="options"
      :modelValue="modelValue"
      @update:modelValue="update"
      :props="{
        checkStrictly: !fieldOptions?.onlyFirstCategory,
        expandTrigger:'hover'
      }"
      clearable placeholder="请选择"
  />
</template>

<script lang="ts">
import {computed, defineComponent, toRef} from 'vue';
import {useCategories} from '../app/services/categorie';
import {sleep} from '@/utils/sleep';

export default defineComponent({
  name: 'm-category-picker',
  props: {
    modelValue: Number,
    value2: Number,
    fieldOptions: Object,
    allowedFirstCategoryList: Object  // 允许有二级标签的 一级标签列表 如['生活']，则生活以外的二级标签都不展示
  },
  emits: [
    'updateAll',
    'update:modelValue',
    'update:value2',
  ],
  setup(props, context) {
    const cascaderData = toRef(useCategories(true, props.allowedFirstCategoryList, props.fieldOptions), 'cascaderData');
    return {
      options: cascaderData,
      modelValue: computed(() => {
        let modelValue = props.modelValue;
        let value2 = props.value2;
        if (typeof modelValue === 'number') {
          if (typeof value2 === 'number') {
            return [modelValue, value2];
          }
          return [modelValue];
        }
        return [];
      }),
      async update(value) {
        const [modelValue, value2] = value ?? [];
        if (typeof modelValue === 'number') {
          context.emit('update:modelValue', modelValue);
          context.emit('update:value2', value2 ?? null);
        } else {
          context.emit('update:modelValue', null);
          context.emit('update:value2', null);
        }
        await sleep();
        context.emit('updateAll');
      },
    };
  },
});
</script>

<style scoped>

</style>
