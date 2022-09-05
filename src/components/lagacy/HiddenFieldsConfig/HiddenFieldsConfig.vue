<template>
  <slot name="default" :setup="handleSetup"></slot>
  <hidden-fields-config-modal
      v-model="visible" :title="title"
      :fields="fieldsConfig" @update:fields="handleSave"
      :all-fields="allFields"/>
</template>

<script>
import {PageConfigStore} from '../../../app/services/PageConfigStore';
import HiddenFieldsConfigModal from './HiddenFieldsConfigModal.vue';
import {without} from 'lodash/array';

export default {
  name: 'HiddenFieldsConfig',
  components: {HiddenFieldsConfigModal},
  emits: ['update:fields'],
  props: {
    title: {type: String, default: '页面配置'},
    // targetId
    id: {type: String, required: true},
    // switch show or hidden
    modelValue: {type: Boolean},
    // {key:string,label:string}[]
    allFields: {type: Array},
  },
  data() {
    return {
      store: new PageConfigStore(this.id),
      hiddenFields: [],
      fieldsConfig: [],
      visible: false,
    };
  },
  async mounted() {
    await this.resetModal();
    this.refreshFields(this.hiddenFields);
  },

  watch: {
    key() {
      console.error('config component cannot change key...');
      document.body.innerHTML = '';
    },
  },
  methods: {
    refreshFields(hiddenFields = this.hiddenFields) {
      let fields = without(this.allFields.map(x => x.key), ...hiddenFields);
      this.$emit('update:fields', fields);
    },
    async handleSetup() {
      this.visible = true;
      this.hiddenFields = await this.store.getHiddenList();
      this.fieldsConfig = without(this.allFields.map(x => x.key), ...this.hiddenFields);
    },
    async handleSave(fields) {
      let list = without(this.allFields.map(x => x.key), ...fields);
      this.$emit('update:fields', fields);
      await this.store.setHiddenList(list);
      return this.resetModal();
    },
    async resetModal() {
      this.visible = false;
      this.fieldsConfig = [];
      this.hiddenFields = await this.store.getHiddenList();
    },
  },
};
</script>

<style scoped>

</style>
