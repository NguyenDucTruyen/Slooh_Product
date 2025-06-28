<script setup lang="ts">
import { usePreviewSlideStore } from '@/stores/preview'
import { decode } from 'html-entities'

defineProps<{
  modelValue: string
  placeholder?: string
  specialType?: 'question' | 'answer'
  editable?: boolean
}>()
const currentAlign = defineModel('align', {
  type: String,
  default: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const previewSlideStore = usePreviewSlideStore()
const editor = ref<HTMLElement | null>(null)

type FormatCommand = 'bold' | 'italic' | 'superscript' | 'subscript' | 'removeFormat'
const LIST_ALIGN = [{
  name: '',
  icon: 'IconAlignLeft',
  shortcut: 'Align left (Ctrl + L)',
}, {
  name: 'center',
  icon: 'IconAlignCenter',
  shortcut: 'Align center (Ctrl + E)',
}, {
  name: 'right',
  icon: 'IconAlignRight',
  shortcut: 'Align right (Ctrl + R)',
}, {
  name: 'justify',
  icon: 'IconAlignJustify',
  shortcut: 'Align justify (Ctrl + J)',
}]
function format(command: FormatCommand) {
  document.execCommand(command, false)
}
function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain')
  if (!text)
    return
  document.execCommand('insertText', false, text)
}

function handleUpdate() {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML)
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.target === editor.value) {
    switch (e.key.toLowerCase()) {
      case ',':
        e.preventDefault()
        e.stopPropagation()
        format('subscript')
        break
      case '.':

        e.preventDefault()
        e.stopPropagation()
        format('superscript')
        break
      case '/':

        e.preventDefault()
        e.stopPropagation()
        format('removeFormat')
        break
      case 'l':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('')
        break
      case 'e':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('center')
        break
      case 'r':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('right')
        break
      case 'j':

        e.preventDefault()
        e.stopPropagation()
        handleAlign('justify')
        break
    }
  }
}

function handleAlign(name: string) {
  currentAlign.value = name
}
</script>

<template>
  <div class="w-full group relative flex items-center">
    <!-- Formatting toolbar (ẩn mặc định, chỉ hiện khi hover/focus vào editor) -->
    <div
      v-if="editable && !previewSlideStore.isPreviewing"
      class="flex gap-2 justify-center items-center bg-card/80 backdrop-blur-sm p-2 rounded-md absolute -top-[46px] left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition !text-foreground"
    >
      <Button variant="outline" size="sm" class="w-8 h-8 p-0" title="Bold (Ctrl + B)" @click="format('bold')">
        <strong>B</strong>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0" title="Italic (Ctrl + I)" @click="format('italic')">
        <i>I</i>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0 text-xs" title="Subscript (Ctrl + ,)" @click="format('subscript')">
        <p>X<sub>2</sub></p>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0 text-xs" title="Superscript (Ctrl + .)" @click="format('superscript')">
        <p>X<sup>2</sup></p>
      </Button>
      <Button variant="outline" size="sm" class="w-8 h-8 p-0" title="Clear (Ctrl + /)" @click="format('removeFormat')">
        <Icon name="IconClear" class="w-4 h-4" />
      </Button>
      <template
        v-if="!specialType"
      >
        |
        <Button
          v-for="item in LIST_ALIGN"
          :key="item.name"
          variant="outline" size="sm" class="w-8 h-8 p-0" :title="item.shortcut" :class="{ 'bg-accent': item.name === currentAlign }"
          @click="handleAlign(item.name)"
        >
          <Icon
            :name="item.icon" class="w-4 h-4"
            :class="{ 'text-background': item.name === currentAlign }"
          />
        </Button>
      </template>
    </div>

    <!-- Editable title -->
    <div class="relative w-full">
      <div
        ref="editor"
        :contenteditable="!previewSlideStore.isPreviewing && specialType !== 'answer' && editable"
        class="w-full min-h-[60px] text-3xl bg-card/80 backdrop-blur-sm p-4 rounded-md border-0 focus:outline-none focus:ring-0 empty:before:content-[attr(placeholder)] empty:before:text-gray-400/50 overflow-auto scrollbar-hidden"
        :class="{
          'text-center': currentAlign === 'center',
          'text-right': currentAlign === 'right',
          'text-justify': currentAlign === 'justify',
          'text-left': currentAlign === '',
        }"
        v-bind="$attrs"
        :placeholder="placeholder"
        @blur="handleUpdate"
        @paste="handlePaste"
        v-html="decode(modelValue)"
      />
      <div
        v-if="!specialType && !previewSlideStore.isPreviewing"
        class="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform"
      />
    </div>
  </div>
</template>

<style scoped>
.empty::before {
  content: attr(placeholder);
  color: rgba(156, 163, 175, 0.5);
  pointer-events: none;
}
</style>
