<template>
  <el-form class="xn-toolbar" size="small" :model="formData" inline
           label-position="right" label-width="110px" label-suffix="："
           @submit.native.prevent>
    <div class="xn-toolbar-buttons" v-if="!noTopBar">
      <div class="custom-buttons">
        <slot key="buttons" name="buttons"/>
      </div>
      <div class="top-fields">
        <slot v-for="field of visibleFields" :key="field.name"
              :name="`field_top_${field.name}`"
              :config="field" :formData="formData" :toolbar="toolbarContext"
        />
      </div>
      <!--工具栏右上方通用按钮组-->
      <div style="display: flex;align-items: center;">
        <xn-toolbar-button @click="hideSearch=!hideSearch">
          <i class="el-icon-arrow-down" v-if="hideSearch"/>
          <i class="el-icon-arrow-up" v-else/>
        </xn-toolbar-button>
        <div class="xn-toolbar-buttons-separator" style="margin-right: 5px;"></div>

        <!--筛选-->
        <template v-if="sortable">
          <el-select size="small" style="width: 120px;" placeholder="排序字段"
                     :model-value="data?.[orderBy]??formData?.[orderBy]??null"
                     @update:modelValue="sortChange($event, undefined)">
            <template v-if="sortableProperties&&sortableProperties.length>0">
              <el-option v-for="item of sortableProperties" :key="item.value" :value="item.value" :label="item.label"/>
            </template>
            <template v-else>
              <el-option v-for="item of visibleFields" :key="item.name" :value="item.name" :label="item.title"/>
            </template>
          </el-select>
          <xn-toolbar-button title="排序方式" size="small" @click="sortChange(undefined, 'next')">
            <i class="el-icon-sort" v-if="['',null].includes(formData[order])"/>
            <i class="el-icon-sort-down" v-else-if="['desc','DESC'].includes(formData[order])"/>
            <i class="el-icon-sort-up" v-else-if="['asc','ASC'].includes(formData[order])"/>
          </xn-toolbar-button>
          <div class="xn-toolbar-buttons-separator"></div>
        </template>

        <!--设置-->
        <xn-toolbar-button
            v-if="config" title="配置筛选项"
            size="small" @click="openConfigDialog">
          <i class="el-icon-setting"/>
        </xn-toolbar-button>
        <div class="xn-toolbar-buttons-separator"></div>

        <!--搜索、刷新、下载（导出）-->
        <template v-if="basicButtons">
          <xn-toolbar-button
              v-if="clear" title="重置表单"
              @click="handleClear"
              size="small">
            <i class="el-icon-refresh-left"/>
          </xn-toolbar-button>
          <xn-toolbar-button
              v-if="download" title="导出"
              @click="handleDownload"
              size="small">
            <i class="el-icon-download"/>
          </xn-toolbar-button>
          <button
              @click="handleUpdate"
              class="el-button XnToolbar__SearchButton">
            <i class="el-icon-search"/>
          </button>
        </template>
      </div>
    </div>
    <div class="xn-toolbar-search" v-show="!hideSearch">
      <div v-for="(row) of visibleFieldsSlice">
        <template v-for="field of row">
          <template v-if="field.auth?hasPermission(field.auth):true">
            <slot :key="field.name" v-if="field.viewType==='custom'"
                  :name="`field_${field.name}`"
                  :config="field"
                  :toolbar="toolbarContext"
                  :formData="formData"
            />
            <span :key="field.name" v-else-if="field.viewType==='hidden'"
                  style="display:none;"></span>
            <slot :key="field.name" v-else
                  :name="`field_${field.name}`"
                  :config="field"
                  :toolbar="toolbarContext"
                  :formData="formData"
            />
          </template>
        </template>
      </div>
    </div>
  </el-form>
  <el-dialog title="筛选配置" width="600px" v-model="configDialog.visible">
    <el-checkbox-group v-if="fieldsConfig" v-model="configDialog.checked">
      <el-checkbox v-for="item of fieldsConfig.filter(x=>x.viewType!=='hidden'&&(x.auth?hasPermission(x.auth):true))"
                   :key="item.name" :label="item.name">
        <div style="width: 132px;">{{ item.title }}</div>
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="info" size="small" @click="closeConfigDialog">关闭</el-button>
      <el-button type="primary" size="small" @click="saveConfig">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import XnToolbarButton from './xn-toolbar-button.vue';
import {computed, defineComponent, provide, reactive, ref} from 'vue';
import {useQueryConfig} from '@/app/services/xnDefTools/useQueryConfig';
import {pageConfigStorage} from '@/app/services/localStorage';
import {useAuthData} from '@/app/services/auth/auth.provider';
import {XnToolbarContextKey} from './constants.xn-toolbar';
import { chunk } from 'lodash';


export const ToolbarButton = XnToolbarButton;

