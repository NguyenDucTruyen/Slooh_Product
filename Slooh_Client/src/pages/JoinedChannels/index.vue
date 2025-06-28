<route>
  {
      meta: {
        title: "Kênh đã tham gia",
        authorized: true,
      }
  }
</route>

<script setup lang="ts">
import PageContainer from '@/components/layout/PageContainer.vue'
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
import { HoatDongPhong, type Kenh, TrangThai, TrangThaiThanhVien, VaiTroKenh } from '@/types'
import { useAsyncState, watchDebounced } from '@vueuse/core'

interface KenhData extends Kenh {
  isSelected: boolean
  vaiTro: VaiTroKenh
}
interface KenhResponseData {
  channels: Kenh[]
  total: number
}
const channelStore = useChannelStore()
const isJoinChannelModalOpen = ref(false)
const channels = ref<KenhData[]>([])

const channelQuery = ref({
  page: 1,
  limit: 10,
})
const { state: channelResponseData, execute: fetchChannels, isLoading: isFetchingChannels } = useAsyncState<KenhResponseData>(() => {
  return (async () => {
    const response = await channelStore.getChannelsJoined(channelQuery.value)
    channels.value = response.channels.reduce((acc: KenhData[], curr: KenhData) => {
      if (curr.vaiTro !== VaiTroKenh.CHU_KENH) {
        acc.push({
          ...curr,
          isSelected: false,
        })
      }
      return acc
    }, [])
    return response
  })()
}, null as unknown as KenhResponseData, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})

const { state: channelsRequestJoin, isLoading: isFetchingChannelRequestJoin, execute: fetchChannelRequestJoin } = useAsyncState<KenhResponseData>(async () => {
  const response = await channelStore.getChannelsRequestJoin({
    page: 1,
    limit: 100,
  })
  return response
}, null as unknown as KenhResponseData, {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})
async function handleRequestJoinChannel(id: string) {
  await channelStore.sendRequestJoinChannel(id)
  toast({
    title: 'Thành công',
    description: 'Yêu cầu tham gia kênh thành công',
  })
  fetchChannelRequestJoin()
}
async function handleCancelRequest(id: string) {
  await channelStore.cancelRequestJoinChannel(id)
  toast({
    title: 'Thành công',
    description: 'Hủy yêu cầu tham gia kênh thành công',
  })
  fetchChannelRequestJoin()
}
function openCreateChannelModal() {
  isJoinChannelModalOpen.value = true
}
watch(() => channelQuery.value.page, () => {
  fetchChannels(0)
}, {
  immediate: true,
})
</script>

<template>
  <PageContainer
    title="Kênh đã tham gia"
    description="Bạn có thể tham gia các kênh khác bằng cách gửi yêu cầu tham gia"
  >
    <template #header-actions>
      <Button
        type="button"
        @click="openCreateChannelModal"
      >
        <Icon name="IconPlus" class="w-6 h-6" />
        <span>Gửi yêu cầu tham gia</span>
      </Button>
    </template>

    <div class="flex flex-col items-center flex-1 h-full">
      <Tabs default-value="list" class="w-full flex-1 h-full">
        <TabsList>
          <TabsTrigger value="list">
            <Icon name="IconList" class="w-6 h-6" />
            Đã tham gia
          </TabsTrigger>
          <TabsTrigger value="list-request">
            <Icon name="IconListUser" class="w-6 h-6" />
            Đã gửi yêu cầu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" class="flex flex-col flex-1">
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
                class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
              >
                Không có kết quả
              </span>
              <div
                v-else
                class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
              >
                <ChannelCard
                  v-for="channel in channels"
                  :key="channel.maKenh"
                  v-model="channel.isSelected"
                  :item="channel"
                />
              </div>
            </template>
          </TransitionGroup>

          <template v-if="!isFetchingChannels && channels.length">
            <Pagination
              v-slot="{ page }"
              v-model:page="channelQuery.page"
              :items-per-page="channelQuery.limit"
              :total="channelResponseData.total"
              :sibling-count="1"
              :default-page="channelQuery.page"
              show-edges
              class="mt-6 pb-8"
            >
              <PaginationList v-slot="{ items }" class="flex items-center gap-1 justify-center">
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
        </TabsContent>

        <TabsContent value="list-request" class="max-w-2xl mx-auto">
          <div class="flex flex-col items-center p-4 rounded-md bg-card shadow-lg mt-4">
            <span
              v-if="!isFetchingChannelRequestJoin && !channelsRequestJoin.channels.length"
              class="text-md font-semibold mb-4 w-full text-center text-muted-foreground"
            >
              Không có kết quả
            </span>
            <template
              v-else-if="!isFetchingChannelRequestJoin && channelsRequestJoin.channels"
            >
              <div class="w-full grid grid-cols-4 border-b border-border">
                <span class="text-lg font-semibold mb-4 w-full pl-4 text-muted-foreground col-span-3">
                  Tên kênh
                </span>
                <span class="text-lg font-semibold mb-4 w-full text-center text-muted-foreground">
                  Hành động
                </span>
              </div>
              <div class="mt-2 w-full grid grid-cols-1 gap-4">
                <div
                  v-for="channel in channelsRequestJoin.channels"
                  :key="channel.maKenh"
                  class="w-full grid grid-cols-4 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
                >
                  <span class="col-span-3 flex items-center gap-4 p-4 text-lg font-semibold">
                    {{ channel.tenKenh }}
                  </span>
                  <div class="flex items-center justify-center">
                    <Button
                      variant="outline"
                      @click="handleCancelRequest(channel.maKenh)"
                    >
                      Hủy yêu cầu
                    </Button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </PageContainer>

  <JoinChannelModal
    v-model:open="isJoinChannelModalOpen"
    @create="handleRequestJoinChannel"
  />
</template>
