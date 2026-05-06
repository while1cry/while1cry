<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

interface Props {
  text: string
  speed?: number
  startDelay?: number
  cursor?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speed: 80,
  startDelay: 400,
  cursor: true,
})

const emit = defineEmits<{
  complete: []
}>()

const textRef = ref(props.text)
const { displayedText, isTyping, isDone, start } = useTypewriter({
  text: textRef,
  speed: props.speed,
  startDelay: props.startDelay,
  onComplete: () => emit('complete'),
})

const showCursor = computed(() => props.cursor && !isDone)

onMounted(() => {
  start()
})

defineExpose({ start, isTyping, isDone })
</script>

<template>
  <span
    class="typewriter"
    :class="{ 'is-done': isDone }"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ displayedText }}
    <span v-if="showCursor" class="cursor" :class="{ 'is-typing': isTyping }">|</span>
  </span>
</template>

<style scoped>
.typewriter {
  white-space: pre-wrap;
}

.cursor {
  color: var(--color-starlight);
  opacity: 0;
  font-weight: 300;
}

.cursor.is-typing {
  animation: cursor-blink 0.8s step-end infinite;
  opacity: 1;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
