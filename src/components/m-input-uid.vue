<template>
  <div v-if="disabled">
    <span>{{ modelValue }}</span>
    <span class="xn mg left mgh text sub lighter">{{ nickname }}</span>
  </div>
  <el-input
      v-else :modelValue="modelValue" :size="size" ref="input"
      @update:modelValue="$emit('update:modelValue',$event.replace(/[^\d]/g,'')-0)"
      @blur="refreshNickname" @keydown.enter="refreshNickname" style="width: 280px;">
    <template #append>
      <el-select
          ref="select" :size="size" class="SelectInput-PublicSentimentAddEvent"
          :modelValue="nickname||_nickname" @update:modelValue="handleSelectInput"
          filterable remote :remote-method="fetchUpsByNickname" placeholder="按昵称搜索"
          :loading="loading" style="width: 140px;background: var(--theme-color--crm);color: white;">
        <el-option v-for="item of options" :key="item.value" :value="item.value" :label="item.label"/>
      </el-select>
    </template>
  </el-input>
</template>

<script>

import {http} from '@/app/services/http/http';

export default {
  name: 'm-input-uid',
  props: {
    modelValue: [Number, String],
    nickname: String,
    size: {type: String, default: 'mini'},
    disabled: Boolean,
  },
  emits: ['update:model-value', 'update:nickname'],
  data: function () {
    return {
      options: [],
      loading: false,
      _nickname: '',
    };
  },
  created() {
    if (this.disabled) {
      this.refreshNickname();
    }
  },
  watch: {
    modelValue() {
      if (this.disabled) {
        this.refreshNickname();
      }
    },
  },
  methods: {
    focus(target = 'select') {
      switch (target) {
        case 'select':
          this.$refs.select?.focus();
          break;
        case 'input':
          this.$refs.input?.focus();
          break;
      }
    },
    async fetchUpsByNickname(val) {
      this.loading = true;
      try {
        let {data: {result}} = await http.get(`/x/admin/uper/info/up_list?Name=${val}&name=${val}`);
        this.options = (result || []).map(x => ({value: x.mid, label: x.name}));
      } catch (e) {
        this.options = [];
      } finally {
        this.loading = false;
      }
    },
    handleSelectInput($event) {
      this.$emit('update:modelValue', $event);
      let target = this.options.find(x => x.value === $event);
      let nickname = target?.label ?? '';
      this.$emit('update:nickname', nickname);
      this._nickname = nickname;
    },
    async refreshNickname() {
      if (!this.modelValue) return;
      let nickname = '⏳ 请稍候...';
      this.$emit('update:nickname', '');
      this._nickname = nickname;
      let {data: {result}} = await http.get(`/x/admin/uper/info/up_list?Mid=${this.modelValue}&mid=${this.modelValue}`);
      let target = result?.[0];
      nickname = target?.name;
      if (target && target.mid - 0 === this.modelValue - 0) {
        this.$emit('update:nickname', nickname);
        this._nickname = nickname;
      } else {
        this.$emit('update:nickname', '');
        this._nickname = '未查询到该用户';
      }
      this.$emit('blur');
    },
  },
};
</script>

<style lang="stylus">
.SelectInput-PublicSentimentAddEvent input::input-placeholder {
  color white
}

.SelectInput-PublicSentimentAddEvent input::-webkit-input-placeholder {
  color white
}

.SelectInput-PublicSentimentAddEvent input:-moz-placeholder {
  color: white;
}

.SelectInput-PublicSentimentAddEvent input::-moz-placeholder {
  color: white;
}

.SelectInput-PublicSentimentAddEvent input:-ms-input-placeholder {
  color: white;
}
</style>
