import api from '@/api'

export default {
  namespaced: true,
  actions: {
    async createReview(_, { requestId, rating, comment }) {
      return api.post('/reviews', {
        request_id: requestId,
        rating,
        comment
      })
    }
  }
}
