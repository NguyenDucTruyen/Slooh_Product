<route>
  {
      meta: {
        title: "Kênh của tôi",
        authorized: true,
      }
  }
</route>

<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { type Kenh, type NguoiDung, TrangThai } from '@/types'
import { useAsyncState } from '@vueuse/core'

interface KenhData extends Kenh {
  isSelected: boolean
}
interface KenhResponseData {
  channels: Kenh[]
  total: number
}
const confirmStore = useConfirmStore()
const channelStore = useChannelStore()

const isCreateChannelModalOpen = ref(false)
const editingChannel = ref<Kenh | null>(null)
const searchChannelValue = ref('')

const channelsResponse = ref<KenhData[]>([])
const channelQuery = ref({
  page: 1,
  limit: 10,
})

const { state: channelResponseData, execute: fetchChannels, isLoading: isFetchingChannels } = useAsyncState<KenhResponseData>(() => {
  return (async () => {
    const response = await channelStore.getChannelList(channelQuery.value)
    channelsResponse.value = response.channels.map((channel: Kenh) => {
      return {
        ...channel,
        isSelected: false,
      }
    })
    return response
  })()
}, null as unknown as KenhResponseData, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})

const channels = computed(() => {
  if (!searchChannelValue.value)
    return channelsResponse.value
  return channelsResponse.value.filter((channel) => {
    return channel.tenKenh?.toLowerCase().includes(searchChannelValue.value.toLowerCase())
  })
})

const selectedChannels = computed(() => {
  return channels.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur.maKenh)
    }
    return acc
  }, [] as string[])
})
async function handleCreateChannel(name: string) {
  await channelStore.createChannel(name)
  toast({
    title: 'Thành công',
    description: 'Tạo kênh thành công',
  })
  fetchChannels(0)
}
async function handleUpdateChannel(data: { kenh: Kenh, tenKenh: string }) {
  await channelStore.updateChannel(data.kenh.maKenh, data.tenKenh)
  fetchChannels(0)
  toast({
    title: 'Thành công',
    description: 'Cập nhật kênh thành công',
  })
}

function openCreateChannelModal() {
  isCreateChannelModalOpen.value = true
}
function openUpdateChannelModal(channel: Kenh) {
  editingChannel.value = channel
  isCreateChannelModalOpen.value = true
}
async function deleteSelectedChannels() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedChannels.value.length} kênh đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  await channelStore.deleteChannel(selectedChannels.value)
  fetchChannels(0)
}

watch(isCreateChannelModalOpen, (value) => {
  if (!value) {
    editingChannel.value = null
  }
})
watch(() => channelQuery.value.page, () => {
  fetchChannels(0)
}, {
  immediate: true,
})
</script>

<template>
  <PageContainer
    title="Kênh của tôi" description="Danh sách kênh do bạn tạo và có quyền quản lý"
  >
    <template #header-actions>
      <div class="flex gap-4">
        <Button
          type="button"
          variant="destructive"
          :disabled="selectedChannels.length === 0"
          @click="deleteSelectedChannels"
        >
          Xóa
        </Button>
        <Button
          type="button"
          @click="openCreateChannelModal"
        >
          <Icon name="IconPlus" class="w-6 h-6" />
          <span>Tạo kênh mới</span>
        </Button>
      </div>
    </template>

    <div class="flex flex-col items-center flex-1 h-full">
      <div class="flex flex-col flex-1 w-full">
        <TransitionGroup
          name="list"
          tag="div"
          class="flex justify-center flex-col"
        >
          <template v-if="isFetchingChannels">
            <div
              class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <Skeleton
                v-for="n in 5"
                :key="`skeleton-${n}`"
                class="h-[333px]"
              />
            </div>
          </template>
          <template v-else>
            <span
              v-if="!channels.length"
              class="text-md font-semibold mb-4 w-full text-center text-muted-foreground mt-4"
            >Không có kết quả</span>
            <div
              v-else
              class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5  gap-4"
            >
              <ChannelCard
                v-for="channel in channels"
                :key="channel.maKenh"
                v-model="channel.isSelected"
                :item="channel"
                :is-owner="true"
                @edit="openUpdateChannelModal"
              />
            </div>
          </template>
        </TransitionGroup>
      </div>

      <template
        v-if="!isFetchingChannels && channels.length"
      >
        <Pagination
          v-slot="{ page }"
          v-model:page="channelQuery.page"
          :items-per-page="channelQuery.limit"
          :total="channelResponseData.total"
          :sibling-count="1"
          :default-page="channelQuery.page"
          show-edges
          class="mt-4 pb-10"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </template>
    </div>
  </PageContainer>

  <CreateOrUpdateChannelModal
    v-model:open="isCreateChannelModalOpen"
    :kenh="editingChannel"
    @update="handleUpdateChannel"
    @create="handleCreateChannel"
  />
</template>
