export interface QueryFieldConfig {
  name: string
  name2?: string
  title: string
  defaultValue?: any
  defaultValue2?: any
  description: string
  intentType: string
  intentFormat?: string[]
  viewType: string
  viewFormat?: string[]
  options: Array<{ value: string | number, label: string }>
}

export function useQueryConfig(fieldConfigs: QueryFieldConfig[]) {
  return {
    formFields: fieldConfigs.filter(x => x.viewType !== 'hidden'),
    createEmptyEntity: () => {
      return fieldConfigs.reduce((acc, next) => {
        let result = {
          ...acc,
          [next.name]: next.defaultValue ?? null,
        };
        if (next.name2) {
          result[next.name2] = next.defaultValue2 ?? null;
        }
        return result;
      }, {});
    },
  };
}
