import {http as fetchApi} from '../../app/services/http/http';


export function getGroupsByUsername(owner_uname) {
  return fetchApi.get(
    '/x/admin/uper/mark/user/mark_group',
    {params: {owner_uname}},
  );
}

export function addGroup({title, owner_uname}) {
  return fetchApi.post('/x/admin/uper/mark/group/add', {title, owner_uname});
}

export function markUp({mid, gids = [], mark_uname}) {
  return fetchApi.post('/x/admin/uper/mark/up/group/change',
    {mid, gids, mark_uname});
}

export async function getMarkUpGroup(mid = undefined, mark_uname = undefined) {
  let params = {mid, mark_uname};
  let response = await fetchApi.get(
    '/x/admin/uper/mark/up/group',
    {params},
  );
  return (response.data || {}).mark_groups || [];
}

export async function markUpAdd(formData) {
  let url = '/x/admin/uper/mark/up/add';
  return fetchApi.post(url, formData);
}
