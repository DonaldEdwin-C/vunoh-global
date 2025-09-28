import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function register(payload) {
  return api.post('/register', payload)
}

export function login(payload) {
  return api.post('/login', payload)
}
