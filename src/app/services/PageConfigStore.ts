import {pageConfigStorage} from '@/app/services/localStorage';

export class PageConfigStore {
  id: string;

  constructor(
    id: string,
  ) {
    this.id = `PageConfig__${id}`;
  }

  async getHiddenList(): Promise<string[]> {
    return (await pageConfigStorage.getItem(this.id)) || [];
  }

  async setHiddenList(list: string[]): Promise<void> {
    await pageConfigStorage.setItem(this.id, list);
  }

}
