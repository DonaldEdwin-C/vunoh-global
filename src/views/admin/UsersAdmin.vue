<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Button from '@/components/ui/button/Button.vue'
import { Search } from 'lucide-vue-next'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const store = useStore()

// Search
const searchQuery = ref('')

// Users from store
const users = computed(() => store.getters['users/allUsers'])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Pagination
const currentPage = ref(1)
const totalPages = ref(1)

async function fetchUsers(page = 1) {
  await store.dispatch('users/fetchUsers', page)
  currentPage.value = store.state.users.pagination?.current_page || 1
  totalPages.value = store.state.users.pagination?.last_page || 1
}

// On mount
onMounted(() => {
  fetchUsers()
})

// Pagination actions
const prevPage = () => {
  if (currentPage.value > 1) fetchUsers(currentPage.value - 1)
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) fetchUsers(currentPage.value + 1)
}
</script>

<template>
  <div>
    <div class="max-w-[85rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10 mx-auto">
      <!-- Card -->
      <div class="flex flex-col">
        <div
          class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <div class="min-w-full inline-block align-middle">
            <div
              class="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700"
            >
              <!-- Header -->
              <div
                class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700"
              >
                <!-- Search -->
                <div class="relative w-full max-w-sm items-center">
                  <Input
                    v-model="searchQuery"
                    id="search"
                    type="text"
                    placeholder="Search..."
                    class="pl-10"
                  />
                  <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <Search class="size-6 text-muted-foreground" />
                  </span>
                </div>

                <div>
                  <div class="inline-flex gap-x-2">
                    <div class="py-3 px-4 flex items-center gap-x-2">
                      <Dialog>
                        <DialogTrigger as-child>
                          <Button>
                            <svg
                              class="shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                            Add user
                          </Button>
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-[425px]">
                          <RegisterForm :redirect="false" />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End Header -->

              <!-- Table -->
              <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead class="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" class="ps-6 py-3 text-start">
                      <label for="hs-at-with-checkboxes-main" class="flex">
                        <input
                          type="checkbox"
                          class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                          id="hs-at-with-checkboxes-main"
                        />
                        <span class="sr-only">Checkbox</span>
                      </label>
                    </th>

                    <th scope="col" class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span
                          class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                        >
                          Name
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span
                          class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                        >
                          Role
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span
                          class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                        >
                          Status
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span
                          class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                        >
                          Created
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-end"></th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                  <tr
                    v-for="user in filteredUsers"
                    :key="user.id"
                  >
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-1" class="flex">
                          <input
                            type="checkbox"
                            class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                            id="hs-at-with-checkboxes-1"
                          />
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <div class="grow">
                            <span
                              class="block text-sm font-semibold text-gray-800 dark:text-neutral-200"
                            >
                              {{ user.name }}
                            </span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">
                              {{ user.email }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                          {{ user.role }}
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span
                          class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full"
                          :class="
                            user.email_verified_at
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500'
                              : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500'
                          "
                        >
                          <svg
                            class="size-2.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                            />
                          </svg>
                          {{ user.email_verified_at ? 'Verified' : 'Not Verified' }}
                        </span>
                      </div>
                    </td>

                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">
                          {{ user.created_at }}
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <p
                          class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                          href="#"
                        >
                          Edit
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- End Table -->

              <!-- Footer -->
              <div
                class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700"
              >
                <div>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">
                    <span class="font-semibold text-gray-800 dark:text-neutral-200">
                      {{ users.length }}
                    </span>
                    results
                  </p>
                </div>

                <div>
                  <div class="inline-flex gap-x-2">
                    <button
                      type="button"
                      @click="prevPage"
                      class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    >
                      <svg
                        class="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Prev
                    </button>

                    <button
                      type="button"
                      @click="nextPage"
                      class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    >
                      Next
                      <svg
                        class="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <!-- End Footer -->
            </div>
          </div>
        </div>
      </div>
      <!-- End Card -->
    </div>
    <!-- End Table Section -->
  </div>
</template>
