<script setup lang="ts">
const { open } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open', 'add'])
const listEmail = ref<string[]>([])
function handleCreate() {
  if (listEmail.value.length === 0)
    return
  emit('add', listEmail.value)
  emit('update:open', false)
  listEmail.value = []
}
const isCreatable = computed(() => {
  return listEmail.value.length > 0
})
</script>

<template>
  <Dialog :open="open" @update:open="(value:boolean) => emit('update:open', value)">
    <DialogContent class="sm:max-w-[425px] p-4">
      <DialogHeader>
        <DialogTitle>Thêm thành viên</DialogTitle>
        <DialogDescription>
          Nhập email và nhấn Enter (hoặc dán) để thêm một tag.<br><br>
          Bạn cũng có thể dán danh sách email, các email các nhau bằng dấu phẩy sẽ tự động được thêm thành một tag.
        </DialogDescription>
      </DialogHeader>
      <div class="grid grid-cols-5 items-center gap-4">
        <Label for="channel-name" class="text-left">Email</Label>
        <TagsInput
          v-model="listEmail"
          add-on-paste
          class="col-span-4"
        >
          <TagsInputItem
            v-for="item in listEmail"
            :key="item"
            :value="item"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="Email..." />
        </TagsInput>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          :disabled="!isCreatable"
          @click="handleCreate"
        >
          Thêm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
