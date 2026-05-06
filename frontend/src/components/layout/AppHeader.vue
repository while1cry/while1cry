<script setup lang="ts">
import AppLink from '@/components/common/AppLink.vue'
import { navItems } from '@/data/navigation'
import { useActiveNav } from '@/composables/useActiveNav'

const { isActive } = useActiveNav()
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-name">while1cry</span>
        <span class="brand-subtle">.me</span>
      </RouterLink>

      <nav class="nav">
        <AppLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['nav-link', { 'is-active': isActive(item.to) }]"
        >
          {{ item.label }}
        </AppLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-height);
  backdrop-filter: blur(12px);
  background: rgba(6, 6, 14, 0.75);
  border-bottom: var(--border-subtle);
}

.header-inner {
  max-width: var(--content-wide-max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-serif);
}

.brand-name {
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  transition: color var(--duration-fast);
}

.brand-subtle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  transition: color var(--duration-fast);
}

.brand:hover .brand-name {
  color: var(--color-starlight);
}

.brand:hover .brand-subtle {
  color: var(--color-starlight-dim);
}

.nav {
  display: flex;
  gap: var(--space-xl);
}

.nav-link {
  font-size: var(--text-sm);
  letter-spacing: 0.05em;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-starlight);
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.nav-link:hover::after,
.nav-link.is-active::after {
  width: 100%;
}

.nav-link.is-active {
  color: var(--color-starlight);
}

@media (max-width: 640px) {
  .header-inner {
    justify-content: center;
    gap: var(--space-md);
  }

  .brand {
    display: flex;
    position: absolute;
    left: var(--space-lg);
  }

  .brand-name {
    font-size: var(--text-sm);
  }

  .brand-subtle {
    font-size: var(--text-xs);
  }

  .nav {
    gap: var(--space-md);
  }
}
</style>
