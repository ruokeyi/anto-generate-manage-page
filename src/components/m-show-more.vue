<template>
  <el-tooltip :disabled="!showTooltip || hideToolTip" :placement="placement" :effect="effect">
    <template #content>
      <div :style="{maxWidth:tipWidth}">
        <slot name="default"/>
      </div>
    </template>
    <span class="MText" ref="txt" :style="{maxWidth:width}"><slot name="default"/></span>
  </el-tooltip>
</template>

<script>
import {sleep} from '@/utils/sleep';
import * as _ from 'lodash';

export default {
  name: 'm-show-more',
  props: {
    width: {type: String, default: '100%'},
    content: {type: String},
    hideToolTip: {type: Boolean, default:false},
    placement: {type: String, default: 'top'},
    effect: { type: String, default: 'dark' }, // tip主题色
    tipWidth: { type: String, default: '30vw'} // tip框宽度
  },
  created() {
  },
  mounted() {
    let txtEl = this.$refs.txt;
    this.observer.observe(txtEl);
    this.checkLength();
  },
  unmounted() {
    this.observer.disconnect();
  },
  methods: {
    // checkLength: _.debounce(
    //     async function () {
    //       await sleep(10);
    //       let txtEl = this.$refs.txt;
    //       if (txtEl) {
    //         console.group('checking length', txtEl);
    //         let displayWidth = txtEl.getBoundingClientRect().width;
    //         console.log('display width:', displayWidth);
    //         let realWidth = txtEl.scrollWidth;
    //         console.log('real width:', realWidth);
    //         this.showTooltip = displayWidth < realWidth;
    //         console.groupEnd();
    //       }
    //     },
    //     100,
    // ),
  },
  data() {
    let checkLength = _.debounce(
        async () => {
          await sleep(10);
          let txtEl = this.$refs.txt;
          if (txtEl) {
            let displayWidth = Math.round(txtEl.getBoundingClientRect().width);
            let realWidth = txtEl.scrollWidth;
            this.showTooltip = displayWidth < realWidth;
          }
        },
        100,
    );
    return {
      observer: new ResizeObserver(async ([target]) => {
        await checkLength();
      }),
      showTooltip: null,
      checkLength: checkLength,
    };
  },
};
</script>

<style scoped lang="stylus">
.MText {
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  display: inline-block
}
</style>
