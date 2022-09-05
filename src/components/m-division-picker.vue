<template>
  <el-cascader
      v-model="data" style="width: 177px;"
      :options="options.cascaderData" :props="{checkStrictly:true}"></el-cascader>
</template>

<script>
import {useDivision} from '../app/services/division';
import {computed} from 'vue';
import {sleep} from '../utils/sleep';

export default {
  name: 'm-division-picker',
  props: {
    country: [Number, String],
    province: [Number, String],
    city: [Number, String],
  },
  setup(props, {emit}) {

    return {
      data: computed({
        get: () => {
          const {country, province, city} = props;
          if (props.country) {
            return [country, province, city].filter(x => x);
          } else {
            return null;
          }
        },
        set: ([country, province, city]) => {
          emit('update:country', country);
          emit('update:province', province);
          emit('update:city', city);
          (async () => {
            await sleep();
            emit('update:all', [country, province, city]);
          })();
        },
      }),
      options: useDivision(),
    };
  },
};
</script>

<style scoped>

</style>
