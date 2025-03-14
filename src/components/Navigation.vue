<script setup lang="ts">
import { ref } from 'vue';
import houseWithSmokeImage from '@/assets/images/house-with-smoke.png';
import houseWithoutSmokeImage from '@/assets/images/house-without-smoke.png';
import DesktopNavSubMenu from '@/components/DesktopNavSubMenu.vue';

const isHouseWithSmoke = ref(false);

export type NavItem = {
  label: string;
  href?: string;
  bgColor?: string;
  subNavItems?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: 'POSTAL GALLERY',
    href: '/gallery',
    bgColor: 'bg-green-olive',
    subNavItems: [
      {
        label: 'HUNTING',
        href: '/hunting',
        subNavItems: [
          {
            label: 'BIG GAME',
            subNavItems: [
              {
                label: 'DEER',
                href: '/hunting/big-game/deer',
              },
              {
                label: 'BEAR',
                href: '/hunting/big-game/bear',
              },
              {
                label: 'SHEEP,GOATS, ETC',
                href: '/hunting/big-game/sheep-goats-etc',
              },
              {
                label: 'CATS',
                href: '/hunting/big-game/cats',
              },
              {
                label: 'WOLVES,COYOTES',
                href: '/hunting/big-game/wolves-coyotes',
              },
              {
                label: 'ALLIGATORS',
                href: '/hunting/big-game/alligators',
              },
            ],
          },
          {
            label: 'SMALL GAME',
            href: '/hunting/small-game',
          },
          {
            label: 'BIRDS',
            href: '/birds',
          },
          {
            label: "HUNTIN' GALS",
            href: '/huntin-gals',
          },
          {
            label: 'PORTRAITS',
            href: '/portraits',
          },
          {
            label: 'YOUNG HUNTERS',
            href: '/young-hunters',
          },
          {
            label: "HUNTIN' DOGS",
            href: '/huntin-dogs',
          },
        ],
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
        class="flex h-[85px] items-center ml-8 px-8 py-1 hover:cursor-pointer text-black hover:text-gold"
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
          class="inline-block font-garage-gothic text-5xl leading-none font-medium mt-5 text-shadow"
          >HOME SWEET HOME</span
        >
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

    <!-- Level 2 Navigation Bar with Categories -->
    <div
      v-if="
        activePrimaryNavItemIndex !== null &&
        navItems[activePrimaryNavItemIndex].subNavItems
      "
      class="relative bg-green-olive py-4 px-[20px] flex justify-center gap-36 border-t-4 border-gold z-40 shadow-menu"
    >
      <button
        v-for="(item, index) in navItems[activePrimaryNavItemIndex].subNavItems"
        :key="item.label"
        class="font-garage-gothic text-[52px] leading-none font-medium tracking-wider transition-colors"
        :class="{
          'text-green-gray hover:text-cream': activeLevel2NavItem !== index,
          'text-gold': activeLevel2NavItem === index,
        }"
        @click="activeLevel2NavItem = index"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-else
      class="relative bg-green-olive flex border-t-4 border-gold z-50"
    ></div>

    <!-- Level 3 Navigation Items -->
    <DesktopNavSubMenu
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
