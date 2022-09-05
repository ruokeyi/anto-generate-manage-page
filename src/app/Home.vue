<template>
  <main-layout :breadcrumb="['首页']">
    <template #content>
      <div class="item-list">
        <el-card style="width:100%;margin:20px;">
          定制你的管理页面，解放双手<router-link to='/data-table-generate'><h1 style="padding: 0; margin: 0;">Click Me</h1></router-link>体验一下吧</el-card>
      </div>
    </template>
  </main-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomeCard from "@/app/HomeCard.vue";

export default defineComponent({
  name: "Home",
  components: { HomeCard },
  setup() {
    const goToProfit = () => {
      const href = window.location.host;
      window.open(`http://${href}/allowance/#/profit`, '_target') ;
    };
    return {
      goToProfit,
    };
  },
  async mounted() {},
});
</script>

<style lang="less" scoped>
.item-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  .item {
    display: flex;
  }
}
</style>
