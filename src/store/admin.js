import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    listings: [],
    pagination: {},
  }),
  getters: {
    allListings: (state) => state.listings,
    pagination: (state) => state.pagination,
  },
  actions: {
    async fetchListings({ commit }, page = 1) {
      try {
        const res = await api.get(`/admin/listings?page=${page}`)
        const data = res.data
        commit('setListings', data)
      } catch (err) {
        console.error('Failed to fetch listings:', err)
      }
    },

    async updateListingStatus({ dispatch }, { listingId, status, reason }) {
      try {
        if (status === 'approved') {
          await api.post(`/admin/listings/${listingId}/approve`)
        } else if (status === 'rejected') {
          await api.post(`/admin/listings/${listingId}/reject`, { reason })
        } else if (status === 'pending') {
          await api.patch(`/admin/listings/${listingId}`, { status })
        }

        dispatch('fetchListings')
      } catch (err) {
        console.error('Failed to update listing status:', err)
      }
    },

    async deleteListing({ dispatch }, listingId) {
      try {
        await api.delete(`/admin/listings/${listingId}`)
        dispatch('fetchListings')
      } catch (err) {
        console.error('Failed to delete listing:', err)
      }
    },
  },
  mutations: {
    setListings(state, data) {
      state.listings = data.data || []
      state.pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      }
    },
  },
}
