<template>
  <el-card class="card-wrapper">
    <template #header>
      <div class="flex-center">
        <div class="card-name">
          <m-show-more v-if="cardConfPaint.title.type==='text'"
            ><span>{{
              data[cardConfPaint.title.key] || "-"
            }}</span></m-show-more
          >
          <component v-if="cardConfPaint.title.type==='component'" :is="cardConfPaint.title.render()"></component>
        </div>
        <div>
          <a
            class="el-icon-view right-icon-btn"
            @click="preView(data.id)"
          ></a>
          <span v-if="showOperatorBtn">
            <span>
              <a
                v-if="readOnly"
                class="el-icon-delete right-icon-btn disabled"
              />
              <a
                v-else
                class="el-icon-delete right-icon-btn"
                @click="$emit('delete', data.id)"
              />
            </span>
            <span>
              <a v-if="readOnly" class="el-icon-edit right-icon-btn disabled" />
              <a
                v-else
                class="el-icon-edit right-icon-btn"
                @click="$emit('update', data)"
              />
            </span>
          </span>
        </div>
      </div>
    </template>
    <div class="row">
      <!-- 创建者 -->
      <div
        class="row-item"
        v-for="item in cardConfPaint.items"
        :key="item.key"
        :style="{ flex: `0 0 ${100 / cardItemRowSpan+1}%` }"
      >
        <span v-if="item.type === 'text'" class="row">
          <span class="label">{{ item.label }}</span>
          <span class="context-text">{{ data[item.key] }}</span>
        </span>
        <span v-if="item.type === 'tag'" class="row">
          <span class="label">{{ item.label }}</span>
          <el-tag :type="item.map[data[item.key]].tag">{{item.map[data[item.key]].label}}</el-tag>
        </span>
        <span v-if="item.type === 'date'" class="row">
          <span class="label">{{ item.label }}</span>
          <span class="context-text">{{
            formatTimestamp(data[item.key], "YYYY/MM/DD HH:mm:ss")
          }}</span>
        </span>
      </div>
    </div>
  </el-card>
</template>
<script>
import { formatTimestamp } from "@/utils/formatTimestamp";
export default {
  name: "ListCard",
  emits: ["update", "delete"],
  props: {
    readOnly:{
      type:Boolean,
      default:false
    },
    data: {
      type: Object,
      required: true,
    },
    showOperatorBtn: {
      type: Boolean,
      default: true,
    },
    cardItemRowSpan:{
      type:Number,
      default:4
    },
    cardConfPaint: {
      type: Object,
    },
  },
  data() {
    return {
      formatTimestamp,
    };
  },
  computed: {
    items(){
      return this.cardConfPaint.items
    }
  },
  methods: {
    preView(id) {
      this.$emit("preView", id);
    },
  },
};
</script>
<style lang="less" scoped>
.card-wrapper {
  background-color: white;
  font-size: 14px;
  height: 180px;
  .card-name {
    width: 35%;
    display: flex;
    font-size: 16px;
    padding-left: 4px;
    align-items: center;
  }
  .row {
    display: flex;
    align-items: baseline;
  }
  .row-item {
    margin-left: 20px;
    grid: 8px;
    display: flex;
    align-items: center;
    .content-icon {
      margin-right: 4px;
    }
    .label{
      margin-right:8px;
    }
    .context-text {
      font-size: 14px;
      font-weight: 500;
    }
  }
  /* 去除每行尾的多余边距 */
  .row-item:nth-child(1) {
    margin-left: 0;
  }
  .mult-info {
    display: block;
  }
  .info-title {
    font-weight: 500;
  }
}
.right-icon-btn {
  float: right;
  font-size: 16px;
  margin-left: 12px;
  cursor: pointer;
  .text {
    font-size: 12px;
  }
}
.right-bottom-btn-group {
  padding-top: 20px;
  float: right;
  gap: 12px;
  font-size: 14px;
  color: var(--color-primary);
}
.not-active {
  color: #868282;
  cursor: not-allowed;
}

.img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-text {
  display: flex;
  justify-content: flex-start;
  color: var(--color-neutral-30);
}
.pool-index {
  margin-left: 12px;
  color: #7c7878;
  font-size: 14px;
}
/deep/.el-card__header {
  padding: 4px 12px;
}
.disabled {
  cursor: not-allowed;
  color: #868282;
}
</style>