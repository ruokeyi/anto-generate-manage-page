<template>
  <el-form-item
      v-if="!viewTypeOf('hidden')"
      label-width="125px"
      :label="inTop?null:fieldOptions.title||fieldOptions.name" :prop="fieldOptions.name">

    <!--mid输入-->
    <template v-if="viewTypeOf('mid')">
      <xn-mid-input :modelValue="modelValue||null" @update:modelValue="update('modelValue',$event)"
                    @keypress.enter.prevent="handleToolbarSearch()"/>
    </template>

    <!--文本输入-->
    <template v-else-if="viewTypeOf('input')">
      <el-input
          :style="{width}"
          :placeholder="placeholder??fieldOptions.placeholder??(inTop?(fieldOptions.title||fieldOptions.name):null)"
          :modelValue="modelValue||null" @update:modelValue="update('modelValue',$event)"
          @keypress.enter.prevent="handleToolbarSearch()"
      />
    </template>

    <!--TEXT文本输入-->
    <template v-else-if="viewTypeOf('expandInput')">
      <el-input
          type="textarea"
          class="textarea-search"
          :style="{width}"
          :placeholder="placeholder??fieldOptions.placeholder??(inTop?(fieldOptions.title||fieldOptions.name):null)"
          :modelValue="modelValue||null" @update:modelValue="update('modelValue',$event)"
          @blur="handleToolbarSearch"
      />
    </template>

    <!--数字区间-->
    <template v-else-if="viewTypeOf('range')&&['number','integer'].includes(fieldOptions.dataType)">
      <m-number-range
        :modelValue="modelValue"
        :value2="value2"
        @update:modelValue="update('modelValue',$event)"
        @update:value2="update('value2',$event)"
        @update-all="handleToolbarSearch()"
        ></m-number-range>
    </template>

    <!--日期区间-->
    <template v-else-if="viewTypeOf(['date_range'])&&['number','integer'].includes(fieldOptions.dataType)">
      <div style="width: 500px">
        <el-date-picker
            type="daterange"
            :modelValue="datepickerValue"
            @update:modelValue="handleDatepickerUpdate"
        ></el-date-picker>
      </div>
    </template>

    <!--分区选择-->
    <template v-else-if="viewTypeOf('categories')">
      <m-category-picker
          :modelValue="modelValue"
          :value2="value2"
          :fieldOptions="fieldOptions"
          @update:modelValue="update('modelValue',$event)"
          @update:value2="update('value2',$event)"
          @update-all="handleToolbarSearch()"
      />
    </template>

    <!--选择-->
    <template v-else-if="viewTypeOf(['select'])">
      <el-select
          placeholder="请选择"
          :model-value="modelValue"
          @update:modelValue="update('modelValue',$event)"
          @change="handleToolbarSearch()"
          style="width: 177px;"
          :multiple="fieldOptions.viewFormat.includes('multiple')"
          :filterable="fieldOptions.viewFormat.includes('filterable')"
          :collapse-tags="fieldOptions.viewFormat.includes('collapse-tags')"
      >
        <el-option v-for="item of (context&&context.options)||fieldOptions.options||[]" :key="item.value"
                   :value="item.value" :label="item.label"/>
      </el-select>
    </template>

    <!--单选组-->
    <template v-else-if="viewTypeOf(['radioGroup'])">
      <el-radio-group
          placeholder="请选择"
          :model-value="modelValue"
          @update:modelValue="update('modelValue',$event)"
          @change="handleToolbarSearch()"
          :style="{width: radioGroupWidth }">
        <el-radio v-for="item of (context&&context.options)||fieldOptions.options||[]" :key="item.value"
                  :label="item.value">{{ item.label }}
        </el-radio>
      </el-radio-group>
    </template>

    <!--地区选择-->
    <template v-else-if="viewTypeOf(['divisionPicker'])">
      <m-division-picker
          :country="modelValue" @update:country="update('modelValue',$event)"
          :province="value2" @update:province="update('value2',$event)"
          :city="value3" @update:city="update('value3',$event)"
          @update:all="handleToolbarSearch"
      />
    </template>

  </el-form-item>
</template>

<script>