export default defineComponent({
  name: 'xn-toolbar',
  components: {XnToolbarButton},
  emits: ['download', 'update:data'],
  props: {
    // 唯一键
    componentKey: {type: String, required: true},


    // 绑定的搜索表单数据
    data: Object,
    extraData: Object,
    fieldsConfig: {type: Array, required: true},
    hiddenFieldsDefault: {type: Array, default: () => []},

    // 通用事件命名&参数配置
    search: {type: [String], default: 'search'},
    clear: {type: [String], default: 'clear'},
    download: {type: [String], default: 'download'},
    orderBy: {type: [String], default: 'order'},
    order: {type: [String], default: 'sort'},
    sortableProperties: {type: [Array], default: () => []},
    config: {type: [String], default: 'config'},
    noTopBar: {type: Boolean, default: false},
    rowItemNum: { type: Number, default: 4 },
  },

  setup(props, context) {
    const componentKey = props.componentKey;
    const queryConfigR = computed(() => useQueryConfig(props.fieldsConfig));
    const hiddenFieldsR = ref(props.hiddenFieldsDefault);
    let formDataR = ref(queryConfigR.value?.createEmptyEntity() ?? {});
    (async () => {
      const {hiddenFields} = (await pageConfigStorage.getItem(`XnToolbarConfig:${componentKey}`)) || {};
      console.log('hiddenFields:'+hiddenFields)
      if (hiddenFields) {
        hiddenFieldsR.value = hiddenFields;
      }
    })();
    const visibleFieldsR = computed(() => {
      const {formFields} = queryConfigR.value;
      return formFields?.filter(x => !hiddenFieldsR.value.includes(x.name));
    });
    const visibleFieldsSlice =  computed(() => {
      return chunk(visibleFieldsR.value, props.rowItemNum)
    });
    let toolbarContext = reactive({
      handleSearch() {
        context.emit('update:data', formDataR.value);
      },
    });
    provide(XnToolbarContextKey, toolbarContext);

    return {
      toolbarContext,
      hideSearch: ref(false),
      sortable: computed(() => (props.order != null) && props.orderBy),
      basicButtons: computed(() => props.search || props.clear || props.download),
      visibleFields: visibleFieldsR,
      hiddenFields: hiddenFieldsR,
      visibleFieldsSlice: visibleFieldsSlice,
      formData: formDataR,
      hasPermission: useAuthData().hasPermission,
      handleClear() {
        let emptyFormData = queryConfigR.value?.createEmptyEntity() ?? {};
        formDataR.value = emptyFormData;
        context.emit('update:data', emptyFormData);
      },
      sortChange(orderBy = formDataR.value[props.orderBy], order = formDataR.value[props.order]) {
        formDataR.value[props.orderBy] = orderBy;
        if (order === 'next') {
          order = ({
            asc: 'desc',
            desc: '',
          }[formDataR.value[props.order]]) ?? 'asc';
        }
        formDataR.value[props.order] = order;
        context.emit('update:data', formDataR.value);
      },
      configDialog: ref({
        visible: false,
        checked: [],
      }),
    };
  },
  methods: {
    handleDownload() {
      this.$emit('download')
    },
    closeConfigDialog() {
      this.configDialog.visible = false;
    },
    openConfigDialog() {
      this.configDialog.visible = true;
      this.configDialog.checked = [...this.visibleFields.map(x => x.name)];
    },
    saveConfig() {
      let hiddenFields = this.fieldsConfig.map(x => x.name)
          .filter(x => !this.configDialog.checked.includes(x));
      pageConfigStorage.setItem(`XnToolbarConfig:${this.componentKey}`, {hiddenFields});
      this.hiddenFields = hiddenFields;
      this.closeConfigDialog();
    },
    handleUpdate() {
      if(!this.enter) {
        this.$emit('update:data', {...this.formData});
      }
    },
  },
});


</script>

<style lang="stylus" scoped>
.xn-toolbar {
  /*background: var(--theme-color--crm-darken1);*/
  display: flex;
  //background: lighten(rgb(43, 92, 154), 55);
  background: #f7f8f9;
  flex-direction: column;
  box-shadow 0 0 4px rgba(0, 0, 0, 0.2)
  position: relative
  z-index: 123
}

.xn-toolbar-buttons {
  display: flex;
  align-items: stretch;
  width: 100%
  height: 34px
  box-shadow 0 0 4px rgba(0, 0, 0, 0.2)
  z-index: 1
}

.custom-buttons {
  display: flex;
}

.top-fields {
  display: inline-flex
  flex: 1
  align-items: right

  ::v-deep(& > div) {
    margin-bottom: 0 !important

    &:first-child {
      margin-left: 8px
    }


    & .el-form-item__label {
      width auto !important
    }
  }
}

.xn-toolbar-buttons-separator {
  border-left: 1px solid rgba(0, 0, 0, 0.1)
  margin: 6px 0
  align-self stretch;
  //justify-content: stretch;
}

.xn-toolbar-search {
  display: flex;
  flex-direction: column;
  padding: 0 4px
  padding-top: 20px
  background-color: #f6f6f6;
}

.XnToolbar__SearchButton {
  position: relative
  //top: 2px
  //right: 2px
  margin-left: 8px
  background: rgba(0, 0, 0, 0.1)
  color var(--theme-color--crm:#2b5c9a)
  width: 32px
  min-width: 32px
  height: 32px
  min-height: 32px
  display: flex
  justify-content: center
  align-items: center
  z-index: 123
  border: 0
  border-radius 0
  border-top-left-radius 16px
  border-bottom-left-radius 16px
  padding-left: 18px
  padding-right: 24px


  &:hover {
    background: rgba(0, 0, 0, 0.15)
    color white
  }

  i {
    font-size: 18px
  }
}

</style>
