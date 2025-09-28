<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useAuth } from '@/composables/useAuth'
import { Check, Circle, Dot, } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { toast } from 'vue-sonner'

const { user } = useAuth()
const store = useStore()
const searchQuery = ref('')

onMounted(async () => {
  if (user.value?.id) {
    await store.dispatch('providerRequest/fetchRequests')
  }
})

const requests = computed(() => store.state.providerRequest.requests)

const filteredRequests = computed(() => {
  if (!searchQuery.value) return requests.value
  return requests.value.filter(
    r =>
      r.listing?.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.listing?.category?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const steps = [
  { key: 'pending', step: 1, title: 'Pending', description: 'Waiting for provider' },
  { key: 'accepted', step: 2, title: 'Accepted', description: 'Provider accepted' },
  { key: 'completed', step: 3, title: 'Completed', description: 'Request finished' },
  { key: 'rejected', step: 4, title: 'Rejected', description: 'Request was rejected' },
]

function stepState(currentStatus, stepKey) {
  const order = steps.map(s => s.key)
  const currentIndex = order.indexOf(currentStatus?.toLowerCase())
  const stepIndex = order.indexOf(stepKey)
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'active'
  return 'inactive'
}

async function updateRequest(req, status) {
  try {
    await store.dispatch('providerRequest/updateRequest', { requestId: req.id, status })
    toast.success(`Request ${status}`)
  } catch (err) {
    toast.error('Failed to update request')
  }
}

async function cancelRequest(req) {
  try {
    await store.dispatch('providerRequest/cancelRequest', req.id)
    toast.success('Request canceled')
  } catch (err) {
    toast.error('Failed to cancel request')
  }
}
</script>

<template>
  <div class="max-w-[85rem] mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Provider Requests</h1>

    <Input
      v-model="searchQuery"
      placeholder="Search requests by service or category…"
      class="mb-8 w-full sm:w-1/2 border-gray-300 shadow-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
    />

    <div v-if="filteredRequests.length === 0" class="text-gray-500 text-center py-20">
      No requests found.
    </div>

    <div
      v-for="req in filteredRequests"
      :key="req.id"
      class="mb-8 border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-6 bg-white dark:bg-neutral-900 dark:border-neutral-700"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-4">
          <img
            v-if="req.listing?.images?.length"
            :src="req.listing.images[0].image_url"
            class="w-20 h-20 object-cover rounded-md shadow-sm"
          />
          <div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
              {{ req.listing?.title }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-neutral-400">
              Category: {{ req.listing?.category?.name }}
            </p>
          </div>
        </div>

        <span
          class="px-3 py-1 text-sm rounded-full font-medium capitalize text-white"
          :class="{
            'bg-yellow-500': req.status?.toLowerCase() === 'pending',
            'bg-green-500': req.status?.toLowerCase() === 'completed',
            'bg-red-500': req.status?.toLowerCase() === 'rejected',
            'bg-blue-500': req.status?.toLowerCase() === 'accepted'
          }"
        >
          {{ req.status }}
        </span>
      </div>

      <!-- Stepper -->
      <Stepper class="flex w-full items-start gap-2 mb-6">
        <StepperItem
          v-for="step in steps"
          :key="step.step"
          v-slot="{ state }"
          class="relative flex w-full flex-col items-center justify-center"
          :step="step.step"
        >
          <StepperSeparator
            v-if="step.step !== steps[steps.length - 1].step"
            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 h-1 rounded-full bg-gray-200"
            :class="{ 'bg-blue-500': stepState(req.status, step.key) === 'completed' }"
          />

          <StepperTrigger as-child>
            <Button
              :variant="['completed','active'].includes(stepState(req.status, step.key)) ? 'default' : 'outline'"
              size="icon"
              class="z-10 rounded-full shrink-0 transition-all duration-300"
              :class="[stepState(req.status, step.key) === 'active' && 'ring-2 ring-blue-500 ring-offset-2']"
            >
              <Check v-if="stepState(req.status, step.key) === 'completed'" class="size-5 text-white" />
              <Circle v-else-if="stepState(req.status, step.key) === 'active'" class="size-5 text-blue-500" />
              <Dot v-else class="size-5 text-gray-300" />
            </Button>
          </StepperTrigger>

          <div class="mt-4 flex flex-col items-center text-center">
            <StepperTitle
              :class="[stepState(req.status, step.key) === 'active' ? 'text-blue-600 font-semibold' : 'text-gray-500']"
              class="text-sm lg:text-base transition"
            >
              {{ step.title }}
            </StepperTitle>
            <StepperDescription
              :class="[stepState(req.status, step.key) === 'active' ? 'text-blue-400' : 'text-gray-400']"
              class="text-xs lg:text-sm"
            >
              {{ step.description }}
            </StepperDescription>
          </div>
        </StepperItem>
      </Stepper>

      <!-- Details -->
      <div class="mt-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <p>Delivery Date: <span class="font-medium">{{ req.delivery_date ?? 'Not set' }}</span></p>
        <p>Price Offered: <span class="font-medium">{{ req.price_offered ? `KES ${req.price_offered}` : 'Not set' }}</span></p>
        <p v-if="req.counter_note">Counter Note: <span class="font-medium">{{ req.counter_note }}</span></p>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex gap-2 flex-wrap">
        <Button
          v-if="req.status?.toLowerCase() === 'pending'"
          variant="success"
          size="sm"
          @click="updateRequest(req, 'accepted')"
        >
          Accept
        </Button>

        <Button
          v-if="req.status?.toLowerCase() === 'pending'"
          variant="destructive"
          size="sm"
          @click="updateRequest(req, 'rejected')"
        >
          Reject
        </Button>

        <Button
          v-if="req.status?.toLowerCase() === 'accepted'"
          variant="primary"
          size="sm"
          @click="updateRequest(req, 'completed')"
        >
          Complete
        </Button>

        <Button
          v-if="req.status?.toLowerCase() === 'pending'"
          variant="outline"
          size="sm"
          @click="cancelRequest(req)"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>
