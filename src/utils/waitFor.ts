import {sleep} from '@/utils/sleep';

export async function waitFor(
  callback,
  expire = 60000,
  gap = 20,
) {
  let start = Date.now();
  while (Date.now() < start + expire) {
    let data = await callback();
    if (data) {
      return data;
    }
    await sleep(gap);
  }
  throw 'waitFor function time out.';
}
