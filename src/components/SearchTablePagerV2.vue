<template>
  <div>
    <el-table
      stripe border
      ref="table"
      :data="gridOption.data"
      @row-dblclick="emitDoubleClick"
      @selection-change="tableSelectionChange"
      @sort-change="handleSortChange"
      :show-header="showHeader"
      style="margin-bottom: 40px;"
    >
      <el-table-column
        v-if="gridOption.multSelect"
        width="55"
        type="selection"
        :selectable="gridOption.multSelectable">
      </el-table-column>
      <template v-for="(column, columnIndex) in gridOption.columns" >
        <el-table-column
          v-if="!column.show || (column.show && column.show())"
          :label="column.title" :prop="column.key" :width="column.width"
          :fixed="column.fixed" :align="column.align" :key="columnIndex"
          :sortable="column.sortable">
          <template #default="scope">
            
            <div v-if="column.slotName && (!column.show || column.show())">
              <slot :name="column.slotName" :row="scope.row" :$index="scope.$index"></slot>
            </div>
            <span v-else v-html="column.render ? column.render(scope.row) : scope.row[column.key]"></span>
            <span v-if="column.editEntry"
              v-html="(typeof column.editEntry) === 'function' ? column.editEntry(scope.row) : column.editEntry "
              @click="column.editCallback(scope.row)"></span>
          </template>
          <template #header
            v-if="column.toolTip">
            {{column.title}}
            <el-tooltip
              :content="column.toolTip"
              placement="top">
              <i class="el-icon-info" style="cursor: pointer;"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="gridOption.total > 10"
      :current-page="pagerOption.page"
      :page-sizes="pagerOption.pageSizeOpts"
      :page-size="pagerOption.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="gridOption.total"
      @current-change="pagerCurrentChange"
      @size-change="pagerSizeChange"
    class="fixed-page-footer">
    </el-pagination>
  </div>
</template>
<script>
import { report } from "@/utils/report";

export default {
  props: {
    isDisplayUrl: {
      type: Boolean,
      default: false
    },
    queryData: {
      type: Object,
      default() {
        return {}
      },
    },
    formOption: Object,
    gridOption: {
      type: Object,
      required: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      pagerOption: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageKey: 'from',
        pageSizeKey: 'limit',
        pageSizeOpts: [10, 20, 30, 50],
      },
    }
  },
  methods: {
    resetPager() {
      this.pagerOption.page = 1
      this.pagerOption.pageSize = 20
      this.emitEvent()
    },
    pagerSizeChange(ev) {
      this.pagerOption.pageSize = ev
      this.emitEvent()
    },
    pagerCurrentChange(ev) {
      this.pagerOption.page = ev
      this.emitEvent()
    },
    doQuery(refreshPage) {
      report('handle_search', {
        page: this.$route.meta.title,
        path: this.$route.path,
        feat: `查询`
      })
      if (refreshPage === 'refresh') {
        this.pagerOption.page = 1
      }
      this.emitEvent()
    },
    emitEvent() {
      const { page, pageSize } = this.pagerOption
      if (this.isDisplayUrl) {
        this.displayUrlQuery()
      }
      this.$emit('doQuery', {
        ...this.queryData,
        from: (page - 1) * pageSize,
        page,
        pageSize,
        limit: pageSize,
      })
    },
    // 新增双击快捷事件
    emitDoubleClick(row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    // 展示在 url 变化上
    displayUrlQuery() {
      const { pagerOption } = this
      if (pagerOption.page !== this.$route.query.st_p) {
        this.$router.push({
          path: this.$route.path,
          query: {
            st_p: pagerOption.page,
            st_p_size: pagerOption.pageSize
          }
        })
      }
    },
    getQueryFromUrl() {
      let pageNum = this.$route.query.st_p
      let size = this.$route.query.st_p_size
      if (pageNum !== null && pageNum !== void 0 && pageNum > 0) {
        this.pagerOption.page = parseInt(pageNum)
      }
      if (size !== null && size !== void 0) {
        this.pagerOption.pageSize = parseInt(size)
      }
      const { page, pageSize } = this.pagerOption
      this.$emit('pagerChange', {
        from: (page - 1) * pageSize,
        limit: pageSize
      })
    },
    tableSelectionChange(ev) {
      this.$emit('handleSelectionChange', ev)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    handleSortChange(...args) {
      this.$emit('handleSortChange', ...args)
    },
    selectAll() {
      this.$refs.table.toggleAllSelection()
    }
  },
  created() {
    if (this.isDisplayUrl) {
      this.getQueryFromUrl()
    }
  }
}
</script>
<style lang="scss" scoped="scoped">
.el-form {
  .el-select,
  .el-input {
    width: 140px;
  }
}

.el-table {
  width: 100%;
  margin-top: 20px;
  border: 1px solid #eee;
}

.el-pagination {
  padding: 10px 0;
}

.el-button {
  margin: 0 5px;
}

.btns {
  margin-top: 20px;
}
.fixed-page-footer {
  position: fixed;
  bottom: 10px;
  min-height: 35px;
  max-height: 50px;
  border: 1px solid #1890ff;
  background-color: #fff;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  z-index: 5;
  padding: 5px 10px;
  //&:hover {
  //  background-color: #f2f6fc;
  //  border: 1px solid #f4f5fa;
  //}
}
// 分页input样式优先级提高
::v-deep .el-pagination__editor.el-input {
  width: 50px;
}
</style>
