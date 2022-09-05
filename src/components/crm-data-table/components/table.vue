<template>
  <div style="display: block">
    <div class="operator-btn-wrapper">
       <span class="mgr12" v-for="item in tableConf.topOperation" :key="item.key">
         <el-button size="small" v-if="!item.auth_key||(item.auth_key&&$auth(item.auth_key))" 
         :type="item.button_type" @click="$emit('openDialog',item.key)"
        >{{item.label}}</el-button
      >
      </span>
    </div>
    <div class="list-wrapper">
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        v-if="tableData"
        header-row-class-name="TableHeader"
        @sort-change="handleSortChange"
        stripe
      >
        <el-table-column
          v-for="item in tableConf.items"
          :label="item.label"
          :key="item.key"
          :prop="item.key"
          :width="item?.width ?? 'auto'"
          :sortable="item.sortable"
        >
          <template #default="{ row: record }">
            <component
              v-if="item.type === 'component'"
              :is="item.render(record)"
            ></component>
            <span v-if="item.type === 'html'">
              <span v-html="item.render(record)"></span>
            </span>
            <span v-if="item.type === 'text'">
              <m-show-more>
                <span>{{
                  item.render ? item.render(record) : record[item.key]
                }}</span>
              </m-show-more>
            </span>
            <span v-if="item.type === 'tag'">
              <m-show-more
                ><el-tag
                  :type="item.map[record[item.key]]?.tag || ''"
                  size="small"
                  >{{ item.map[record[item.key]]?.label || "" }}</el-tag
                ></m-show-more
              >
            </span>
            <span v-if="item.type === 'select'">
              <el-select
                size="small"
                :multiple="item.multiple"
                :disabled="item.disabled"
                v-model="record[item.key]"
              >
                <el-option
                  v-for="op in item.options"
                  :key="op.key"
                  :label="op.label"
                  :value="op.key"
                />
              </el-select>
            </span>
            <span v-if="item.type === 'date'">
              {{ formatTimestamp(record[item.key], "YYYY/MM/DD HH:mm:ss") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableConf.operation.length > 0"
          label="操作"
          :min-width="`${tableConf.operation.length * 40}px`"
          fixed="right"
        >
          <template #default="{ row: record }">
            <span
              v-for="op in tableConf.operation"
              :key="op.key"
              class="icon-group-item"
            >
            <span v-if="!(op?.auth_key) || op?.auth_key&&$auth(op.auth_key)">
              <span v-if="!op?.type || op?.type === 'icon'">
                <el-tooltip :content="op.label" placement="top">
                  <i
                    :class="`el-icon-${op.key}`"
                    @click="$emit(`${op.key}Item`, op?.format_params?op.format_params(record):record)"
                /></el-tooltip>
              </span>
              <span v-if="op?.type === 'text'">
                <el-link
                 :disabled="checkReadOnly(op,record)"
                  link
                  size="small"
                  @click="$emit(`${op.key}Item`, op?.format_params?op.format_params(record):record)"
                  >{{ op.label }}</el-link
                >
              </span>
            </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatTimestamp } from "@/utils/formatTimestamp";
export default {
  emits: [
    "refreshListBySort",
    "deleteItem",
    "createItem",
    "editItem",
    "viewItem",
    "importList",
  ],
  props: {
    tableConf: {
      type: Object,
      required: true,
    },
    tableData: {
      type: Array,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
     itemComponent:{
      type:Object
    },
    cardRowSpan:{
      type:Number,
      default:2
    },
  },
  data() {
    return {
      formatTimestamp,
       spanArr: {},
      spanSecondArr: [],
      pos: [],
      rowValue: {},
    };
  },
  mounted(){
     if (this.tableConf.mergeRows) {
      this.mergeTableData(this.tableData);
     }
  },
  watch:{
    tableData(nv){
if (this.tableConf.mergeRows) {
      this.mergeTableData(nv);
     }
    }
  },
  methods: {
    checkReadOnly(op,row){
      if(op.disableRender){
        return op.disableRender(row)
      }
      return false
    },
    mergeTableData(tableData) {
      if(tableData?.length<=0) return false
      let data = tableData; //遍历数据
      const columnNumber = this.tableConf.items.length;
      for (let i = 0; i < columnNumber; i++) {
        const columnName = this.tableConf.items[i].key;
        this.spanArr[i] = {};
        if(i===0){
          data.forEach((item, index) => {
              if (this.rowValue[item[columnName]]) {
              this.spanArr[i][this.rowValue[item[columnName]].key].push(index);
            } else {
              this.rowValue[item[columnName]] = { key: index };
              this.spanArr[i][index] = [index];

            }
            
        });
      } else {
       data.forEach((item, index) => {
         if(this.spanArr[i-1][index]?.length>0){
           if(this.spanArr[i-1][index].indexOf(index)!==-1){
              if (this.rowValue[item[columnName]]) {
              this.spanArr[i][this.rowValue[item[columnName]].key].push(index);
            } else {
              this.rowValue[item[columnName]] = { key: index };
              this.spanArr[i][index] = [index];
            }
           }
         }else{
            this.spanArr[i][index] = [index];
         }
          
        });
      }
      }
    },
    // 合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.tableConf.mergeRows) {
        if (this.tableConf.mergeRows.indexOf(columnIndex) !== -1) {
          // 页面列表上 表格合并行 -> 第几列(从0开始)
          // 需要合并多个单元格时 依次增加判断条件即可
          // 数组存储的数据 取出
          const _row = this.spanArr[columnIndex][rowIndex].length;
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        }else{
//不可以return {rowspan：0， colspan: 0} 会造成数据不渲染， 也可以不写else，eslint过不了的话就返回false
        return false;
        }
      } else {
        return false;
      }
    },
    handleUpdateItem(itemInfo) {
      this.$emit("editItem", itemInfo);
    },
    handleViewItem(itemInfo) {
      this.$emit("viewItem", itemInfo);
    },
    handleSortChange(v) {
      const sorter = {
        sort: v.order === "descending" ? "DESC" : "ASC",
        order: v.prop,
      };
      this.$emit("refreshListBySort", sorter);
    },
  },
};
</script>
<style scoped lang="less">
.row {
  display: flex;
}
.column {
  display: flex;
  flex-direction: column;
}
.operator-btn-wrapper {
  padding: 10px 20px 20px 60px;
  display: flex;
  // position: fixed;
}
.list-wrapper {
  width: 100%;
  padding: 0 60px 20px 60px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .disabled {
    cursor: not-allowed;
    color: var(--color-neutral-30);
  }
}
.icon-group-item {
  color: var(--color-primary);
  & + .icon-group-item {
    margin-left: 20px;
  }
  &:hover {
    cursor: pointer;
  }
}
</style>
