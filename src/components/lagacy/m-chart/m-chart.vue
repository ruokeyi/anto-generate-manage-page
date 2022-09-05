<template>
  <div :id="id" ref="chartContainer" class="echarts"/>
</template>
<script>
import {useEchartsPlugin} from '@/components/lagacy/m-chart/useEchartsPlugin';
import {onMounted, onUnmounted, ref, watchEffect} from 'vue';
import * as echarts from 'echarts';
import {debounce} from 'lodash/function';

useEchartsPlugin();

export default {
  name: 'm-chart',
  emits: ['click', 'ready', 'contextmenu'],
  props: {
    options: {type: Object, required: true},
    id: {
      type: String,
      default: `m_chart_${(Math.random() * 100000).toFixed(0)}_${Date.now()}`,
    },
  },
  setup(props, {emit}) {
    /** @type {Ref<HTMLElement|null>} */
    let chartContainerR = ref(null);
    /** @type {EChartsType|null} */
    let chart = null;
    let resetSize = debounce(() => {
      if (!chart) return;
      chart.resize();
    }, 500);
    onMounted(() => {
      let el = chartContainerR.value;
      if (el instanceof HTMLElement) {
        chart = echarts.init(el);
        emit('ready', chart);
      } else {
        console.warn('echarts初始化失败：没有找到对应的HTML元素');
        return;
      }
      chart.getZr().on('contextmenu', (event) => {
        emit('contextmenu', event);
      });
      window.addEventListener('resize', resetSize);
      watchEffect(async () => {
        const options = props.options;
        await void 0;
        chart.clear();
        chart.setOption(options, true);
      });
    });
    onUnmounted(() => {
      window.removeEventListener('resize', resetSize);
    });
    return {
      chartContainer: chartContainerR,
    };
  },
};
</script>
<style lang="stylus" scoped="scoped">
.echarts {
  width: 100%;
  min-width: 500px;
  height: 500px;
}
</style>
