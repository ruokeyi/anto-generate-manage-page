// @ts-ignore
import * as np from 'nprogress';
import {sleep} from '@/utils/sleep';
import {ref} from 'vue';

export const progressBarSignal = ref(0);

export async function start() {
  progressBarSignal.value += 1;
  np.start();
}

export async function done() {
  progressBarSignal.value -= 1;
  await sleep(600);
  if (progressBarSignal.value <= 0) {
    np.done();
  }
}
