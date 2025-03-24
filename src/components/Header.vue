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
    label: 'Postal Gallery',
    href: '/gallery',
    bgColor: 'bg-green-olive',
    icon: 'gallery',
    subNavItems: [
      {
        label: 'Hunting',
        href: '/hunting',
        subNavItems: [
          {
            label: 'Big Game',
            subNavItems: [
              {
                label: 'Deer',
                href: '/hunting/big-game/deer',
              },
              {
                label: 'Bear',
                href: '/hunting/big-game/bear',
              },
              {
                label: 'Moose, Sheep, etc.',
                href: '/hunting/big-game/sheep-goats-etc',
              },
              {
                label: 'Cats',
                href: '/hunting/big-game/cats',
              },
              {
                label: 'Wolves, Coyotes',
                href: '/hunting/big-game/wolves-coyotes',
              },
              {
                label: 'Alligators',
                href: '/hunting/big-game/alligators',
              },
            ],
          },
          {
            label: 'Small Game',
            subNavItems: [
              {
                label: 'Rabbits',
                href: '/hunting/small-game/rabbits',
              },
              {
                label: 'Rabbit Round-Ups',
                href: '/hunting/small-game/rabbit-round-ups',
              },
              {
                label: 'Squirrels, Skunks, etc.',
                href: '/hunting/small-game/squirrels-skunks-etc',
              },
              {
                label: 'Frogs, Snakes, etc.',
                href: '/hunting/small-game/frogs-snakes-etc',
              },
              {
                label: 'Foxes',
                href: '/hunting/small-game/foxes',
              },
            ],
          },
          {
            label: 'Birds',
            subNavItems: [
              {
                label: 'Ducks',
                href: '/hunting/birds/ducks',
              },
              {
                label: 'Geese',
                href: '/hunting/birds/geese',
              },
              {
                label: 'Upland Game Birds',
                href: '/hunting/birds/upland-game-birds',
              },
              {
                label: 'Other Birds',
                href: '/hunting/birds/other-birds',
              },
            ],
          },
          {
            label: "Huntin' Gals",
            href: '/huntin-gals',
          },
          {
            label: 'Portraits',
            href: '/portraits',
          },
          {
            label: 'Young Hunters',
            href: '/young-hunters',
          },
          {
            label: "Huntin' Dogs",
            href: '/huntin-dogs',
          },
        ],
      },
      {
        label: 'Fishing',
        subNavItems: [
          {
            label: 'Bass',
            href: '/fish  ing/bass',
          },
          {
            label: 'Carp',
            href: '/fishing/carp',
          },
          {
            label: 'Catfish',
            href: '/fishing/catfish',
          },
          {
            label: 'Florida Studio',
            href: '/fishing/florida-studio',
          },
          {
            label: 'Giant Sea Bass',
            href: '/fishing/giant-sea-bass',
          },
          {
            label: 'Halibut',
            href: '/fishing/halibut',
          },
          {
            label: 'Other Fish',
            href: '/fishing/other-fish',
          },
          {
            label: 'Pike, Muskie',
            href: '/fishing/pike-muskie',
          },
          {
            label: 'Stringers',
            href: '/fishing/stringers',
          },
          {
            label: 'Sturgeon',
            href: '/fishing/sturgeon',
          },
          {
            label: 'Tarpon  ',
            href: '/fishing/tarpon',
          },
          {
            label: 'Trout, Salmon',
            href: '/fishing/trout-salmon',
          },
          {
            label: 'Women Fishing',
            href: '/fishing/women-fishing',
          },
          {
            label: 'Young Fishermen',
            href: '/fishing/young-fishermen',
          },
        ],
      },
      {
        label: 'Camp & Cabin',
        subNavItems: [
          {
            label: 'Camp & Cabin',
            href: '/camp-cabin',
          },
          {
            label: 'Hunting Groups',
            href: '/camp-cabin/hunting-groups',
          },
          {
            label: 'Fishing Groups',
            href: '/camp-cabin/fishing-groups',
          },
          {
            label: 'Scenic',
            href: '/camp-cabin/scenic',
          },
        ],
      },
      {
        label: 'Tall Tales',
        subNavItems: [
          {
            label: 'Tall Tales Hunting',
            href: '/tall-tales/hunting',
          },
          {
            label: 'Tall Tales Fishing',
            href: '/tall-tales/fishing',
          },
          {
            label: 'Fakes',
            href: '/tall-tales/fakes',
          },
        ],
      },
    ],
  },
  {
    label: 'The Book',
    href: '/book',
    bgColor: 'bg-black',
    icon: 'book',
  },
  {
    label: 'Contact & Credits',
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
        alt="Menu Icon"
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
