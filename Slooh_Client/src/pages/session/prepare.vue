<route>
    {
        meta: {
        layout: "session",
        title: "Phiên trình chiếu",
        }
    }
</route>

<script setup lang="ts">
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from '@/components/ui/pin-input'
import { useUserStore } from '@/stores/user'
import { formJoinSessionValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useAsyncState } from '@vueuse/core'
import { useForm } from 'vee-validate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Get pin from query parameters and convert to array of strings
const queryPin = ref(route.query.pin as string || '')
const pinArray = ref(queryPin.value.split('').slice(0, 6))

const form = useForm({
  validationSchema: toTypedSchema(formJoinSessionValidator),
  initialValues: {
    name: userStore.user?.hoTen || '',
  },
})

const onSubmit = form.handleSubmit(async (_values) => {
  router.push(`/session/${pinArray.value.join('')}/?name=${encodeURIComponent(form.values.name as string)}`)
})
</script>

<template>
  <form class="sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Tham gia phiên trình chiếu
        </CardTitle>
        <CardDescription class="text-center">
          Nhập họ tên của bạn để tham gia phiên trình chiếu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2 grid-cols-5 items-center">
            <Label class="text-sm font-medium">Mã PIN</Label>
            <PinInput
              v-model="pinArray"
              placeholder="○"
              class="flex gap-2 items-center col-span-4"
              otp
              type="number"
            >
              <PinInputGroup>
                <PinInputSlot
                  v-for="(_, index) in 6"
                  :key="index"
                  :index="index"
                  class="bg-muted"
                />
              </PinInputGroup>
            </PinInput>
          </div>
          <div class="grid gap-2 grid-cols-5 items-center">
            <Label for="name" class="text-sm font-medium">Họ tên</Label>
            <InputValidator id="name" type="name" label="" name="name" placeholder="Họ tên của bạn" custom-class="col-span-4 space-y-0" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="secondary"
              @click="router.go(-1)"
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              @click="onSubmit"
            >
              Tham gia phiên
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </form>
</template>
