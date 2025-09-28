<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useAuth } from '@/composables/useAuth'
import api from '@/api'

import { Check, Circle, Dot } from 'lucide-vue-next'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

const { user } = useAuth()
const store = useStore()
const searchQuery = ref('')

const showReviewModal = ref(false)
const currentRequestId = ref(null)
const rating = ref(0)
const comment = ref('')
const loading = ref(false)

onMounted(async () => {
  if (user.value?.id) {
    await store.dispatch('requests/fetchRequests')
  }
})

const requests = computed(() => store.state.requests.requests)

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
  { key: 'completed', step: 2, title: 'Completed', description: 'Request finished' },
  { key: 'rejected', step: 3, title: 'Rejected', description: 'Request was rejected' },
]

function stepState(currentStatus, stepKey) {
  const order = steps.map(s => s.key)
  const currentIndex = order.indexOf(currentStatus?.toLowerCase())
  const stepIndex = order.indexOf(stepKey)
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'active'
  return 'inactive'
}

async function submitReview() {
  if (!currentRequestId.value || rating.value === 0) return
  loading.value = true
  try {
    await api.post('/api/reviews', {
      request_id: currentRequestId.value,
      rating: rating.value,
      comment: comment.value,
    })
    await store.dispatch('requests/fetchRequests')
    showReviewModal.value = false
    rating.value = 0
    comment.value = ''
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-[85rem] mx-auto p-4">
    <h1 class="text-xl font-bold mb-4">My Service Requests</h1>

    <Input v-model="searchQuery" placeholder="Search requests…" class="mb-6 w-full sm:w-1/2" />

    <div v-if="filteredRequests.length === 0" class="text-gray-500">No requests found.</div>

    <div
      v-for="req in filteredRequests"
      :key="req.id"
      class="mb-10 border border-gray-200 rounded-lg shadow-sm p-6 transition hover:shadow-md"
    >
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-4">
          <img
            v-if="req.listing?.images?.length"
            :src="req.listing.images[0].image_url"
            class="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h2 class="text-lg font-semibold">{{ req.listing?.title }}</h2>
            <p class="text-sm text-gray-500">Category: {{ req.listing?.category?.name }}</p>
          </div>
        </div>
        <span
          class="px-3 py-1 text-sm rounded-full font-medium capitalize text-white"
          :class="{
            'bg-yellow-500': req.status?.toLowerCase() === 'pending',
            'bg-green-500': req.status?.toLowerCase() === 'completed',
            'bg-red-500': req.status?.toLowerCase() === 'rejected',
          }"
        >
          {{ req.status }}
        </span>
      </div>

      <Stepper class="flex w-full items-start gap-2 mb-4">
        <StepperItem
          v-for="step in steps"
          :key="step.step"
          v-slot="{ state }"
          class="relative flex w-full flex-col items-center justify-center"
          :step="step.step"
        >
          <StepperSeparator
            v-if="step.step !== steps[steps.length - 1].step"
            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted"
            :class="{ 'bg-primary': stepState(req.status, step.key) === 'completed' }"
          />

          <StepperTrigger as-child>
            <Button
              :variant="['completed','active'].includes(stepState(req.status, step.key)) ? 'default' : 'outline'"
              size="icon"
              class="z-10 rounded-full shrink-0 transition-all duration-300"
              :class="[stepState(req.status, step.key) === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
            >
              <Check v-if="stepState(req.status, step.key) === 'completed'" class="size-5" />
              <Circle v-else-if="stepState(req.status, step.key) === 'active'" />
              <Dot v-else />
            </Button>
          </StepperTrigger>

          <div class="mt-5 flex flex-col items-center text-center">
            <StepperTitle :class="[stepState(req.status, step.key) === 'active' && 'text-primary']" class="text-sm font-semibold transition lg:text-base">
              {{ step.title }}
            </StepperTitle>
            <StepperDescription :class="[stepState(req.status, step.key) === 'active' && 'text-primary']" class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
              {{ step.description }}
            </StepperDescription>
          </div>
        </StepperItem>
      </Stepper>

      <div class="mt-2 text-sm text-gray-700 space-y-1">
        <p>Delivery Date: {{ req.delivery_date ?? 'Not set' }}</p>
        <p>Price Offered: {{ req.price_offered ? `KES ${req.price_offered}` : 'Not set' }}</p>
        <p v-if="req.counter_note">Counter Note: {{ req.counter_note }}</p>
      </div>

      <Button
        v-if="req.status?.toLowerCase() === 'completed'"
        class="mt-4"
        @click="() => { showReviewModal = true; currentRequestId = req.id }"
      >
        Leave a Review
      </Button>
    </div>
  </div>

  <Dialog v-model:open="showReviewModal">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Leave a Review</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div class="flex gap-1">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="text-2xl"
            :class="n <= rating ? 'text-yellow-400' : 'text-gray-300'"
            @click="rating = n"
          >
            ★
          </button>
        </div>

        <Textarea
          v-model="comment"
          placeholder="Write an optional comment…"
          rows="3"
        />
      </div>

      <DialogFooter>
        <Button :disabled="loading || rating === 0" @click="submitReview">
          {{ loading ? 'Submitting…' : 'Submit' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
