import moment from "moment";
export const mockId = false
export const toolbarParams = [
  {
    type: 'input',
    label: '任务名称',
    key: 'name',
    width:'250px',
    value: '',
  },
  {
    type: 'select',
    label: '任务类型',
    key: 'task_type',
    value: '',
    multiple:true,
    inRender:(v)=>{
      if(v.length<=0){
        return []
      }
      return v.split(',')
    },
    outRender:(v)=>{
      return v.join(',')
    },
    options: [
      { label: '跑批', key: 'batch' },
      { label: '实时', key: 'online' },
    ]
  },
  {
    type: 'datetimerange',
    label: '起止时间',
    key: 'daterange',
    value: '',
  },
]
export const dialogParams = {
  title: '导入群ID',
  labelWidth:'80px',
  dialogWidth:'700px',
  items:[
  {
    type: 'input',
    label: '任务名称',
    key: 'name',
    value: '',
    palceholder: '',
    maxlength: 50,
    options: null,
  },
  {
    type: 'select',
    label: '任务类型',
    multiple:true,
    key: 'task_type',
    value: '',
    render: (v) => {
      return v.split('\n')
    },
    options: [
      { label: '跑批', key: 'batch' },
      { label: '实时', key: 'online' },
    ]
  },
  {
    type: 'date',
    label: '开始时间',
    key: 'start_time',
    render: (v) => {
      return moment(v).unix()
    },
    value: '',
  },
  {
    type: 'date',
    label: '结束时间',
    key: 'end_time',
    render: (v) => {
      return moment(v).unix()
    },
    value: '',
  },
],
rules: {
  name: [
    { required: true, trigger: "blur", message: "请填写任务名称" },
  ],
}}
export const dataConfPaint = {
  title: {type:'text',key:'name'}, 
  mergeRow:'name',
  items: [
    {
      type: 'text',
      label: '任务名称',
      key: 'name',
    },
    {
      type: 'tag',
      label: '任务类型',
      key: 'task_type',
      map: {
        'batch': { label: '跑批', tag: 'success' },
        'online': { label: '实时', tag: 'primary' },
      }
    },
    {
      type: 'date',
      label: '开始时间',
      key: 'start_time',
    },
    {
      type: 'date',
      label: '结束时间',
      key: 'end_time',
    },
  ],
  operation:[
    {key:'edit',label:'编辑',type:'icon'},
    {key:'view',label:'查看',type:'text'},
    {key:'delete',label:'删除',type:'icon'}
  ],
  topOperation:[
    {key:'createItem',label:'新建',button_type:'primary'},
    {key:'importList',label:'导入',button_type:'success'},
  ],
  pager:{
    page: 1,
    page_size: 20,
    total: 0,
  }
}