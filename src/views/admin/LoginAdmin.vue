<script setup>
import { ref } from 'vue'
import { login } from '@/api/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'

const props = defineProps({
  class: { type: null, required: false },
})

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('admin')
const error = ref(null)

async function handleLogin() {
  try {
    const { data } = await login({
      email: email.value,
      password: password.value,
      role: role.value,
    })

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    console.log('Logged in user:', data.user)

    router.push('/admin')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}
</script>

<template>
  <div class="w-full max-w-md mx-auto p-6">
    <form @submit.prevent="handleLogin" :class="cn('flex flex-col gap-6', props.class)">
      <div class="flex flex-col items-center gap-2 text-center">
        <h1 class="text-2xl font-bold">Welcome Admin</h1>

      </div>
      <div class="grid gap-6">
        <div class="grid gap-3">
          <Label for="email">Email</Label>
          <Input v-model="email" id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-3">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input v-model="password" id="password" type="password" required />
        </div>
        <Button type="submit" class-name="w-full"> Login </Button>
      </div>
    </form>
  </div>
</template>