import XnMidInput from './xn-mid-input.vue';
import MCategoryPicker from '../../m-category-picker.vue';
import {computed, inject} from 'vue';
import {sleep} from '../../../utils/sleep';
import moment from 'moment';
import MDivisionPicker from '../../m-division-picker.vue';
import {XnToolbarContextKey} from './constants.xn-toolbar';
import MNumberRange from '../../m-number-range.vue'

let allTypes = [String, Number, Object, Boolean, Array];
export default {
  name: 'xn-toolbar-field',
  components: {
    MDivisionPicker, MCategoryPicker, XnMidInput, MNumberRange
  },
  props: {
    inTop: {type: Boolean},
    modelValue: {type: allTypes},
    value2: {type: allTypes},
    value3: {type: allTypes},
    context: {type: Object},
    placeholder: {type: String},
    config: {type: Object, default: () => ({})},
    name: {type: String, default: null},
    title: {type: String, default: null},
    dataType: {type: String, default: null},
    dataFormat: {type: String, default: null},
    intentType: {type: String, default: null},
    intentFormat: {type: Array, default: null},
    viewType: {type: String, default: null},
    viewFormat: {type: Array, default: null},
    options: {type: Array, default: null},

    rangeDefaultValues: {
      type: Array, default: [
        {title: '<5k', value: [null, 4999]},
        {title: '5k ~ 1w', value: [5000, 9999]},
        {title: '1w ~ 10w', value: [10000, 99999]},
        {title: '10w ~ 50w', value: [100000, 499999]},
        {title: '50w ~ 100w', value: [500000, 999999]},
        {title: '100w+', value: [1000000, null]},
      ],
    },
    width: {type: String},
    radioGroupWidth: {type: String, default: '500px'}
  },
  setup(props) {
    const toolbarContext = inject(XnToolbarContextKey);
    // console.log(toolbarContext);
    const fieldOptions = computed(() => {
      return {
        ...props.config,
        dataType: props.dataType ?? props.config.dataType,
        dataFormat: props.dataFormat ?? props.config.dataFormat,
        intentType: props.intentType ?? props.config.intentType,
        intentFormat: props.intentFormat ?? props.config.intentFormat,
        viewType: props.viewType ?? props.config.viewType,
        viewFormat: props.viewFormat ?? props.config.viewFormat ?? [],
        name: props.name ?? props.config.name,
        title: props.title ?? props.config.title,
        placeholder: props.placeholder ?? props.config.placeholder,
        options: props.options ?? props.config.options,
      };
    });
    return {
      toolbarContext,
      fieldOptions,
    };
  },

  methods: {
    doNothing() {
      console.log('do nothing');
    },
    viewTypeOf(viewTypes) {
      return [].concat(viewTypes).includes(this.fieldOptions.viewType);
    },
    update(key, eventValue, type) {
      let value = eventValue;
      if (type === 'number') {
        if (!['-', '', null, '0'].includes(value)) {
          value = value - 0;
          if (this.fieldOptions.dataType === 'integer') {
            value = Math.floor(value);
          }
        }
        if (value !== value || value >= Number.MAX_SAFE_INTEGER) {
          return;
        }
        if (this.fieldOptions.dataType !== 'integer' && eventValue[eventValue.length - 1] === '.') {
          value = eventValue;
        }
      }
      this.$emit(`update:${key}`, value);
    },
    handleToolbarSearch() {
      this.toolbarContext.handleSearch();
    },
    handleUpdateTextSearch(eventValue) {
      const transValue = eventValue.split('\n').join(',')
      this.update('modelValue',transValue)
    },
    async handleDatepickerUpdate(value) {
      const [start, end] = value ?? [];
      if (!start && !end) {
        this.update('modelValue', null);
        this.update('value2', null);
      } else {
        this.update('modelValue', moment(start).unix());
        this.update('value2', moment(end).add(1, 'day').unix());
      }
      if (this.toolbarContext?.handleSearch) {
        // 虽然实际上并不必要，但保险起见，等待vue更新数据再触发刷新
        await sleep(0);
        this.handleToolbarSearch();
      }
    },
  },
  computed: {
    datepickerValue() {
      if (this.modelValue && this.value2) {
        return [
          moment.unix(this.modelValue).toDate(),
          moment.unix(this.value2).subtract(1, 'day').toDate(),
        ];
      } else {
        return null;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.textarea-search > ::v-deep textarea {
  height: 28px;
  transition: height .2s;
  &:focus {
    height: 56px;
  }
}
</style>

