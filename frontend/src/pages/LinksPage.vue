<script setup lang="ts">
import { socialLinks } from '@/data/social'
import SocialIcon from '@/components/common/SocialIcon.vue'
</script>

<template>
  <section class="page">
    <h1 class="page-title">社交链接</h1>
    <p class="page-desc">若你恰巧路过，不妨留下一道星痕。</p>

    <div class="links-list">
      <component
        :is="link.url ? 'a' : 'div'"
        v-for="link in socialLinks"
        :key="link.name"
        :href="link.url || undefined"
        :target="link.url ? '_blank' : undefined"
        :rel="link.url ? 'noopener noreferrer' : undefined"
        class="link-item"
      >
        <span class="link-icon">
          <SocialIcon :name="link.icon" :size="18" />
        </span>

        <span class="link-body">
          <span class="link-name">{{ link.name }}</span>
          <span v-if="link.handle" class="link-handle">{{ link.handle }}</span>
        </span>

        <span v-if="link.url" class="link-arrow">→</span>
        <span v-else class="link-arrow is-static">—</span>
      </component>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg);
  min-height: calc(100vh - var(--header-height));
}

.page-title {
  font-size: var(--text-3xl);
  color: var(--color-starlight);
  text-align: center;
  margin-bottom: var(--space-sm);
}

.page-desc {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3xl);
  font-family: var(--font-serif);
}

/* ── Links List ───────────────── */

.links-list {
  display: flex;
  flex-direction: column;
  max-width: 420px;
  margin: 0 auto;
}

.link-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-md);
  min-height: 56px;
  border-bottom: var(--border-subtle);
  color: var(--color-text-secondary);
  transition:
    color var(--duration-fast) var(--ease-out-quart),
    background var(--duration-fast) var(--ease-out-quart);
}

a.link-item:hover {
  color: var(--color-starlight);
  background: rgba(232, 213, 183, 0.03);
}

.link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(123, 143, 199, 0.08);
  border: 1px solid rgba(123, 143, 199, 0.1);
  color: var(--color-nebula);
  flex-shrink: 0;
  transition:
    background var(--duration-fast) var(--ease-out-quart),
    border-color var(--duration-fast) var(--ease-out-quart),
    color var(--duration-fast) var(--ease-out-quart);
}

a.link-item:hover .link-icon {
  background: rgba(232, 213, 183, 0.08);
  border-color: rgba(232, 213, 183, 0.12);
  color: var(--color-starlight);
}

.link-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.link-name {
  font-family: var(--font-serif);
  font-size: var(--text-base);
}

.link-handle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.link-arrow {
  color: var(--color-text-muted);
  transition:
    color var(--duration-fast),
    transform var(--duration-normal) var(--ease-out-quart);
  font-size: var(--text-sm);
}

a.link-item:hover .link-arrow {
  color: var(--color-starlight);
  transform: translateX(4px);
}

.link-arrow.is-static {
  opacity: 0.3;
}
</style>
