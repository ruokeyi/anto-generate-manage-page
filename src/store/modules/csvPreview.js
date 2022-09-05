
const state = {
  csvPreviewUrl: null
}

const mutations = {
  SET_CSV: (state, url) => {
    state.csvPreviewUrl = url
  },
  
}

const actions = {
  previewCsv({ commit }, url) {
    commit('SET_CSV', url)
  },
}

export default {
  state,
  mutations,
  actions
}
