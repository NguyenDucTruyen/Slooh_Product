<script setup lang="ts">
import type { NguoiDung } from '@/types'
import { useConfirmStore } from '@/stores/confirm'

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}

const props = defineProps<{
  members: Partial<NguoiDungData>[]
  requestJoinMembers: Partial<NguoiDungData>[]
}>()

const emit = defineEmits<{
  (e: 'deleteSelected'): void
  (e: 'addUser'): void
  (e: 'removeMember', member: NguoiDungData): void
  (e: 'acceptMultiRequest', value: boolean): void
  (e: 'acceptRequest', member: NguoiDungData, value: boolean): void
}>()

const confirmStore = useConfirmStore()
const searchUserValue = ref('')

const filteredMembers = computed(() => {
  if (!searchUserValue.value)
    return props.members
  return props.members.filter((member) => {
    return member.hoTen?.toLowerCase().includes(searchUserValue.value.toLowerCase())
  })
})

const selectedMembers = computed(() => {
  return filteredMembers.value.reduce((acc, cur) => {
    if (cur.isSelected)
      acc.push(cur)
    return acc
  }, [] as Partial<NguoiDungData>[])
})

const selectedRequestJoinMembers = computed(() => {
  return props.requestJoinMembers.reduce((acc, cur) => {
    if (cur.isSelected)
      acc.push(cur)
    return acc
  }, [] as Partial<NguoiDungData>[])
})

function selectedAllRequestJoinMembers() {
  if (!props.requestJoinMembers.length)
    return
  const isAllSelected = props.requestJoinMembers.every(member => member.isSelected)
  props.requestJoinMembers.forEach((member) => {
    member.isSelected = !isAllSelected
  })
}

async function deleteSelectedMembers() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedMembers.value.length} thành viên đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  emit('deleteSelected')
}

async function handleAcceptMultiRequest(value: boolean) {
  if (!value) {
    const result = await confirmStore.showConfirmDialog({
      title: 'Cảnh báo',
      message: `Bạn có chắc chắn muốn ${value ? 'chấp nhận' : 'từ chối'} ${selectedRequestJoinMembers.value.length} yêu cầu tham gia đã chọn không?`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy',
    })
    if (!result)
      return
  }
  emit('acceptMultiRequest', value)
}
function handleEmitAcceptRequest(member: NguoiDungData, value: boolean) {
  emit('acceptRequest', member, value)
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-4">
    <h4 class="text-lg font-semibold mt-4">
      Danh sách thành viên ({{ members.length }})
    </h4>

    <div class="mt-2 w-full mx-auto grid grid-cols-1 gap-4">
      <div class="flex justify-between flex-wrap gap-4">
        <InputSearch
          v-model="searchUserValue"
          placeholder="Tìm kiếm thành viên"
        />
        <div class="flex gap-4">
          <Button
            type="button"
            variant="destructive"
            :disabled="selectedMembers.length === 0"
            @click="deleteSelectedMembers"
          >
            Xóa khỏi kênh
          </Button>
          <Button
            type="button"
            @click="$emit('addUser')"
          >
            <Icon name="IconPlus" class="w-6 h-6" />
            <span>Thêm thành viên</span>
          </Button>
        </div>
      </div>
      <template
        v-for="member in filteredMembers"
        :key="member.maNguoiDung"
      >
        <MemberCard
          v-model="member.isSelected"
          :user="member"
          :is-owner="true"
          type="member"
          @remove="emit('removeMember', $event)"
        />
      </template>
      <span
        v-if="!filteredMembers.length"
        class="text-md font-semibold mb-4 text-center text-muted-foreground"
      >Không có kết quả</span>
    </div>

    <div class="mt-4 w-full mx-auto grid grid-cols-1 gap-4">
      <h4 class="text-lg font-semibold mb-4">
        Danh sách yêu cầu tham gia ({{ requestJoinMembers.length }})
      </h4>
      <div
        v-if="requestJoinMembers.length"
        class="flex justify-between mb-4"
      >
        <Button
          variant="link"
          class="text-foreground"
          @click="selectedAllRequestJoinMembers"
        >
          Chọn tất cả
        </Button>
        <div class="flex gap-4">
          <Button
            type="button"
            variant="destructive"
            :disabled="selectedRequestJoinMembers.length === 0"
            @click="handleAcceptMultiRequest(false)"
          >
            Từ chối
          </Button>
          <Button
            type="button"
            :disabled="selectedRequestJoinMembers.length === 0"
            @click="handleAcceptMultiRequest(true)"
          >
            Chấp nhận
          </Button>
        </div>
      </div>
      <template
        v-for="member in requestJoinMembers"
        :key="member.maNguoiDung"
      >
        <MemberCard
          v-model="member.isSelected"
          type="request"
          :user="member"
          :is-owner="true"
          @handle-request="handleEmitAcceptRequest"
        />
      </template>
      <span
        v-if="!requestJoinMembers.length"
        class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
      >Không có kết quả</span>
    </div>
  </div>
</template>
