<template>
  <div>
    <el-input
        :model-value="modelValue" type="textarea"
        @update:model-value="$emit('update:modelValue',$event)"
        maxlength="maxLength" :autosize="autosize"
    ></el-input>
    <div
        v-if="maxLength"
        class="xn text sub lighter"
        style="transform: translateY(-25px);height: 0;position: relative;text-align: right;padding-right: 10px;">
      {{ modelValue.length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'm-textarea',
  props: {
    modelValue: {type: String, default: null, required: false},
    maxLength: {type: Number, default: null, required: false},
    autosize: {type: Object, default: null, required: false},
  },
};
</script>

<style scoped>

</style>
