import * as localforage from 'localforage';

export let localDataAccess = localforage.createInstance({
  name: 'data-table-demo-storage',
  storeName: 'data-table-demo-storage-store',
});

export let pageConfigStorage = localforage.createInstance({
  name: 'data-table-demo-page-config-storage',
  storeName: 'data-table-demo-page-config-storage-store',
});
