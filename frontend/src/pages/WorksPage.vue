<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types'

const projects = ref<Project[]>([
  {
    id: 'napcat4j',
    title: 'NapCat4J',
    description: '基于 NapCatQQ 的 Java SDK，为 QQ 机器人开发提供优雅的接口封装。',
    url: 'https://github.com/while1cry/NapCat4J',
    tags: ['Java', 'QQ Bot', 'SDK'],
  },
  {
    id: 'kamihub',
    title: 'KamiHub',
    description: 'Spigot 大厅管理插件，为 Minecraft 服务器提供便捷的大厅管理功能。',
    url: 'https://github.com/KamiLand-Network/KamiHub',
    tags: ['Java', 'Minecraft', 'Spigot'],
  },
  {
    id: 'ocular',
    title: 'Ocular',
    description: 'AI 赋能的自托管知识库，让知识管理更加智能与高效。',
    url: 'https://github.com/while1cry/Ocular',
    tags: ['AI', '知识库', 'Self-hosted'],
  },
])

const hoveredId = ref<string | null>(null)
</script>

<template>
  <section class="page">
    <h1 class="page-title">作品集</h1>
    <p class="page-desc">一些在深夜写下的代码，散落在 GitHub 的星海之中。</p>

    <div class="grid">
      <a
        v-for="project in projects"
        :key="project.id"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="card"
        :class="{ 'is-hovered': hoveredId === project.id }"
        @mouseenter="hoveredId = project.id"
        @mouseleave="hoveredId = null"
      >
        <h2 class="card-title">{{ project.title }}</h2>
        <p class="card-desc">{{ project.description }}</p>
        <div class="card-tags">
          <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <span class="card-arrow">→</span>
      </a>
    </div>

    <div v-if="projects.length === 0" class="empty">
      <p>此间尚未有作品栖居。</p>
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

/* ── Grid ─────────────────────── */

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

/* ── Card ─────────────────────── */

.card {
  position: relative;
  display: block;
  padding: var(--space-xl);
  background: var(--color-space);
  border: 1px solid rgba(123, 143, 199, 0.1);
  border-radius: var(--radius-md);
  transition:
    transform var(--duration-normal) var(--ease-out-quart),
    border-color var(--duration-normal) var(--ease-out-quart),
    box-shadow var(--duration-normal) var(--ease-out-quart);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(123, 143, 199, 0.06),
    transparent 40%
  );
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out-quart);
  pointer-events: none;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--color-nebula-dim);
  box-shadow: 0 4px 24px rgba(123, 143, 199, 0.1), 0 0 0 1px rgba(123, 143, 199, 0.06);
}

.card:hover::before {
  opacity: 1;
}

.card-title {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  font-weight: 400;
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-md);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--text-xs);
  color: var(--color-nebula);
  background: rgba(123, 143, 199, 0.1);
  border: 1px solid rgba(123, 143, 199, 0.15);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

.card-arrow {
  position: absolute;
  top: var(--space-xl);
  right: var(--space-xl);
  color: var(--color-text-muted);
  transition:
    color var(--duration-fast) var(--ease-out-quart),
    transform var(--duration-normal) var(--ease-out-quart);
  font-size: var(--text-lg);
}

.card:hover .card-arrow {
  color: var(--color-starlight);
  transform: translateX(4px);
}

/* ── Empty ────────────────────── */

.empty {
  text-align: center;
  padding: var(--space-3xl) 0;
  color: var(--color-text-muted);
  font-family: var(--font-serif);
}

/* ── Responsive ───────────────── */

@media (max-width: 640px) {
  .card {
    padding: var(--space-lg);
  }
  .card-arrow {
    top: var(--space-lg);
    right: var(--space-lg);
  }
}
</style>
