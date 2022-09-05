<template>
  <el-date-picker
    v-model="value"
    :type="type"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  ></el-date-picker>
</template>

<script>
import moment from "moment";

export default {
  name: "mDatetimeRangePicker",
  props: {
    start: [Number],
    end: [Number],
    dataFormat: {
      type: String,
      default: "timestamp",
    },
    type: {
      type: String,
      default: "daterange",
    },
  },
  emits: ["update:start", "update:end"],
  computed: {
    value: {
      get() {
        if (this.start && this.end) {
          if (this.type === 'daterange') {
            return [moment.unix(this.start), moment.unix(this.end - 86400+1)];
          }
          return [moment.unix(this.start), moment.unix(this.end)];
        } else {
          return [];
        }
      },
      set(value) {
        const [start, end] = value || [];
        if (start && end) {
          this.$emit("update:start", moment(start).unix());
          if (this.type === 'daterange') {
            this.$emit("update:end", moment(end).add(1, "day").unix() - 1);
          } else {
            this.$emit("update:end", moment(end).unix());
          }
        } else {
          this.$emit("update:start", null);
          this.$emit("update:end", null);
        }
      },
    },
  },
};
</script>

<style scoped>
</style>
