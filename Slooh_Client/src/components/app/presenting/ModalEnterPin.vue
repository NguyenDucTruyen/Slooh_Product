<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from '@/components/ui/pin-input'
import { toast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'

const { open } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open', 'confirm'])

const formSchema = toTypedSchema(z.object({
  pin: z.array(z.coerce.string()).length(6, { message: 'Mã PIN phải gồm 6 chữ số' }),
}))

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    pin: [],
  },
})

const onSubmit = handleSubmit(({ pin }) => {
  const pinString = pin.join('')
  if (pinString.length !== 6) {
    toast({
      title: 'Lỗi',
      description: 'Mã PIN phải gồm 6 chữ số',
      variant: 'destructive',
    })
    return
  }
  emit('confirm', pinString)
})
</script>

<template>
  <Dialog :open="open" @update:open="(value:boolean) => emit('update:open', value)">
    <DialogContent class="sm:max-w-[425px] p-4">
      <DialogHeader>
        <DialogTitle>Tham gia phiên</DialogTitle>
        <DialogDescription>
          Nhập mã PIN gồm 6 chữ số để tham gia phiên trình chiếu.
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="pin">
          <FormItem>
            <Label>Mã PIN</Label>
            <FormControl>
              <PinInput
                id="pin-input"
                :model-value="value"
                placeholder="○"
                class="flex gap-2 items-center mt-1"
                otp
                type="number"
                :name="componentField.name"
                @update:model-value="(arrStr) => {
                  setFieldValue('pin', arrStr)
                }"
              >
                <div class="flex gap-4">
                  <PinInputGroup>
                    <PinInputSlot
                      v-for="(id, index) in 6"
                      :key="id"
                      :index="index"
                    />
                  </PinInputGroup>
                  <Button
                    variant="outline"
                    type="button"
                    @click="setFieldValue('pin', [])"
                  >
                    Xóa
                  </Button>
                </div>
              </PinInput>
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
        <Button
          class="mt-4 w-full"
        >
          Tham gia
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
