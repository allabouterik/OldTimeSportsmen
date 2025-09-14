<script setup lang="ts">
import { computed, ref } from 'vue';
import type { NavItem } from '@/components/Header.vue';

const props = defineProps<{
  items: NavItem[];
  parentSlug?: string;
  onNavClick?: (item: NavItem, index: number) => void;
}>();

const activeItemIndex = ref<number | null>(null);

const emit = defineEmits<{
  (e: 'activeItemIndex', index: number): void;
}>();

// Helper function to recursively find the first available page
const getFirstAvailablePage = (
  navItem: NavItem,
  pathSoFar: string = ''
): string => {
  // If this item has no subNavItems, it's a final page
  if (!navItem.subNavItems || navItem.subNavItems.length === 0) {
    return `${pathSoFar}/${navItem.slug}`;
  }

  // If it has subNavItems, recursively check the first one
  const firstSubItem = navItem.subNavItems[0];
  return getFirstAvailablePage(firstSubItem, `${pathSoFar}/${navItem.slug}`);
};

const onButtonClick = (item: NavItem, index: number) => {
  if (props.onNavClick) {
    // Use the custom navigation handler
    props.onNavClick(item, index);
  } else if (item.subNavItems) {
    // If item has subNavItems, navigate to the first available page
    const basePath = props.parentSlug ? `/${props.parentSlug}` : '';
    const targetUrl = getFirstAvailablePage(item, basePath);
    window.location.href = targetUrl;
  } else {
    // Default behavior for items without subNavItems - emit the event
    activeItemIndex.value = index;
    emit('activeItemIndex', index);
  }
};

const currentRoute = ref(window.location.pathname);

const currentRouteItemIndex = computed(() =>
  props.items.findIndex((item) =>
    currentRoute.value.includes(`/${props.parentSlug}/${item.slug}`)
  )
);
</script>

<template>
  <div
    class="relative py-3 px-[20px] flex flex-wrap justify-around border-b-4 border-b-green-olive gap-y-2 bg-[url(../assets/images/header-background.png)] bg-[size:100%_280px] bg-no-repeat"
  >
    <template
      v-for="(item, index) in items"
      :key="item.label"
    >
      <a
        v-if="!item.subNavItems"
        class="labelText min-w-1/7 text-center font-francois-one text-24px tracking-[-0.02em] 2xl:text-30px leading-none font-normal uppercase transition-colors text-shadow-regular rounded-md outline-gold outline-solid outline-0 focus-visible:outline-2 py-1"
        :class="{
          'text-black':
            index !== currentRouteItemIndex && index !== activeItemIndex,
          active: index === currentRouteItemIndex || index === activeItemIndex,
        }"
        :href="parentSlug ? `/${parentSlug}/${item.slug}` : `/${item.slug}`"
      >
        {{ item.label }}
      </a>

      <button
        v-else
        class="labelText min-w-1/7 font-francois-one text-24px tracking-[-0.02em] 2xl:text-30px leading-none font-normal uppercase transition-colors text-shadow-regular rounded-md outline-gold outline-solid outline-0 focus-visible:outline-2 py-1"
        @click="onButtonClick(item, index)"
        :class="{
          'text-black':
            index !== currentRouteItemIndex && index !== activeItemIndex,
          active: index === currentRouteItemIndex || index === activeItemIndex,
        }"
      >
        {{ item.label }}
      </button>
    </template>
  </div>
</template>

<style lang="scss">
.labelText {
  &.active,
  &:hover {
    -webkit-text-stroke: 0.8px var(--color-gold);
    text-shadow: 1px 2px 2px #0000004d;

    @media screen and (min-width: 1920px) {
      -webkit-text-stroke: 1px var(--color-gold);
    }
  }
}
</style>
