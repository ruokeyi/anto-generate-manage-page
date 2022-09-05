export const Buttons = [
  { key: 'button', name: '按钮', area: 'func' },
  {key:'inputNumber',name:'数字输入框', area: 'dialog'},
  {key:'textarea',name:'文本输入框', area: 'dialog'},
  { key: 'pager', name: '分页', area: 'dialog' },
  { key: 'input', name: '输入框', area: 'all' },
  { key: 'select', name: '下拉框', area: 'all' },
  { key: 'datetimerange', name: '日期时间范围选择器', area: 'toolbar' },
  { key: 'date', name: '日期时间选择器', area: 'dialog' },
  {key:'component',name:'自定义组件', area: 'dialog'},
  {key:'html',name:'html', area: 'dialog'},
]
// 数据表格基本配置参数
export const BASIC_PROPS = {
  authPoint: {
    type: 'String',
    required: true,
    label: '权限点',
  },
  exportAuthKey: {
    type: 'String',
    label: '导出功能的权限点',
  },
  pageTitle: {
    type: 'String',
    required: true,
    label: '页面名称',
  },
}
export const NECESSARY_CONFIG_PROPS = {
  dialogConf: {
    type: 'Object',
    default: {
      title: 'demo对话框名称',
      labelWidth: '100px',
      dialogWidth: '680px',
      idKey: 'demo_id',
      items: [],
      rules: {}
    },
    label: '默认对话框的配置',
  },
  toolbarConf: {
    type: 'Array',
    label: '筛选项配置',
  },
  listItems: {
    type: 'Array',
    label: '表格/卡片的配置',
  },
  topOperation: {
    type: 'Array',
    label: '顶部功能按钮组',
  },
  operation: {
    type: 'Array',
    default: [
      {
        key: "edit",
        label: "编辑",
        type: "icon",
        confirmText: null,
        format_params: null,
        auth_key: null,
      },
      {
        key: "view",
        label: "查看",
        type: "icon",
        confirmText: null,
        format_params: null,
        auth_key: null,
      },
      {
        key: "delete",
        label: "删除",
        type: "icon",
        confirmText: null,
        format_params: null,
        auth_key: null,
      },
    ],
    label: '表格/卡片内部操作栏',
  },
  idKey: {
    type: 'String',
    default: 'id',
    label: '对应记录的唯一索引名称，一般为id',
  },
  title: {
    type: 'String',
    default: 'id',
    label: '对应记录的唯一索引名称，一般为id',
  }
}
export const CONFIG_PROPS = {
  cardRowSpan: {
    type: 'Number',
    default: 2,
    label: '每行排列的卡片数量',
  },
  toolbarRowSpan: {
    type: 'Number',
    default: 4,
    label: '筛选项的布局（每行4个）',
  },
  cardItemRowSpan: {
    type: 'Number',
    default: 4,
    label: '卡片中每行展现的item数量',
  },
  dialogComponent: {
    type: 'Object',
    default: null,
    label: '新建对话框组件',
  },
  updateDialogomponent: {
    type: 'Object',
    default: null,
    label: '更新功能的对话框组件',
  },
  tableComponent: {
    type: 'Object',
    default: null,
    label: 'table组件',
  },
  itemComponent: {
    type: 'Object',
    default: null,
    label: '每条数据呈现的组件（卡片应用）',
  },
  listRender: {
    type: 'Object',
    label: '列表数据处理render',
  },
  detailPage: {
    type: 'Object',
    default: { flag: false, requestDetail: false },
    label: '详情页展示形式',
  },
}
export const API_PROPS = {
  getListApi: {
    type: 'String',
    label: '获取列表API',
  },
  createApi: {
    type: 'String',
    label: '新建API',
  },
  viewApi: {
    type: 'String',
    label: '查看详情API',
  },
  updateApi: {
    type: 'String',
    label: '更新API',
  },
  deleteApi: {
    type: 'String',
    label: '删除API',
  },
  exportListApi: {
    type: 'String',
    default: null,
    label: '导出API',
  },
  exportFormat: {
    type: 'String',
    default: "excel",
    label: '导出数据格式',
  },
  importListApi: {
    type: 'String',
    label: '导入API',
  },
  mockId: {
    type: 'Number',
    label: 'mock数据ID',
  },
  psKey: {
    type: 'String',
    default: "page_size",
    label: '接口页面大小字段',
  },
  pnKey: {
    type: 'String',
    default: "page",
    label: '接口页码字段',
  },
  pageSizes: {
    type: 'Array',
    default: [10, 20, 30, 50, 100],
    label: '分页选项',
  }
}
export const toolbarParamsDemo = `[
  {
    type: 'input',
    label: '名称',
    placeholder: "mid或昵称搜索",
    key: 'up_filter',
    width: '300px',
    value: '',
  },
  {
    type: 'select',
    label: '等级',
    key: 'event_level',
    value: '',
    width: '300px',
    multiple: true,
    inRender: (v) => {
      if (v.length <= 0) {
        return []
      }
      return v.split(',')
    },
    outRender: (v) => {
      return v?.join(',')
    },
    options: [
      { label: '全部', value: 0 },
      { label: 'S+', value: 1 },
      { label: 'S', value: 2 },
      { label: 'A', value: 3 },
      { label: 'B', value: 4 },
    ]
  }
]`;
export const listItemParamsDemo = `[{
      type: 'component',
      label: '基本信息',
      key: 'name',
      width:'500px',
      render:(row)=>{
        return <UpBasicInfo row={row}
         ></UpBasicInfo>
      },
    },
    {
      type: 'text',
      label: '名称',
      key: 'name',
      width:'150px',
    },]`;
export const dialogParamsDemo = ` {
  title: 'demo对话框名称',
  labelWidth:'100px',
  dialogWidth:'680px',
  idKey:'demo_id',
  items:[
  {
    type: 'input',
    label: '名称',
    key: 'name',
    value: '',
    palceholder: '',
    maxlength: 100,
    options: null,
  }
],
rules: {
  name: [
    { required: true, trigger: "blur", message: "请填写名称" },
    { max: 100, trigger: "blur", message: "最多填写100字符" },
  ]
}}`;
export const topOperationDemo = `[
    { key: 'createItem', label: '新建', button_type: 'primary', init: 'openCreate' },
    {key: 'importList', label: '导入评级', button_type: 'success', auth_key: 'crm_rank', componentRender: ()=>{
      return LevelBatchAdd}}
  ]`;
export const operationKeyOptions = ['edit', 'view', 'delete']
