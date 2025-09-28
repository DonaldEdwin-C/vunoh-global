import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    listings: [],
    requests: [],
    reviews: [],
    loadingListings: false,
    loadingRequests: false,
    loadingReviews: false,
  }),
  getters: {
    allListings: (state) => state.listings,
    allRequests: (state) => state.requests,
    allReviews: (state) => state.reviews,
  },
  mutations: {
    setListings(state, listings) { state.listings = listings },
    setRequests(state, requests) { state.requests = requests },
    setReviews(state, reviews) { state.reviews = reviews },
    setLoadingListings(state, loading) { state.loadingListings = loading },
    setLoadingRequests(state, loading) { state.loadingRequests = loading },
    setLoadingReviews(state, loading) { state.loadingReviews = loading },
  },
  actions: {
    async fetchListings({ commit }) {
      commit('setLoadingListings', true)
      try {
        const res = await api.get('/listings')
        commit('setListings', res.data)
      } finally {
        commit('setLoadingListings', false)
      }
    },
    async createListing({ dispatch }, formData) {
      await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch('fetchListings')
    },
    async fetchRequests({ commit }) {
      commit('setLoadingRequests', true)
      try {
        const res = await api.get('/requests')
        commit('setRequests', res.data)
      } finally {
        commit('setLoadingRequests', false)
      }
    },
    async updateRequest({ dispatch }, { requestId, payload }) {
      await api.patch(`/requests/${requestId}`, payload)
      dispatch('fetchRequests')
    },
    async fetchReviews({ commit }) {
      commit('setLoadingReviews', true)
      try {
        const res = await api.get('/reviews')
        commit('setReviews', res.data)
      } finally {
        commit('setLoadingReviews', false)
      }
    },
  },
}
