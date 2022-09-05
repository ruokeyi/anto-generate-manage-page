import { ref, reactive } from 'vue';
import { http } from '@/app/services/http/http';

let categories = reactive({
  main: {},
  sub: {},
  all: {},
  tree: {},
  cascaderData: [] as any[]
});

/***
 *
 * @param isV2
 * @param allowedFirstCategoryList 允许有二级标签的 一级标签列表
 * @param oConfig 其他配置信息
 */
export function useCategories(isV2 = true, allowedFirstCategoryList, oConfig) {
  const setTree = (treeData) => {
    categories.tree = treeData;
    categories.cascaderData = [];
    for (let item of treeData) {
      const { id, name, children } = item;
      categories.main[name] = id;
      categories.all[name] = id;
      categories.main[id] = name;
      categories.all[id] = name;
      if (!allowedFirstCategoryList || (allowedFirstCategoryList && allowedFirstCategoryList.includes(name))) {
        categories.cascaderData.push({
          value: id,
          label: name,
          children: children && children.map(({ id, name }) => ({ value: id, label: name })),
        });
        for (let child of children || []) {
          const { id, name } = child;
          categories.sub[name] = id;
          categories.all[name] = id;
          categories.sub[id] = name;
          categories.all[id] = name;
        }
      } else {
        categories.cascaderData.push({
          value: id,
          label: name
        });
      }
    }
  }
  const v1Init = async () => {
    const url = '/x/admin/rating/category?ctype=1'
    const { data } = await http.get(url);
    setTree(data)
  }

  const v2Init = async () => {
    const url = '/x/admin/uper/auth/category/all?biz_type=0'
    const { data } = await http.get(url);
    // convert v2 tree to v1 tree
    const videoCates = data.video
    let tree = [] as any[]

    videoCates.sort((a, b) => a.id - b.id)
    videoCates.forEach(item => {
      let treeItem = {
        id: item.id,
        name: item.name,
        children: [] as any[]
      } as any
      if (item.second_cate && !oConfig?.onlyFirstCategory) {
        // oConfig?.onlyFirstCategory 仅展示一级分区
        item.second_cate.sort((a, b) => a.id - b.id)
        item.second_cate.forEach(secItem => {
          treeItem.children.push({
            id: secItem.id,
            name: secItem.name
          })
        })
      }
      tree.push(treeItem)
      if (!treeItem.children.length) {
        delete treeItem.children
      }
    });
    setTree(tree)
  }
  isV2 ? v2Init() : v1Init()
  return categories;
}
