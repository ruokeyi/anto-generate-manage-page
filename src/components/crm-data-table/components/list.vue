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
      <component
       :is="currentCardComponent"
        class="card-item"
        :style="{ flex: `0 0 ${96/cardRowSpan}%` }"
        v-for="item in tableData"
        :key="item.id"
        :data="item"
        :row-span="cardRowSpan"
        :cardItemRowSpan="cardItemRowSpan"
        :card-conf-paint="tableConf"
        :readOnly="readOnly"
        @update="handleUpdateItem"
        @delete="handleDeleteItem(item.id)"
        @preView="handleViewItem"
        @refresh="$emit('refreshList')"
      />
    </div>
  </div>
</template>
<script>
import ItemCard from "./card.item.vue";
import { ElMessageBox } from "element-plus";

export default {
  components: { ItemCard },
  emits: ["refreshList", "deleteItem", "createItem",'editItem','importList','openDialog'],
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    tableConf: {
      type: Object,
      required: true,
    },
    cardRowSpan:{
      type:Number,
      default:2
    },
    cardItemRowSpan:{
      type:Number,
      default:4
    },
    readOnly:{
      type:Boolean,
      default:false
    },
    itemComponent:{
      type:Object
    }
  },
  computed: {
    currentCardComponent() {
      return this.itemComponent || ItemCard;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleUpdateItem(itemInfo) {
      this.$emit("editItem", itemInfo);
    },
    handleViewItem(itemInfo) {
     this.$emit("viewItem", itemInfo);
    },
    async handleDeleteItem(id) {
      await ElMessageBox.confirm(`确认删除本条记录吗？`, "删除").then(
        () => {
          this.$emit("deleteItem", id);
        }
      );
    },
  },
};
</script>
<style scoped lang="less">
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
}
.card-item {
  text-align: center;
  line-height: 30px;
  /* 边距懒得算，css函数代替 */
  margin-right: calc(4% / 2);
  margin-bottom: calc(4% / 2);
}
/* 去除每行尾的多余边距 */
.card-item:nth-child(2n) {
  margin-right: 0;
}
.empty-info {
  height: 400px;
  font-size: 20px;
  color: var(--color-primary);
  border: 1px solid #fefefe;
  text-align: center;
  vertical-align: center;
}
</style>