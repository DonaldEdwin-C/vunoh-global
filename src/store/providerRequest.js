import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    requests: [],
    loading: false,
    error: null,
  }),

  getters: {
    allRequests: (state) => state.requests,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    setRequests(state, requests) {
      state.requests = requests
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchRequests({ commit }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res = await api.get('/requests')
        commit('setRequests', res.data.data || res.data)
      } catch (err) {
        console.error('Fetch Requests Error:', err)
        commit('setError', err.response?.data?.message || 'Failed to load requests')
      } finally {
        commit('setLoading', false)
      }
    },

    async updateRequest(
      { dispatch, commit },
      { requestId, status, counter_note = null, price_offered = null },
    ) {
        console.log('Going to PATCH /api/requests/', requestId)

      try {
        await api.patch(`/requests/${requestId}`, { status, counter_note, price_offered })
        await dispatch('fetchRequests')
        console.log('ID to update:', requestId)
      } catch (err) {
        console.error('Update Request Error:', err)
        commit('setError', err.response?.data?.message || 'Failed to update request')
      }
    },

    async cancelRequest({ dispatch, commit }, requestId) {
      try {
        await api.patch(`/requests/${requestId}`, { status: 'rejected' })
        await dispatch('fetchRequests')
      } catch (err) {
        console.error('Cancel Request Error:', err)
        commit('setError', err.response?.data?.message || 'Failed to cancel request')
      }
    },
  },
}
