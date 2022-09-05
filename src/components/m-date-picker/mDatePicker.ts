import {defineComponent, h, ref, computed} from 'vue';
import moment, {Moment} from 'moment';
import {DatePicker} from 'ant-design-vue';

export const mDatePicker = defineComponent({
  name: 'mDatePicker',
  props: {
    value: [Number, String, moment],
    dataFormat: {type: String, default: 'timestamp'},
  },
  setup(props, context) {
    let valR = ref(props.value as any);
    switch (props.dataFormat) {
      case 'timestamp':
        valR = computed({
          get() {
            if (typeof props.value === 'number') {
              return moment.unix(props.value);
            } else if (props.value) {
              return props.value;
            } else {
              return null;
            }
          },
          set(time: Moment | null | string) {
            if (time) {
              if (typeof time === 'string') {
                context.emit('update:value', time);
              } else {
                context.emit('update:value', time && time.unix());
              }
            } else {
              context.emit('update:value', null);
            }
          },
        });
        break;
    }
    return {
      val: valR,
      props,
      attrs: context.attrs,
    };
  },
  render() {
    return h(
      DatePicker,
      {
        ...this.props,
        ...this.attrs,
        value: this.val,
        'onUpdate:value': (val) => {
          switch (this.dataFormat) {
            case 'timestamp':
              return this.$emit('update:value', val && val.unix());
            default:
              return this.$emit('update:value', val);
          }
        },
      },
      this.$slots,
    );
  },
});
