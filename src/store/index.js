import { app } from '@/app';
import Vuex from 'vuex'
import getters from './getters'
import createPersistedState from "vuex-persistedstate"
app.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = import.meta.globEager("./modules/*.js")
const keys = Object.keys(modulesFiles)
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = {}
keys.map((modulePath) => {
  // set './app.js' => 'app'
  const name = modulePath.split('/')
  const moduleName = name[name.length-1].replace('.js', '')
  const value = modulesFiles[modulePath]
  modules[moduleName] = value.default
})

const store = new Vuex.Store({
  modules,
  getters,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        tablePreview: val.base
      }
    }
  })]
})
export default store
