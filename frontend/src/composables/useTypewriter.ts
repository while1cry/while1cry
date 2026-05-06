import { onUnmounted, ref, type Ref } from 'vue'

interface TypewriterOptions {
  text: Ref<string>
  speed?: Ref<number> | number
  startDelay?: number
  onComplete?: () => void
}

export function useTypewriter(options: TypewriterOptions) {
  const { text, speed = 80, startDelay = 300, onComplete } = options

  const displayedText = ref('')
  const isTyping = ref(false)
  const isDone = ref(false)

  let index = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function typeNext() {
    const textVal = text.value
    if (index >= textVal.length) {
      isTyping.value = false
      isDone.value = true
      onComplete?.()
      return
    }

    displayedText.value += textVal[index]
    index++

    const delay =
      typeof speed === 'number' ? speed : speed.value
    const variation = delay * (0.3 + Math.random() * 0.7)

    timeoutId = setTimeout(typeNext, variation)
  }

  function start() {
    reset()
    isTyping.value = true

    timeoutId = setTimeout(() => {
      typeNext()
    }, startDelay)
  }

  function reset() {
    if (timeoutId) clearTimeout(timeoutId)
    displayedText.value = ''
    index = 0
    isTyping.value = false
    isDone.value = false
  }

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  return {
    displayedText,
    isTyping,
    isDone,
    start,
    reset,
  }
}
