<template>
  <div class="pager">
    <el-pagination
        :current-page="page"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" :page-sizes="pageSizes"
        @current-change="handlePagerChange($event)"
        @size-change="handlePagerChange(1,$event)"
    />
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'MPager',
  emits: ['change'],
  props: {
    page: {type: Number, default: 1},
    size: {type: Number, default: 20},
    total: {type: Number, default: 0},
    pageSizes: {type:Array,default:[10,20,30,50,100]}
  },
  methods: {
    handlePagerChange(page = this.page, size = this.size) {
      this.$emit('update:page', page);
      this.$emit('update:size', size);
      this.$emit('change');
    },
  },
});
</script>

<style scoped>
.pager {
  position: relative;
  display: flex;
  justify-content: flex-end;
}
</style>
