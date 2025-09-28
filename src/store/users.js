import api from '@/api'

export default {
  namespaced: true,
  state: () => ({
    users: [],
    pagination: {},
  }),
  getters: {
    allUsers: (state) => state.users,
    pagination: (state) => state.pagination,
  },
  actions: {
    async fetchUsers({ commit }, page = 1) {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        commit('setUsers', data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
    },
  },
  mutations: {
    setUsers(state, data) {
      state.users = data.data || []
      state.pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      }
    },
  },
}
