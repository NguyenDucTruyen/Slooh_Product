<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import { DrawerContent, DrawerPortal } from 'vaul-vue'
import DrawerOverlay from './DrawerOverlay.vue'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwardedProps = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      v-bind="forwardedProps" :class="cn(
        'fixed top-0 right-0 w-auto z-50 flex h-screen flex-col border bg-background',
        props.class,
      )"
    >
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
