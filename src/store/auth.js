import api from '@/api/';
import router from '@/router';

const authModule = {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('token', payload.token);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/login', credentials);
        commit('setUser', {
          user: response.data.user,
          token: response.data.token,
        });

        if (response.data.user.role === 'client') router.push('/client/dashboard');
        else if (response.data.user.role === 'provider') router.push('/provider/dashboard');
        else if (response.data.user.role === 'admin') router.push('/admin/dashboard');
      } catch (err) {
        throw err.response.data;
      }
    },
    async register({ commit }, payload) {
      try {
        const response = await api.post('/register', payload);
        commit('setUser', {
          user: response.data.user,
          token: response.data.token,
        });
        router.push('/client/dashboard');
      } catch (err) {
        throw err.response.data;
      }
    },
    async logout({ commit }) {
      await api.post('/logout');
      commit('clearUser');
      router.push('/login');
    },
    async fetchProfile({ commit, state }) {
      if (!state.token) return;
      try {
        const response = await api.get('/profile');
        commit('setUser', {
          user: response.data,
          token: state.token,
        });
      } catch (err) {
        commit('clearUser');
        router.push('/login');
      }
    },
  },
};

export default authModule;
