import {RouteRecordRaw} from 'vue-router';
import { dataTableRouterConfig } from '@/app/data-table-generate/data-table-generate.router'
import { tablePreviewRouterConfig } from '@/app/table-preview/table-preview.router'

export const appRouterConfig: RouteRecordRaw[] = [
  ...dataTableRouterConfig,
  ...tablePreviewRouterConfig,
];