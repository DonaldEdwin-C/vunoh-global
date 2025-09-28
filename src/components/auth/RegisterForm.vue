<script setup>
import { ref } from 'vue'
import { register } from '@/api/auth'
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

const router = useRouter()

const props = defineProps({
  class: { type: null, required: false },
})

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const role = ref('')
const loading = ref(false)
const error = ref(null)

async function handleRegister() {
  error.value = null

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  try {
    const { data } = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })

    localStorage.setItem('token', data.token)
    console.log('Registered user:', data.user)
    if (props.redirect) {
      router.push('/auth/login')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" :class="cn('flex flex-col gap-6', props.class)">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Register a new account</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your email below to register a new account
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
        <Input v-model="email" id="email" type="email" placeholder="" required />
      </div>
      <div class="grid gap-3">
        <Label for="email">Name</Label>
        <Input v-model="name" id="name" type="text" placeholder="" required />
      </div>
      <div class="grid gap-3">
        <div class="flex items-center">
          <Label for="password">Password</Label>
        </div>
        <Input v-model="password" id="password" type="password" required />
      </div>
      <div class="grid gap-3">
        <div class="flex items-center">
          <Label for="password">Confirm Password</Label>
        </div>
        <Input v-model="passwordConfirmation" id="password" type="password" required />
      </div>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <Button :disabled="loading" type="submit">
        {{ loading ? 'Registering…' : 'Register' }}
      </Button>
    </div>
    <div class="text-center text-sm">
      Already have an account?
      <router-link to="login" class="underline underline-offset-4"> Sign In </router-link>
    </div>
  </form>
</template>
