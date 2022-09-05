<template>
  <el-form
      class="XnToolbarV2"
      size="small"
      label-position="right" label-suffix="：" label-width="110px"
      @keypress.enter.prevent="update" @submit.prevent
      :model="modelValue"
  >
    <!--顶栏-->
    <div class="ToolbarHeader">

      <!--顶栏按钮组-->
      <div class="ToolbarHeader__Buttons">
        <slot name="buttons"/>
      </div>

      <!--顶栏控件组-->
      <div class="ToolbarHeader__Fields">

      </div>

      <!--顶栏工具条-->
      <div class="ToolbarHeader__Tools">

        <!--顶栏工具条：排序-->
        <template v-if="config.sort">排序</template>

        <!--顶栏工具条：导出-->
        <template v-if="downloadable">导出</template>

      </div>

    </div>

    <div>teleport to: {{ filtersTeleportTo }}</div>

    <!--筛选区-->
    <teleport :to="filtersTeleportTo" :disabled="!filtersTeleportTo">
      <el-form
          size="small"
          label-position="right" label-suffix="：" label-width="110px"
          @keypress.enter.prevent="update" @submit.prevent
          :model="modelValue" style="background: #f6f6f6;"
      >
        筛选区
      </el-form>
    </teleport>

  </el-form>
  <div class="ToolbarFields">
    {{ fields }}
  </div>
  <pre>{{ config }}</pre>
</template>

<script lang="ts">
import {createToolbarConfig, IToolbarConfigDef} from '@/components/lagacy/xn-toolbar-v2/tools';
import {computed, defineComponent, onMounted} from 'vue';
import {merge} from 'lodash';
import {useAuthData} from '@/app/services/auth/auth.provider';

const ToolbarV2 = defineComponent({
  name: 'xn-toolbar-v2',
  props: {
    modelValue: {type: Object},
    fields: {type: Array, default: () => []},
    /** 允许筛选区和顶栏分离，传入CSS选择器或者模板ref */
    filtersTeleportTo: {type: [String, Object]},
    /** 定义见 IToolbarConfigDef */
    options: {type: Object},
  },
  setup(props, context) {
    const config = computed<IToolbarConfigDef>(() => merge(createToolbarConfig(), props.options));
    const downloadable = computed(() => {
      let value = config.value.download;
      if (typeof value === 'string') {
        return useAuthData().hasPermission(value);
      } else {
        return value;
      }
    });

    onMounted(() => {
      console.log('context', context);
    });

    function update() {
    }

    return {
      config,
      downloadable,
      update,
    };
  },
});

export default ToolbarV2;
</script>

<style scoped lang="stylus">
.ToolbarHeader {
  background var(--color-neutral-3)
}

.XnToolbarV2 {
  z-index 100
  box-shadow 0 2px 4px rgba(0, 0, 0, 0.1)
}

</style>
