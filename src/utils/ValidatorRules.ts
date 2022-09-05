export type ValidatorRule = (msg: string, options?: any) => any
export const validatorRules = {
  required: ((msg: string, options = {trigger: 'blur'}) => ({
    required: true,
    message: msg,
    ...options,
  })) as ValidatorRule,
};
