export interface IToolbarConfigDef {
  /**
   * 导出
   * 传字符串时表示权限点，有权限则显示
   * 传true时表示始终显示，传false时表示始终不显示
   */
  download: string | boolean;
  sort: {
    orderBy: string;
    order: string;
    properties: { label: string, value: string }[]
  } | false;
}

/**
 * 创建一个空的ToolbarConfig
 * @returns {{download: string, sort: {orderBy: string, properties: any[], order: string}}}
 */
export function createToolbarConfig(): IToolbarConfigDef {
  return {
    download: false,
    sort: false,
  };
}
