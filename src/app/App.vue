<template>
  <a-config-provider :locale="locale">
    <router-view v-if="authData && authData.ready && $pageAuth(path)"/>
    <div v-else-if="authData && authData.ready" class="no-permission">
      抱歉，您没有此页面的权限 <br>
      <router-link to="/">去首页</router-link>
    </div>
  </a-config-provider>
  <canvas
    id="watermark"
    style="
      position: fixed;
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: 999999;
      width: 100vw;
      height: 100vh;
    "
    width="3000"
    height="3000" ref="cvs"></canvas>
     <csv-preview
      :url="csvPreviewUrl"
      v-if="csvPreviewUrl"
    />
</template>

<script lang="ts">
import {defineComponent, ref} from '@vue/runtime-core';
import {provideAuthData, useAuthData} from '@/app/services/auth/auth.provider';
import {useCategories} from '@/app/services/categorie';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import {createLogger, performanceLog} from '@/app/services/logger';
import {onMounted, watch} from 'vue';
import {waitFor} from '@/utils/waitFor';
import {sleep} from '@/utils/sleep';
import {useRoute} from 'vue-router';
import {useEnv} from '@/utils/useEnv';
import CsvPreview from "@/components/csv-preview.vue";
import {mapGetters} from 'vuex'

async function renderWaterMark(cvs: HTMLCanvasElement) {
  let fw = window.innerWidth;
  let fh = window.innerHeight;
  cvs.width = fw;
  cvs.height = fh;
  let hw = cvs.width / 2;
  let hh = cvs.height / 2;
  // 等待渲染完成 & 用户名更新
  await sleep(200);
  await waitFor(() => useAuthData().username);
  const ctx = cvs.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, 100000, 100000);
  ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
  ctx.save();
  ctx.moveTo(hw, hh);
  ctx.rotate(-3.14 / 6);

  let uname = useAuthData().username;
  if (!uname) return;
  ctx.font = '16px arial,sans-serif';
  let stepX = (ctx.measureText(uname).width || 200) * 3;
  let stepY = 32;
  if (localStorage.getItem('watermark') === 'hide that shit now') {
    return;
  }
  for (let x = -hw * 4; x < hw * 4; x += stepX) {
    for (let y = -hh * 4; y < hh * 4; y += stepY) {
      let offset = (y / stepY % 2) * (stepX / 2);
      ctx.fillText(uname, x + offset, y);
    }
  }
  ctx.restore();
  ctx.save();
  ctx.fillStyle = 'rgba(122,180,150,0.9)';
  ctx.font = '16px arial,sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  let text = 'dev';
  let env = useEnv();
  if (env.isDev) {
  } else if (env.isUAT) {
    text = 'uat';
  } else if (env.isPre) {
    text = 'pre';
  } else {
    ctx.restore();
    return;
  }
  text += '环境';
  let tw = ctx.measureText(text).width;
  ctx.fillRect(fw - tw - 50, 0, tw + 50, 48);
  ctx.fillStyle = 'aliceblue';
  ctx.fillText(text, fw - 25, 18);
  ctx.restore();
}

const watermarkMixin = {
  async mounted(this: any) {
    let cvs = this.$refs.cvs as HTMLCanvasElement;
    await waitFor(() => (cvs || (cvs = this.$refs.cvs)));
    await renderWaterMark(cvs);
    window.addEventListener('resize', () => renderWaterMark(cvs));
  },
};

let log = createLogger('app');

export default defineComponent({
  mixins: [watermarkMixin],
  components:{CsvPreview},
  computed:{
      ...mapGetters(["csvPreviewUrl"]),
  },
  setup() {
    performanceLog('app component setup');
    provideAuthData();
    let authData = useAuthData();
    // 监听路由
    const route = useRoute()
    const path = ref('')
    watch(() => route.path, () => {
      path.value = route.path
    })
    onMounted(() => {
      performanceLog('app component mounted');
    });
    return {
      authData,
      locale: zhCN,
      path
    };
  },
});
</script>

<style lang="scss" scoped>
.no-permission {
  font-size: 30px;
  text-align: center;
  padding-top: 100px;
  line-height: 100px;
}
</style>
