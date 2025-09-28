<script setup>
import { ref } from 'vue'
import { login } from '@/api/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps({
  class: { type: null, required: false },
})

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('')
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

    if (data.user.role === 'provider') router.push('/provider')
    else router.push('/client')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" :class="cn('flex flex-col gap-6', props.class)">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Login to your account</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your email below to login to your account
      </p>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="name" class="text-right"> User </Label>
      <Select v-model="role">
        <SelectTrigger class="w-[200px]">
          <SelectValue placeholder="User" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>User Category</SelectLabel>
            <SelectItem value="client"> Client</SelectItem>
            <SelectItem value="provider"> Service Provider </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
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
    <div class="text-center text-sm">
      Don't have an account?
      <router-link to="register" class="underline underline-offset-4"> Sign Up </router-link>
    </div>
  </form>
</template>
