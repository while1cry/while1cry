<script setup lang="ts">
import { ref } from 'vue'

interface Question {
  id: string
  label: string
  hint: string
}

const questions: Question[] = [
  {
    id: 'q1',
    label: '在无尽循环中，你是 break 还是 continue？',
    hint: '你的答案',
  },
  {
    id: 'q2',
    label: '若代码是一首诗，你最爱的那一行写着什么？',
    hint: '你的答案',
  },
  {
    id: 'q3',
    label: 'while(1) { cry; } —— 你会如何跳出这个循环？',
    hint: '你的答案',
  },
]

const errorMessages = [
  '星辰尚未对齐，答案仍沉睡在虚空之中。',
  '频率对不上。也许，还不是时候。',
  '这道门认人。你不是我要等的访客。',
  '答案从指尖滑过，像一通未能接起的星际连线。',
  '错位的字节，无法编译成通行证。',
]

const answers = ref<Record<string, string>>({
  q1: '',
  q2: '',
  q3: '',
})

const error = ref('')
const submitted = ref(false)

function submit() {
  submitted.value = true

  const allFilled = questions.every((q) => {
    const ans = answers.value[q.id]
    return ans !== undefined && ans.trim() !== ''
  })
  if (!allFilled) {
    error.value = '有些问题还在等待回答，像深空中尚未被观测的星。'
    return
  }

  const random = errorMessages[Math.floor(Math.random() * errorMessages.length)]!
  error.value = random
}

function clearError() {
  error.value = ''
}
</script>

<template>
  <section class="page">
    <div class="gate">
      <span class="gate-symbol">✦</span>
      <p class="gate-desc">你找到了一扇门。但它不认识你。</p>
    </div>

    <form class="form" @submit.prevent="submit">
      <div v-for="q in questions" :key="q.id" class="field">
        <label :for="q.id" class="field-label">{{ q.label }}</label>
        <input
          :id="q.id"
          v-model="answers[q.id]"
          type="text"
          :placeholder="q.hint"
          class="field-input"
          autocomplete="off"
          @input="clearError"
        />
      </div>

      <button type="submit" class="submit-btn">
        叩门
      </button>
    </form>

    <Transition name="error-msg">
      <p
        v-if="submitted && error"
        class="error"
        role="status"
        aria-live="polite"
      >
        {{ error }}
      </p>
    </Transition>
  </section>
</template>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl) var(--space-lg);
  min-height: calc(100vh - var(--header-height));
}

/* ── Gate ─────────────────────── */

.gate {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.gate-symbol {
  display: block;
  font-size: 2rem;
  color: var(--color-starlight);
  margin-bottom: var(--space-md);
  animation: pulse-glow 3s ease-in-out infinite;
}

.gate-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-family: var(--font-serif);
}

/* ── Form ─────────────────────── */

.form {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-serif);
  line-height: var(--leading-relaxed);
}

.field-input {
  padding: var(--space-sm) var(--space-md);
  min-height: 44px;
  background: var(--color-space);
  border: var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-serif);
  font-size: var(--text-base);
  transition:
    border-color var(--duration-fast) var(--ease-out-quart),
    box-shadow var(--duration-fast) var(--ease-out-quart);
  outline: none;
}

.field-input:focus {
  border-color: var(--color-nebula-dim);
  box-shadow: 0 0 0 2px rgba(123, 143, 199, 0.15);
}

.field-input::placeholder {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

/* ── Submit Button ────────────── */

.submit-btn {
  align-self: center;
  padding: var(--space-sm) var(--space-2xl);
  min-height: 44px;
  border: var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--ease-out-quart),
    border-color var(--duration-fast) var(--ease-out-quart),
    background var(--duration-fast) var(--ease-out-quart),
    transform var(--duration-fast) var(--ease-out-quart);
}

.submit-btn:hover {
  color: var(--color-starlight);
  border-color: var(--color-starlight-dim);
  background: rgba(232, 213, 183, 0.05);
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: scale(0.97);
}

/* ── Error ────────────────────── */

.error {
  margin-top: var(--space-xl);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-starlight-dim);
  font-family: var(--font-serif);
  max-width: 360px;
  line-height: var(--leading-relaxed);
}

/* ── Transition ───────────────── */

.error-msg-enter-active {
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.error-msg-leave-active {
  transition: all var(--duration-fast) var(--ease-out-expo);
}

.error-msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.error-msg-leave-to {
  opacity: 0;
}
</style>
