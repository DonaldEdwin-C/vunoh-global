import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    listings: [],
    loading: false,
  }),
  mutations: {
    SET_LISTINGS(state, listings) {
      state.listings = listings
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
  },
  actions: {
    async fetchApprovedListings({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await api.get('/listings/approved')
        console.log('data', data)
        commit('SET_LISTINGS', data)
      } catch (err) {
        console.error('Failed to fetch approved listings:', err)
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}
