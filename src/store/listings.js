// store/modules/listing.js
import axios from 'axios'

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
    ADD_LISTING(state, listing) {
      state.listings.push(listing)
    },
    UPDATE_LISTING(state, updatedListing) {
      const index = state.listings.findIndex(l => l.id === updatedListing.id)
      if (index !== -1) state.listings[index] = updatedListing
    },
    DELETE_LISTING(state, id) {
      state.listings = state.listings.filter(l => l.id !== id)
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
  },
  actions: {
    async fetchListings({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await axios.get('/api/listings')
        commit('SET_LISTINGS', data)
      } catch (err) {
        console.error(err)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async addListing({ commit }, formData) {
      try {
        const { data } = await axios.post('/api/listings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        commit('ADD_LISTING', data)
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    async updateListing({ commit }, { id, data }) {
      try {
        const res = await axios.post(`/api/listings/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        commit('UPDATE_LISTING', res.data)
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    async deleteListing({ commit }, id) {
      try {
        await axios.delete(`/api/listings/${id}`)
        commit('DELETE_LISTING', id)
      } catch (err) {
        console.error(err)
        throw err
      }
    },
  },
}
