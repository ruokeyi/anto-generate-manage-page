@name: crm列表场景框架组件 
@desc: 在crm的业务发展中，存在一部分业务需求，包括了列表数据展示、筛选、新增、修改及导出的整套操作，本组件在满足crm-next UI要求的前提下，总结了实现该类业务场景的代码框架，使用者无需关心整体样式搭配，只需要复制整个组件结构到对应的目录下，补充表格字段展示、筛选项具体内容、以及实际情况下的操作按钮。
### props:

 -   authPoint: { //页面权限点
      type: String,
      required: true,
    },
  -  pageTitle: { //页面导航名称
      type: String,
      required: true,
    },
 -   isTable: { // true-列表为表格，false-卡片
      type: Boolean,
      default: true,
    },
 -   dialogConf: { // 弹出框配置，这里需要dialogComponent为null
      type: Object,
    },
 -   toolbarConf: { // 筛选项配置
      type: Array,
    },
  -  listConf: { // 列表项配置
      type: Object,
    },
  -  cardRowSpan: { //卡片布局，一行展示的卡片数量，该配置项需要isTable=false
      type: Number,
      default: 2,
    },
  -  toolbarRowSpan: { ////筛选项行布局,一行展示几项
      type: Number,
      default: 4,
    },
 -   dialogComponent: { //自定义弹框组件
      type: Object,
      default: null,
    },
 -   listRender:{ // 函数对象{cb:()=>{}},统一处理列表数据的方法
      type: Object
    },
 -   detailPage:{ //记录详情页，若flag=true，代表表格中的查看和编辑页面不是弹出框，而是打开新页面，这里这里默认路由为`${列表url}/detail`
      type:Object,
      default:{flag:false}
    },
 -   getListApi: { //列表接口api
      type: String,
    },
 -   createApi: { //新建记录api
      type: String,
    },
 -   viewApi: { //查看记录api
      type: String,
    },
 -   updateApi: { //更新记录api
      type: String,
    },
 -   deleteApi: { //删除记录api
      type: String,
    },
 -   exportListApi: { //导出列表记录api
      type: String,
    },
 -   importListApi: { //导入api
      type: String,
    },
 - mockId:{ //bapi mock数据
   type:Number
 }