<template>
  <div :id="id" class="echarts">
  </div>
</template>
<script>
import * as echarts from 'echarts/core';
import {useEchartsPlugin} from '@/components/lagacy/m-chart/useEchartsPlugin';

useEchartsPlugin();
export default {
  name: 'Echarts',
  props: {
    chartsOption: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      default: 'main',
    },
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        color: ['#3398DB', '#ba2e2b'],
      },
    };
  },
  computed: {},
  watch: {
    chartsOption: {
      handler() {
        this.renderCharts();
      },
      deep: true,
    },
  },
  methods: {
    resizeCharts() {
      let array = document.querySelectorAll('.echarts');
      for (let i = 0; i < array.length; i++) {
        echarts.init(array[i]).resize();
      }
    },
    renderCharts() {
      const lineChart = echarts.init(document.getElementById(this.id));
      window.addEventListener('resize', lineChart.resize);
      Object.keys(this.chartsOption).forEach(key => {
        this.option[key] = this.chartsOption[key];
      });
      lineChart.setOption(this.option, true);
    },
    init() {
      this.resizeCharts();
      this.renderCharts();
    },
  },
  mounted() {
    this.renderCharts();
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
