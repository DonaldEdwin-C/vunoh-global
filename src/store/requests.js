import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    requests: [],
    loading: false,
  }),
  mutations: {
    SET_REQUESTS(state, requests) {
      state.requests = requests
    },
    ADD_REQUEST(state, request) {
      state.requests.push(request)
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
  },
  actions: {
    async fetchRequests({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await api.get('/requests')
        commit('SET_REQUESTS', data)
      } catch (err) {
        console.error('Failed to fetch requests:', err)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createRequest({ commit }, payload) {
      commit('SET_LOADING', true)
      try {
        const { data } = await api.post('/requests', payload)
        commit('ADD_REQUEST', data)
        return data
      } catch (err) {
        console.error('Failed to create request:', err)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}
