<script setup lang="ts">
import { computed, ref } from 'vue';
import type { NavItem } from '@/components/Header.vue';

const props = defineProps<{
  items: NavItem[];
  parentSlug?: string;
}>();

const activeItemIndex = ref<number | null>(null);

const emit = defineEmits<{
  (e: 'activeItemIndex', index: number): void;
}>();

const onButtonClick = (index: number) => {
  activeItemIndex.value = index;
  emit('activeItemIndex', index);
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
    class="relative py-4 px-[20px] flex flex-wrap justify-around shadow-menu gap-y-4 bg-[url(../assets/images/page-background.jpg)] bg-repeat"
  >
    <template
      v-for="(item, index) in items"
      :key="item.label"
    >
      <a
        v-if="!item.subNavItems"
        class="min-w-1/7 text-center font-francois-one text-16px 2xl:text-22px leading-none font-normal tracking-wider uppercase transition-colors text-shadow-regular rounded-md outline-gold outline-solid outline-0 focus-visible:outline-2"
        :class="{
          'text-black hover:text-gold':
            index !== currentRouteItemIndex && index !== activeItemIndex,
          'text-gold':
            index === currentRouteItemIndex || index === activeItemIndex,
        }"
        :href="parentSlug ? `/${parentSlug}/${item.slug}` : `/${item.slug}`"
      >
        {{ item.label }}
      </a>

      <button
        v-else
        class="min-w-1/7 font-francois-one text-16px 2xl:text-22px leading-none font-normal tracking-wider uppercase transition-colors text-shadow-regular"
        @click="onButtonClick(index)"
        :class="{
          'text-black hover:text-gold':
            index !== currentRouteItemIndex && index !== activeItemIndex,
          'text-gold':
            index === currentRouteItemIndex || index === activeItemIndex,
        }"
      >
        {{ item.label }}
      </button>
    </template>
  </div>
</template>
