<script setup lang="ts">
import { ref } from 'vue';
import houseWithSmokeImage from '@/assets/images/house-with-smoke.png';
import houseWithoutSmokeImage from '@/assets/images/house-without-smoke.png';
import homeSweetHomeImage from '@/assets/images/home-sweet-home.png';

const isHouseWithSmoke = ref(false);

const navItems = [
  {
    label: 'POSTAL GALLERY',
    href: '/gallery',
    bgColor: 'bg-green-olive',
    secondaryNavItems: [
      {
        label: 'HUNTING',
        href: '/hunting',
      },
      {
        label: 'FISHING',
        href: '/fishing',
      },
      {
        label: 'CAMP & CABIN',
        href: '/camp-cabin',
      },
      {
        label: 'TALL TALES',
        href: '/tall-tales',
      },
    ],
  },
  {
    label: 'THE BOOK',
    href: '/book',
    bgColor: 'bg-black',
  },
  {
    label: 'CONTACT & CREDITS',
    href: '/contact',
    bgColor: 'bg-brown-dark',
  },
];

const currentRoute = ref(window.location.pathname);

const activePrimaryNavItemIndex = ref(
  navItems.findIndex(
    (item) =>
      item.href === currentRoute.value ||
      (item.href === '/gallery' && currentRoute.value === '/')
  )
);

const activeSecondaryNavItem = ref(null);
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
        <img
          :src="homeSweetHomeImage.src"
          alt="Home Sweet Home"
          class="h-[34px] self-end mb-3"
        />
      </a>

      <!-- Main Navigation Items -->
      <div class="flex">
        <div
          v-for="(item, index) in navItems"
          :key="item.href"
          class="min-w-[280px] text-center"
          :class="{
            'z-50': index === 0,
            'z-30': index === 1,
            'z-20': index === 2,
            '-ml-4': index > 0,
          }"
        >
          <a
            :href="item.href"
            class="block absolute -bottom-1 min-w-[280px] border-t-4 border-x-4 border-gold pt-4 pb-3 px-8 rounded-t-xl"
            :class="[
              item.bgColor,
              { 'border-b-green-olive': index === activePrimaryNavItemIndex },
            ]"
          >
            <h2
              class="text-48px leading-none text-cream font-garage-gothic font-medium tracking-wider"
              :class="{ 'text-gold': item.href === currentRoute }"
            >
              {{ item.label }}
            </h2>
          </a>
        </div>
      </div>
    </div>

    <!-- Secondary Navigation Bar with Categories -->
    <div
      v-if="
        activePrimaryNavItemIndex !== null &&
        navItems[activePrimaryNavItemIndex].secondaryNavItems
      "
      class="relative bg-green-olive py-4 px-[20px] flex justify-center gap-36 border-t-4 border-gold z-40"
    >
      <a
        v-for="(item, index) in navItems[activePrimaryNavItemIndex]
          .secondaryNavItems"
        :key="item.href"
        :href="item.href"
        class="font-garage-gothic text-[52px] leading-none text-green-gray font-medium tracking-wider hover:text-cream transition-colors"
        >{{ item.label }}</a
      >
    </div>
    <div
      v-else
      class="relative bg-green-olive flex border-t-4 border-gold z-50"
    ></div>
  </nav>
</template>
