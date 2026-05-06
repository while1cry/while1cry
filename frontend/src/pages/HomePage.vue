<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TypewriterText from '@/components/effects/TypewriterText.vue'

const hitokoto = ref('')
const hitokotoFrom = ref('')

const fallbackQuotes = [
  { text: '人间有味是清欢。', from: '苏轼' },
  { text: '且将新火试新茶，诗酒趁年华。', from: '苏轼' },
  { text: '此心安处是吾乡。', from: '苏轼' },
  { text: '满目山河空念远，落花风雨更伤春。', from: '晏殊' },
  { text: '醉后不知天在水，满船清梦压星河。', from: '唐温如' },
  { text: '世事一场大梦，人生几度秋凉。', from: '苏轼' },
  { text: '浮生只合尊前老，雪满长安道。', from: '舒亶' },
  { text: '人生如逆旅，我亦是行人。', from: '苏轼' },
]

const introText = '广袤互联网世界中无人问津的一隅'
const roleText = '偶尔写代码，时常发呆，永远好奇。'

const showRole = ref(false)

const introSpeed = computed(() => (window.innerWidth < 640 ? 60 : 80))

function onIntroDone() {
  showRole.value = true
}

onMounted(async () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(
      'https://v1.hitokoto.cn/?c=d&c=i&c=k&encode=text&max_length=40',
      { signal: controller.signal },
    )
    clearTimeout(timeout)
    if (res.ok) {
      const text = await res.text()
      hitokoto.value = text.trim()
      hitokotoFrom.value = ''
    } else {
      throw new Error('API unavailable')
    }
  } catch {
    clearTimeout(timeout)
    const index = Math.floor(Math.random() * fallbackQuotes.length)
    const random = fallbackQuotes[index]!
    hitokoto.value = random.text
    hitokotoFrom.value = `—— ${random.from}`
  }
})
</script>

<template>
  <section class="home">
    <div class="hero">
      <div class="name-group">
        <h1 class="name">while1cry</h1>
        <span class="domain">.me</span>
      </div>

      <p class="intro">
        <TypewriterText
          :text="introText"
          :speed="introSpeed"
          :start-delay="600"
          @complete="onIntroDone"
        />
      </p>

      <p class="role" :class="{ 'is-visible': showRole }">
        {{ roleText }}
      </p>
    </div>

    <div class="divider" />

    <div class="hitokoto fade-in-delayed" :class="{ 'is-visible': hitokoto }">
      <span class="hitokoto-label">✦ 一言</span>
      <blockquote class="hitokoto-text">{{ hitokoto || '\u00A0' }}</blockquote>
      <cite class="hitokoto-from">{{ hitokotoFrom || '\u00A0' }}</cite>
    </div>
  </section>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height));
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
  position: relative;
}

.home::before {
  content: '';
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse at center,
    rgba(123, 143, 199, 0.04) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* ── Hero ─────────────────────── */

.hero {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.name-group {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: var(--space-xl);
}

.name {
  font-size: clamp(2rem, 6vw, var(--text-5xl));
  color: var(--color-starlight);
  font-weight: 400;
  letter-spacing: 0.08em;
  font-family: var(--font-serif);
}

.domain {
  font-size: clamp(1rem, 3vw, var(--text-2xl));
  color: var(--color-starlight-dim);
  font-family: var(--font-serif);
}

.intro {
  font-size: clamp(0.875rem, 2vw, var(--text-lg));
  color: var(--color-text-secondary);
  font-family: var(--font-serif);
  min-height: 1.75em;
  margin-bottom: var(--space-md);
}

.role {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  min-height: 1.6em;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out-expo);
}

.role.is-visible {
  opacity: 1;
}

/* ── Divider ──────────────────── */

.divider {
  width: 40px;
  height: 1px;
  background: var(--color-nebula-weak);
  margin-bottom: var(--space-2xl);
}

/* ── 一言 ─────────────────────── */

.hitokoto {
  text-align: center;
  max-width: var(--content-max-width);
  padding: 0 var(--space-md);
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out-expo);
}

.hitokoto.is-visible {
  opacity: 1;
}

.hitokoto-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-md);
  text-transform: uppercase;
}

.hitokoto-text {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 3vw, var(--text-xl));
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-sm);
}

.hitokoto-from {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-style: normal;
  font-family: var(--font-serif);
  min-height: 1.5em;
}

/* ── Animations ───────────────── */

.fade-in {
  animation: fade-in var(--duration-slow) var(--ease-out-expo) both;
}

.fade-in-delayed {
  animation: fade-in-up var(--duration-slow) var(--ease-out-expo) var(--duration-slow) both;
}
</style>
