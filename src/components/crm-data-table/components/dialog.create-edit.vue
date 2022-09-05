<template>
  <el-dialog
    v-model="dialogVisible"
    :width="confPaint.dialogWidth"
    :before-close="handleClose"
  >
    <template #header>
      <div>
        <span v-if="confPaint.dialogTitle" class="el-dialog__title">{{
          confPaint.dialogTitle
        }}</span>
        <span v-else class="el-dialog__title">{{
          `${isUpdate ? "修改" : "新建"}`
        }}</span>
      </div>
    </template>
    <el-form
      v-if="items"
      :disabled="readOnly"
      :label-width="confPaint.labelWidth"
      :model="form"
      :rules="rules"
      size="small"
      ref="form"
    >
      <el-form-item
        v-for="item in items"
        :key="item.key"
        :label="item.label"
        :prop="item.key"
      >
        <el-input
          :style="{ width: item?.width || '100%' }"
          v-if="item.type === 'input'"
          :placeholder="item.placeholder || `请输入${item.label}`"
          v-model="form[item.key]"
        />
        <el-input-number
          :style="{ width: item?.width || '100%' }"
          v-if="item.type === 'inputNumber'"
          :min="item.min"
          :placeholder="item.placeholder || `请输入${item.label}`"
          v-model="form[item.key]"
        />
        <el-input
          :style="{ width: item?.width || '100%' }"
          v-if="item.type === 'textarea'"
          type="textarea"
          v-model="form[item.key]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          :maxlength="item.maxlength"
          :show-word-limit="item.showwordlimit||true"
        />
        <el-select
          :style="{ width: item?.width || '100%' }"
          :multiple="item.multiple"
          v-if="item.type === 'select'"
          v-model="form[item.key]"
        >
          <el-option
            v-for="op in item.options"
            :key="op.key"
            :label="op.label"
            :value="op.key"
          />
        </el-select>
        <el-date-picker
          :style="{ width: item?.width || '100%' }"
          v-if="item.type === 'date'"
          v-model="form[item.key]"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          :disabled-date="
            (time) => {
              disableDate(time, item?.disableDate);
            }
          "
        ></el-date-picker>
        <component
          :style="{ width: item?.width || '100%' }"
          v-if="item.type === 'component'"
          :is="item?.componentRender"
          v-model:modelValue="form[item.key]"
          v-model:dialogVisible="dialogVisible"
        />
        <span v-if="item.type === 'html'">
          <div style="display: flex" v-html="item.html"></div>
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)" size="small"
        >{{ readOnly ? "关 闭" : "取 消" }}
      </el-button>
      <el-button
        v-if="!readOnly"
        type="primary"
        @click="handleSubmit"
        size="small"
        >确认
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import moment from "moment";
export default {
  name: "CreateAndEditDialog",
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    readOnly: {
      type: Boolean,
      required: false,
    },
    formData: {
      type: Object,
    },
    confPaint: {
      type: Object,
      required: false,
    },
  },
  emits: ["update:visible", "update", "submit", "refresh"],
  data() {
    return {
      form: {},
      dialogVisible: this.visible,
      items: this.confPaint.items,
      rules: this.confPaint?.rules ?? [],
    };
  },
  computed:{
    isUpdate(){
      return this.formData&&!!this.formData[this.confPaint.idKey]
    }
  },
  watch: {
    visible(state) {
      this.dialogVisible = state;
      if (state) {
        if (this.isUpdate) {
          this.form = {
            ...this.formData,
          };
        this.formateParams()
        } else {
          this.clear();
        }
      } else {
        this.clear();
      }
    },
  },
  methods: {
    formateParams(){
        const renders = Object.keys(this.formData);
          for (let i = 0; i < renders.length; i++) {
            if (
              typeof this.confPaint.items[renders[i]]?.inRender === "function"
            ) {
              this.form[renders[i]] = this.confPaint.items[renders[i]].inRender(
                this.form[renders[i]]
              );
            }
          }
    },
    disableDate(time, func) {
      if (func) {
        return func(time);
      }
      return time.getTime() + 3600 * 1000 * 24 < Date.now();
    },
    changeData(value, key) {
      this.form[key] = value;
    },
    clear() {
      this.form = { ...this.formData };
      this.formateParams()
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    async handleSubmit() {
      await this.$refs.form.validate();
      let params = {
        ...this.form,
      };
      const renders = Object.keys(params)
     for(let i=0;i<renders.length;i++){
     if(typeof this.confPaint.items[renders[i]]?.render === 'function'){
       params[renders[i]] = this.confPaint.items[renders[i]].render(params[renders[i]])
     }
     }
      if (this.isUpdate) {
        this.$emit("update", params);
      } else {
        this.$emit("submit", params);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.required {
  font-size: 12px;
  color: var(--color-emphasis);
}
</style>
