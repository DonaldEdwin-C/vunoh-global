import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const loading = ref(false)
  const error = ref(null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const router = useRouter()

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const res = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Logout failed')
      }

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace('/auth/login')
    } catch (err) {
      error.value = err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return { user, logout, loading, error }
}
