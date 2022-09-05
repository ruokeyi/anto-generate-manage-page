<template>
  <el-dialog
    @close="handleClose" top="60px"
    v-model="visible" :title="`预览CSV`" width="90%">
    <el-table :data="pagedData" border max-height="600px">
      <el-table-column
        v-for="(item,index) of keys" :key="item"
        :label="item" :prop="item" :fixed="!index"
      ></el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;"
      :current-page="page"
      :page-sizes="[20,50,100]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.length"
      @current-change="val=>page=val"
      @size-change="val=>{page=1;size=val;}"
    >
    </el-pagination>
    <template #footer>
      <div style="display: flex;justify-content: flex-end;">
        <el-button size="small" @click="handleClose()">关闭</el-button>
        <el-button size="small" type="primary" @click="handleDownload">下载</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import axios from 'axios';
import CSV from 'comma-separated-values';

export default {
  name: 'csv-preview',
  props: {
    url: {type: String, required: true},
  },
  computed: {
    pagedData() {
      return this.data.slice(
        (this.page - 1) * this.size,
        (this.page) * this.size,
      );
    },
  },
  methods: {
    async refreshData() {
      const {data} = await axios.get(this.url);
      let csv = new CSV(data)

      let parsed = csv.parse();
      const cast = new Array(parsed[0].length).fill('String')

      parsed = CSV.parse(data,  {header: true, cast});

      if (parsed?.length) {
        this.data = parsed;
        this.keys = Object.keys(parsed[0]);
      } else {
        this.data = [];
        this.keys = [];
      }
    },
    handleClose() {
      this.$store.dispatch('previewCsv', null);
      this.$emit('close');
    },
    handleDownload() {
      window.open(this.url);
      this.handleClose();
    },
  },
  data() {
    return {
      visible:true,
      data: [],
      keys: [],
      page: 1,
      size: 20,
    };
  },
  created() {
    this.refreshData();
  },
};
</script>

<style scoped>

</style>
