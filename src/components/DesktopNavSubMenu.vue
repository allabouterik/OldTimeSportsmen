<script setup lang="ts">
import { ref } from 'vue';
import type { NavItem } from '@/components/Navigation.vue';

const props = defineProps<{
  items: NavItem[];
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

const activeLinkItemIndex = ref(
  props.items.findIndex((item) => item.href && item.href === currentRoute.value)
);
</script>

<template>
  <div class="relative py-4 px-[20px] flex justify-around z-40 shadow-menu">
    <template
      v-for="(item, index) in items"
      :key="item.label"
    >
      <a
        v-if="item.href"
        class="font-francois-one text-[22px] leading-none font-normal tracking-wider transition-colors text-shadow"
        :class="{
          'text-black hover:text-brown-dark': activeLinkItemIndex !== index,
          'text-gold': activeLinkItemIndex === index,
        }"
        :href="item.href"
      >
        {{ item.label }}
      </a>

      <button
        v-else
        class="font-francois-one text-[22px] leading-none font-normal tracking-wider transition-colors text-shadow"
        @click="onButtonClick(index)"
        :class="{
          'text-black hover:text-brown-dark': activeItemIndex !== index,
          'text-gold': activeItemIndex === index,
        }"
      >
        {{ item.label }}
      </button>
    </template>
  </div>
</template>
