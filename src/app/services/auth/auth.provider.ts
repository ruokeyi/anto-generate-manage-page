import { reactive, Ref, ref } from 'vue';
import { PermissionNodeDef } from '@/app/services/auth/permission.entity';
import Cookie from 'js-cookie';
import { http } from '../http/http';

function flattenNode(node: PermissionNodeDef): PermissionNodeDef[] {
  let { children } = node;
  if (children) {
    return children.map(flattenNode)
      .reduce((acc, next) => [...acc, ...next], [])
      .concat(node);
  } else {
    return [node];
  }
}

let permissions = ref([]) as Ref<PermissionNodeDef[]>;
let permissions_full = ref([]) as Ref<PermissionNodeDef[]>;
let permissions_root = ref({}) as Ref<PermissionNodeDef>;
let permissions_full_root = ref({}) as Ref<PermissionNodeDef>;
let keys = ref([]) as Ref<string[]>;
let disableUrls = ref([]) as Ref<string[]>;
let ready = ref(false);
let authProvider = reactive({
  ready,
  permissions,
  permissions_full,
  permissions_root,
  permissions_full_root,
  keys,
  hasPermission: key => keys.value.includes(key),
  pageHasPermission(url: string) {
    for (let i = 0; i < disableUrls.value.length; i++) {
      let disabled = disableUrls.value[i]
      if (url.startsWith(disabled)) return false
    }
    return true
  },
  username: '',
  isMe: username => authProvider.username === username,
});

export async function provideAuthData() {
  // 访问接口，赋值
  function getDisableUrls(permissionList, permissionFullList) {
    const allowUrls: Array<string> = []
    const fullUrls: Array<string> = []
    const disableUrls: Array<string> = []
    permissionList.forEach(element => {
      if (element?.menu_item?.url) {
        allowUrls.push(element.menu_item.url)
      }
    });
    permissionFullList.forEach(element => {
      if (element?.menu_item?.url) {
        fullUrls.push(element.menu_item.url)
      }
    });
    fullUrls.forEach(url => {
      if (allowUrls.indexOf(url) === -1) {
        disableUrls.push(url)
      }
    })
    return disableUrls
  }

  function setUpAuthData() {
    if (privilege_tree) {
      const root = PermissionNodeDef.from(privilege_tree, []);
      permissions_root.value = root;
      permissions.value = flattenNode(root);
    }
    if (privilege_tree_full) {
      const root_full = PermissionNodeDef.from(privilege_tree_full, []);
      permissions_full.value = flattenNode(root_full);
      permissions_full_root.value = root_full;
    }
    keys.value = permissions.value.map(x => x.privilege.id);
    authProvider.username = username;
    disableUrls.value = getDisableUrls(permissions.value, permissions_full.value)
    ready.value = true;
  }

  let username = Cookie.get('username');
  const { data: { result: [{ id }] } } = await http.get('/x/admin/uper/auth/user', { params: { username } });
  let user_id = id;
  let privilege_tree
  let privilege_tree_full
  await Promise.all([http.get('/x/admin/uper/auth/user/privilege', { params: { user_id } })
    .then((resp) => {
      try {
        const { data: { privilege_tree: temp } } = resp;
        privilege_tree = temp;
      } catch (e) { }
      return resp;
    }),
  http.get('/x/admin/uper/auth/privilege', { params: { privilege_id: 0 } })
    .then((resp) => {
      const { data: { privilege_tree: temp } } = resp;
      privilege_tree_full = temp;
      return resp;
    })
  ])
  setUpAuthData()
}

export function useAuthData() {
  return authProvider;
}
