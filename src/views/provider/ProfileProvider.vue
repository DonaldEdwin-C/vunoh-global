<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner' 
import api from '@/api'

const { user, logout } = useAuth()
const loading = ref(false)

const profileForm = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
})

async function updateProfile() {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://127.0.0.1:8000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileForm.value),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Failed to update profile')
    }

    const updatedUser = await res.json()
    localStorage.setItem('user', JSON.stringify(updatedUser))
    user.value = updatedUser
    toast.success('Profile updated successfully!')
  } catch (err) {
    console.error(err)
    toast.error(err.message || 'Something went wrong')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center">My Profile</h1>

    <div class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Name</label>
        <Input v-model="profileForm.name" placeholder="Your name" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Email</label>
        <Input v-model="profileForm.email" placeholder="Your email" />
      </div>

      <div>
        <label class="block mb-1 font-medium">Role</label>
        <Input :value="user.value?.role" disabled />
      </div>

      <div class="flex gap-4 mt-4">
        <Button :loading="loading" @click="updateProfile">Update Profile</Button>
        <Button variant="destructive" @click="logout">Logout</Button>
      </div>
    </div>
  </div>
</template>
