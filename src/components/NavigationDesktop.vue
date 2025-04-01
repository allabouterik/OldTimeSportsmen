<script setup lang="ts">
import { ref, computed } from 'vue';
import houseWithSmokeImage from '@/assets/images/house-with-smoke.png';
import houseWithoutSmokeImage from '@/assets/images/house-without-smoke.png';
import DesktopNavSubMenu from '@/components/DesktopNavSubMenu.vue';
import type { NavItem } from './Header.vue';

const isHouseWithSmoke = ref(false);

const isMacWebkit = computed(() => {
  const isChromiumOrFirefox =
    navigator.userAgent.indexOf('Chrome') > -1 ||
    navigator.userAgent.indexOf('Chromium') > -1 ||
    navigator.userAgent.indexOf('Firefox') > -1;

  const isMacPlatform =
    // Modern API
    (navigator as any).userAgentData?.platform === 'macOS' ||
    // Fallback for browsers that don't support userAgentData
    /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  return isMacPlatform && isChromiumOrFirefox;
});

const props = defineProps<{
  navItems: NavItem[];
}>();

const currentRoute = ref(window.location.pathname);

const activePrimaryNavItemIndex = ref(
  props.navItems.findIndex(
    (item) =>
      item.href === currentRoute.value ||
      (item.href === '/gallery' && currentRoute.value === '/')
  )
);

const activeLevel2NavItem = ref<number | null>(null);
const activeLevel3NavItem = ref<number | null>(null);
// const activeLevel4NavItem = ref<number | null>(null);
</script>

<template>
  <nav class="relative">
    <!-- Top Navigation Bar -->
    <div class="relative flex items-center">
      <!-- Home Menu Item -->
      <a
        href="/"
        class="flex h-[85px] items-center ml-8 px-8 py-1 hover:cursor-pointer"
        @mouseenter="isHouseWithSmoke = true"
        @mouseleave="isHouseWithSmoke = false"
      >
        <img
          :src="
            isHouseWithSmoke
              ? houseWithSmokeImage.src
              : houseWithoutSmokeImage.src
          "
          alt="Home Icon"
          class="w-[115px] self-end mr-1"
        />
        <span
          class="inline-block font-garage-gothic text-5xl text-black hover:text-green-olive leading-[0.8] font-medium mt-5 text-shadow"
          :class="[{ 'translate-y-4': isMacWebkit }]"
          >HOME SWEET HOME</span
        >
      </a>

      <!-- Main Navigation Items -->
      <div class="flex">
        <div
          v-for="(item, index) in navItems"
          :key="item.href"
          class="min-w-[280px]"
          :class="{
            'z-50': index === 0,
            'z-30': index === 1,
            'z-20': index === 2,
            '-ml-4': index > 0,
          }"
        >
          <a
            :href="item.href"
            class="flex items-center justify-center absolute -bottom-1 min-w-[280px] min-h-[74px] border-t-4 border-x-4 border-gold rounded-t-xl px-8"
            :class="[
              item.bgColor,
              { 'border-b-green-olive': index === activePrimaryNavItemIndex },
            ]"
          >
            <h2
              class="text-48px font-garage-gothic font-medium tracking-wider uppercase leading-none py-2"
              :class="[
                { 'text-cream hover:text-gold': item.href !== currentRoute },
                { 'text-gold': item.href === currentRoute },
                { 'translate-y-4': isMacWebkit },
              ]"
            >
              {{ item.label }}
            </h2>
          </a>
        </div>
      </div>
    </div>

    <!-- Level 2 Navigation Bar with Categories -->
    <div
      v-if="
        activePrimaryNavItemIndex !== null &&
        navItems[activePrimaryNavItemIndex].subNavItems
      "
      class="flex items-center justify-center gap-36 relative min-h-[74px] bg-green-olive border-t-4 border-gold z-40 shadow-menu py-4 px-[20px]"
    >
      <button
        v-for="(item, index) in navItems[activePrimaryNavItemIndex].subNavItems"
        :key="item.label"
        class="font-garage-gothic text-[52px] leading-none font-medium tracking-wider uppercase transition-colors"
        :class="[
          {
            'text-green-gray hover:text-gold': activeLevel2NavItem !== index,
            'text-gold': activeLevel2NavItem === index,
            'translate-y-4': isMacWebkit,
          },
        ]"
        @click="
          activeLevel2NavItem = index;
          activeLevel3NavItem = null;
        "
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-else
      class="flex relative bg-green-olive border-t-4 border-gold z-50"
    ></div>

    <!-- Level 3 Navigation Items -->
    <DesktopNavSubMenu
      :key="`level2-index${activeLevel2NavItem}-level-3-subnav`"
      v-if="
        activeLevel2NavItem !== null &&
        navItems[activePrimaryNavItemIndex]?.subNavItems?.[activeLevel2NavItem]
          ?.subNavItems
      "
      :items="
        navItems[activePrimaryNavItemIndex]?.subNavItems?.[activeLevel2NavItem]
          ?.subNavItems ?? []
      "
      @activeItemIndex="activeLevel3NavItem = $event"
    />

    <!-- Level 4 Navigation Items -->
    <DesktopNavSubMenu
      key="level-4-subnav"
      v-if="
        activeLevel2NavItem !== null &&
        activeLevel3NavItem !== null &&
        navItems[activePrimaryNavItemIndex]?.subNavItems?.[activeLevel2NavItem]
          ?.subNavItems?.[activeLevel3NavItem]?.subNavItems
      "
      :items="
        navItems[activePrimaryNavItemIndex]?.subNavItems?.[activeLevel2NavItem]
          ?.subNavItems?.[activeLevel3NavItem]?.subNavItems ?? []
      "
    />
  </nav>
</template>
