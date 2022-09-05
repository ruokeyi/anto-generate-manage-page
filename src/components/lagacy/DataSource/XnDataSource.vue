<template>

</template>

<script>
import {defineComponent, watchEffect} from 'vue';
import {http} from '../../../app/services/http/http';
import qs from 'qs';
import {sleep} from '../../../utils/sleep';
import {debounce} from 'lodash';

export default defineComponent({
  name: 'XnDataSource',
  props: {
    modelValue: {type: Object},
    status: {type: String},
    targetFieldName: String,
    defaultValue: {type: Object, default: {}},
    url: {type: String, required: true},
    query: {type: Object},
    pager: {type: Object, default: {}},
    exportFiledName: {type: String, default: 'exports'},
    totalFieldName: String,
    total: Number,
    sendSign: Number,
  },
  setup(props, {emit}) {

    let refresh = debounce(async function refresh(config, exportMode = false) {
      if (exportMode) {
        let string = qs.stringify({...config, [props.exportFiledName]: 'csv'});
        let url = `${location.protocol}//${http.defaults.baseURL}${props.url}?${string}`;
        window.open(url);
      } else {
        const {data, code} = await http.get(props.url, {params: config});
        if (code !== 0) {
          props.status = 'error';
          emit('update:modelValue', []);
        } else {
          emit(
              'update:modelValue',
              [
                props.targetFieldName,
                'list',
                'result',
              ].reduce((acc, next) => {
                if (acc) return acc;
                return data[next];
              }, null) ?? [],
          );
          emit(
              'update:total',
              [props.totalFieldName, 'total', 'total_count'].reduce((acc, next) => {
                if (acc) return acc;
                return data[next];
              }, null) ?? 0,
          );
        }
      }
    }, 200);


    watchEffect(async () => {
      let config = {...props.query, ...props.pager};
      let sign = props.sendSign;
      await sleep();
      await refresh(config);
    });
    refresh({...props.query, ...props.pager});
    return {
      download() {
        refresh({...props.query, ...props.pager}, true);
      },
    };
  },
});
</script>

<style scoped>

</style>
