
const state = {
  conf: null
}

const mutations = {
  SET_CONF: (state, conf) => {
    state.conf = conf
  },
  
}

const actions = {
  previewTable({ commit }, conf) {
    commit('SET_CONF', conf)
  },
}

export default {
  state,
  mutations,
  actions
}
