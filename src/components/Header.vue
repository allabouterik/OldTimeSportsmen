<script setup lang="ts">
import NavigationDesktop from '@/components/NavigationDesktop.vue';
import NavigationMobile from '@/components/NavigationMobile.vue';
import headerImageDesktop from '@/assets/images/old-time-logo-desktop.png';
import headerImageMobilePt1 from '@/assets/images/old-time-logo-mobile-pt1.png';
import headerImageMobilePt2 from '@/assets/images/old-time-logo-mobile-pt2.png';
import menuBurgerIcon from '@/assets/icons/menu-burger.svg';
import { ref } from 'vue';

export type NavItem = {
  label: string;
  href?: string;
  bgColor?: string;
  icon?: string;
  subNavItems?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: 'POSTAL GALLERY',
    href: '/gallery',
    bgColor: 'bg-green-olive',
    icon: 'gallery',
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
    icon: 'book',
  },
  {
    label: 'CONTACT & CREDITS',
    href: '/contact',
    bgColor: 'bg-brown-dark',
    icon: 'envelope',
  },
];

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header
    class="bg-[url(../assets/images/header-background.png)] bg-[size:100%_280px] bg-no-repeat py-4 xl:pt-14 xl:pb-0"
  >
    <!-- Mobile -->
    <button
      class="fixed xl:hidden top-3 left-3 sm:top-4 sm:left-4 z-10"
      @click="toggleMenu"
    >
      <img
        :src="menuBurgerIcon.src"
        alt="Burger Icon"
      />
    </button>

    <img
      :src="headerImageMobilePt1.src"
      alt="Header Image"
      class="xl:hidden h-[27px] mx-auto mb-2"
    />
    <img
      :src="headerImageMobilePt2.src"
      alt="Header Image"
      class="xl:hidden h-[27px] mx-auto"
    />
    <NavigationMobile
      class="xl:hidden"
      :navItems="navItems"
      v-model="isMenuOpen"
    />

    <!-- Desktop -->
    <img
      :src="headerImageDesktop.src"
      alt="Header Image"
      class="hidden xl:block h-[54px] 2xl:h-[68px] mx-auto mb-14"
    />
    <NavigationDesktop
      class="hidden xl:block"
      :navItems="navItems"
    />
  </header>
</template>
