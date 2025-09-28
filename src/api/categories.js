import api from 'api'

export async function fetchCategories() {
  const { data } = await api.get('/api/categories')
  return data
}

export async function createCategory(payload) {
  const { data } = await api.post('/api/categories', payload)
  return data
}

export async function getCategory(id) {
  const { data } = await api.get(`/api/categories/${id}`)
  return data
}
