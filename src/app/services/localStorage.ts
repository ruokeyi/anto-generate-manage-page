import * as localforage from 'localforage';

export let localDataAccess = localforage.createInstance({
  name: 'generate-data-table-storage',
  storeName: 'generate-data-table-storage-store',
});

export let pageConfigStorage = localforage.createInstance({
  name: 'generate-data-table-page-config-storage',
  storeName: 'generate-data-table-page-config-storage-store',
});
