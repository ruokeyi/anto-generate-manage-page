<template>
  <div>
    <el-tooltip v-if="fold" content="拖拽组件工具箱" placement="bottom">
      <el-icon><Tools /></el-icon>
    </el-tooltip>
    <div class="rule-list-box" v-else>
      <el-input
        v-model="searchContent"
        style="margin-bottom: 12px"
        placeholder="🔍输入名称搜索"
      />
      <menu-item v-for="item of showList" :key="item.key" :item-data="item" />
    </div>
  </div>
</template>

<script>
import { Buttons } from "./data";
import MenuItem from "./MenuItem.vue";
export default {
  name: "Menu",
  components: { MenuItem },
  props: { fold: { type: Boolean, default: true } },
  data() {
    return {
      ruleListData: null,
      showList: null,
      searchContent: "",
    };
  },
  watch: {
    searchContent(ov) {
      if (ov === "") {
        this.showList = this.ruleListData;
      } else {
        const temp = [];
        this.ruleListData.map((rule) => {
          if (rule.title.indexOf(ov) !== -1) {
            temp.push(rule);
          }
        });
        this.showList = temp;
      }
    },
  },
  async created() {
    this.ruleListData = Buttons || [];
    this.showList = this.ruleListData;
  },
};
</script>

<style lang="less" scoped>
.rule-list-box {
  width: 200px;
  height: 80vh;
  border: 1px solid #eeeeee;
  border-radius: 12px;
  padding: 10px;
  margin-right: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .rule-list-content {
    display: flex;
    flex-direction: row;
    margin: 10px 0;

    .content-title {
      width: 20px;
    }
  }

  .content-item {
    flex: 1;
    display: flex;
    flex-direction: column;

    .el-tag {
      & + .el-tag {
        margin-top: 4px;
      }
    }
  }
}
</style>
