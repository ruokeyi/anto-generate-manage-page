import {createApp} from 'vue';
import App from '@/app/App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export const app = createApp(App as any);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
