<script setup>
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RouterLink } from 'vue-router'

const { user, logout } = useAuth()

</script>

<template>
  <div>
    <div v-if="user" class="flex justify-end mx-auto max-w-[85rem] mt-3">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline"> {{ user.name }} </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="destructive" @click="logout">Log out</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <slot />
    <nav
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white shadow-lg rounded-full px-8 py-2 z-50 transition-transform duration-200 hover:scale-115"
    >
      <ul class="flex space-x-8">
        <li>
          <router-link to="/provider">
            <Button
              class="size-13 inline-flex justify-center items-center text-sm font-medium rounded-full hover:rounded-lg border border-transparent text-white hover:scale-115 focus:outline-hidden focus:bg-blue-700"
              href="#"
            >
              <svg
                class="size-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </Button>
          </router-link>
        </li>

        <li>
          <router-link to="/provider/requests">
            <Button
              class="size-13 inline-flex justify-center items-center text-sm font-medium rounded-full hover:rounded-lg border border-transparent text-white hover:scale-115 focus:outline-hidden focus:bg-blue-700"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                />
              </svg>
            </Button>
          </router-link>
        </li>
        <li>
          <router-link to="/provider/profile">
            <Button
              class="size-13 inline-flex justify-center items-center text-sm font-medium rounded-full hover:rounded-lg border border-transparent text-white hover:scale-115 focus:outline-hidden focus:bg-blue-700"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </Button>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
