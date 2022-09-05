<template>
  <div>
    <el-input
        :placeholder="placeholder" type="textarea" size="small"
        :autosize="{minRows:3,maxRows:6}" v-model="iptAdd" @blur="updateData"/>
    <div style="display: flex;align-items: center;margin-top: 5px;margin-bottom: 5px;">
      <a-upload :file-list="[]" accept=".csv" :before-upload="handleUpload">
        <el-button size="small" type="primary" plain>
          <i class="iconfont iconshangchuan" style="font-size: 12px;margin-right: 5px;"> </i>
          从CSV导入
        </el-button>
        <el-tooltip placement="top">
          <template #content>
            <div>
              导入的CSV每行一个,上限10000条,如导入CSV会覆盖文本框已输入内容
            </div>
          </template>
          <i class="iconfont iconxinxi1" style="margin-left: 5px;margin-right: 20px;"></i>
        </el-tooltip>
      </a-upload>
      <a style="margin-left: 5px;" download="导入模板.csv"
         :href="templateUrl">
        <i class="el-icon-download"></i>
        <span>下载导入模板...</span>
      </a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import {toPublicURL} from '../app/services/toPublicURL';

export default {
  name: 'MidsInput',

  props: {
    modelValue: {type: Array, default: [], required: false},
    maxItems: {type: Number, default: 10000},
    nameMode: {type: Boolean, default: false},
  },
  data() {
    return {
      iptAdd: this.modelValue.join(','),
      placeholder: this.nameMode ? '请输入企业邮箱前缀，每一项之间用英文逗号隔开' : '请输入UID，多个UID之间用英文逗号隔开',
    };
  },
  watch: {
    modelValue(value) {
      this.iptAdd = value ? value.join(',') : '';
    },
  },
  methods: {
    // addTag() {
    //   this.$emit('update:modelValue', _.uniq([...this.modelValue, this.iptAdd]));
    //   this.iptAdd = '';
    // },
    // remove(item) {
    //   let mids = _.without([...this.modelValue], item);
    //   let length = mids.length;
    //   let maxItems = this.maxItems;
    //   if (length > maxItems) {
    //     this.$message(`最多只能上传10000条mid，现有${length}，已经节选其中前${maxItems}条。`);
    //     mids = mids.slice(0, maxItems);
    //   }
    //   this.$emit('update:modelValue', _.uniq(mids));
    // },
    /**
     * @param file {File}
     */
    handleUpload(file) {
      (async () => {
        let text = await file.text();
        if (text.charCodeAt(0) == '0xFEFF') {
          text = text.slice(1);
        }
        let rows = text.split(/\n/)
            .slice(1)
            .map(x => x.trim())
            .map(x => this.nameMode ? x : parseInt(x))
            .filter(x => x);
        // let data = _.uniq([...this.modelValue, ...rows]);
        let data = _.uniq([...rows]);
        let len = data.length,
            maxLen = this.maxItems;
        if (len > maxLen) {
          this.$message(`最多只能上传10000条mid，现有${length}，已经节选其中前${maxLen}条。`);
          data = data.slice(0, maxLen);
        }
        this.iptAdd = data.join(',');
        this.updateData();
      })();
      return false;
    },
    updateData() {
      let data = this.iptAdd.split(',')
          .map(x => this.nameMode ? x.trim() : parseInt(x.trim()))
          .filter(x => x);
      let len = data.length,
          maxLen = this.maxItems;
      if (len > maxLen) {
        data = data.slice(0, maxLen);
      }
      this.$emit('update:modelValue', data);
    },
  },
  computed: {
    templateUrl() {
      if (this.nameMode) {
        return toPublicURL('/template_upload_usernames.csv');
      } else {
        return toPublicURL('./template_upload_mids.csv');
      }
    },
  },
};
</script>

<style scoped>

</style>
