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
  slug?: string;
  bgColor?: string;
  icon?: string;
  subNavItems?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: 'Postal Gallery',
    slug: 'gallery',
    bgColor: 'bg-green-olive',
    icon: 'gallery',
    subNavItems: [
      {
        label: 'Hunting',
        slug: 'hunting',
        subNavItems: [
          {
            label: 'Big Game',
            slug: 'big-game',
            subNavItems: [
              {
                label: 'Deer',
                slug: 'deer',
              },
              {
                label: 'Bear',
                slug: 'bear',
              },
              {
                label: 'Moose, Sheep, etc.',
                slug: 'sheep-goats-etc',
              },
              {
                label: 'Cats',
                slug: 'cats',
              },
              {
                label: 'Wolves, Coyotes',
                slug: 'wolves-coyotes',
              },
              {
                label: 'Alligators',
                slug: 'alligators',
              },
            ],
          },
          {
            label: 'Small Game',
            slug: 'small-game',
            subNavItems: [
              {
                label: 'Rabbits',
                slug: 'rabbits',
              },
              {
                label: 'Rabbit Round-Ups',
                slug: 'rabbit-round-ups',
              },
              {
                label: 'Squirrels, Skunks, etc.',
                slug: 'squirrels-skunks-etc',
              },
              {
                label: 'Frogs, Snakes, etc.',
                slug: 'frogs-snakes-etc',
              },
              {
                label: 'Foxes',
                slug: 'foxes',
              },
            ],
          },
          {
            label: 'Birds',
            slug: 'birds',
            subNavItems: [
              {
                label: 'Ducks',
                slug: 'ducks',
              },
              {
                label: 'Geese',
                slug: 'geese',
              },
              {
                label: 'Upland Game Birds',
                slug: 'upland-game-birds',
              },
              {
                label: 'Other Birds',
                slug: 'other-birds',
              },
            ],
          },
          {
            label: "Huntin' Gals",
            slug: 'huntin-gals',
          },
          {
            label: 'Portraits',
            slug: 'portraits',
          },
          {
            label: 'Young Hunters',
            slug: 'young-hunters',
          },
          {
            label: "Huntin' Dogs",
            slug: 'huntin-dogs',
          },
        ],
      },
      {
        label: 'Fishing',
        slug: 'fishing',
        subNavItems: [
          {
            label: 'Bass',
            slug: 'bass',
          },
          {
            label: 'Carp',
            slug: 'carp',
          },
          {
            label: 'Catfish',
            slug: 'catfish',
          },
          {
            label: 'Florida Studio',
            slug: 'florida-studio',
          },
          {
            label: 'Giant Sea Bass',
            slug: 'giant-sea-bass',
          },
          {
            label: 'Halibut',
            slug: 'halibut',
          },
          {
            label: 'Other Fish',
            slug: 'other-fish',
          },
          {
            label: 'Pike, Muskie',
            slug: 'pike-muskie',
          },
          {
            label: 'Stringers',
            slug: 'stringers',
          },
          {
            label: 'Sturgeon',
            slug: 'sturgeon',
          },
          {
            label: 'Tarpon  ',
            slug: 'tarpon',
          },
          {
            label: 'Trout, Salmon',
            slug: 'trout-salmon',
          },
          {
            label: 'Women Fishing',
            slug: 'women-fishing',
          },
          {
            label: 'Young Fishermen',
            slug: 'young-fishermen',
          },
        ],
      },
      {
        label: 'Camp & Cabin',
        slug: 'camp-cabin',
        subNavItems: [
          {
            label: 'Camp & Cabin',
            slug: 'camp-cabin',
          },
          {
            label: 'Hunting Groups',
            slug: 'hunting-groups',
          },
          {
            label: 'Fishing Groups',
            slug: 'fishing-groups',
          },
          {
            label: 'Scenic',
            slug: 'scenic',
          },
        ],
      },
      {
        label: 'Tall Tales',
        slug: 'tall-tales',
        subNavItems: [
          {
            label: 'Tall Tales Hunting',
            slug: 'hunting',
          },
          {
            label: 'Tall Tales Fishing',
            slug: 'fishing',
          },
          {
            label: 'Fakes',
            slug: 'fakes',
          },
        ],
      },
    ],
  },
  {
    label: 'The Book',
    slug: 'book',
    bgColor: 'bg-black',
    icon: 'book',
  },
  {
    label: 'Contact & Credits',
    slug: 'contact',
    bgColor: 'bg-brown-dark',
    icon: 'envelope',
  },
];

const props = defineProps<{
  sticky?: boolean;
}>();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header
    class="bg-[url(../assets/images/header-background.png)] bg-[size:100%_280px] bg-no-repeat py-4 xl:pt-10 2xl:pt-14 xl:pb-0"
    :class="{ 'sticky top-0': sticky }"
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
      class="hidden xl:block xl:h-[54px] 2xl:h-[68px] mx-auto mb-10 2xl:mb-14"
    />
    <NavigationDesktop
      class="hidden xl:block"
      :navItems="navItems"
    />
  </header>
</template>
