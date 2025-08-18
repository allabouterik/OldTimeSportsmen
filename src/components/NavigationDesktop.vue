<script setup lang="ts">
import { ref, computed } from 'vue';
import houseWithSmokeImage from '@/assets/images/house-with-smoke.png';
import houseWithoutSmokeImage from '@/assets/images/house-without-smoke.png';
import BackgroundMusic from '@/components/BackgroundMusic.vue';
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

const currentRouteLvl1 = computed(() => {
  return currentRoute.value.split('/')[1];
});

const currentRouteLvl2 = computed(() => {
  return currentRoute.value.split('/')[2];
});

const currentRouteLvl3 = computed(() => {
  return currentRoute.value.split('/')[3];
});

const currentRouteLvl4 = computed(() => {
  return currentRoute.value.split('/')[4];
});

const currentLvl1NavItemIndex = computed(() => {
  return props.navItems.findIndex(
    (item: NavItem) =>
      item.slug === currentRouteLvl1.value ||
      (item.slug === 'gallery' && currentRouteLvl1.value === '/')
  );
});

const activeLvl1NavItemIndex = ref(currentLvl1NavItemIndex.value);

const activeLvl1NavItem = computed(() => {
  return props.navItems[activeLvl1NavItemIndex.value];
});

// Level 2 Navigation Items
const currentLvl2NavItemIndex = computed(() => {
  return activeLvl1NavItem.value?.subNavItems?.findIndex(
    (item: NavItem) => item.slug === currentRouteLvl2.value
  );
});

const activeLvl2NavItemIndex = ref(currentLvl2NavItemIndex.value);

const activeLvl2NavItem = computed(() => {
  return activeLvl1NavItem.value?.subNavItems?.[activeLvl2NavItemIndex.value];
});

// Level 3 Navigation Items
const currentLvl3NavItemIndex = computed(() => {
  return activeLvl2NavItem.value?.subNavItems?.findIndex(
    (item: NavItem) => item.slug === currentRouteLvl3.value
  );
});

const activeLvl3NavItemIndex = ref(currentLvl3NavItemIndex.value);

const activeLvl3NavItem = computed(() => {
  return activeLvl2NavItem.value?.subNavItems?.[activeLvl3NavItemIndex.value];
});

// Level 4 Navigation Items
const currentLvl4NavItemIndex = computed(() => {
  return activeLvl3NavItem.value?.subNavItems?.findIndex(
    (item: NavItem) => item.slug === currentRouteLvl4.value
  );
});

const activeLvl4NavItemIndex = ref(currentLvl4NavItemIndex.value);
</script>

<template>
  <nav class="relative">
    <BackgroundMusic
      class="absolute right-11 -top-11 z-[60]"
      audioFile="https://res.cloudinary.com/all-about-erik/video/upload/v1750090347/OldTimeSportsmen%20Site/Jawbone.mp3"
      :audioDuration="77"
    />

    <!-- Top Navigation Bar -->
    <div class="relative flex items-center">
      <!-- Home Menu Item -->
      <a
        href="/"
        class="flex h-[64px] 2xl:h-[85px] items-center ml-12 mr-4 px-4 2xl:py-1 hover:cursor-pointer rounded-md outline-green-olive outline-solid outline-0 focus-visible:outline-2"
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
          class="w-[86px] 2xl:w-[115px] self-end mr-1"
        />
        <span
          class="inline-block text-36px 2xl:text-48px font-garage-gothic text-5xl leading-[0.8] font-medium mt-5"
          :class="[
            {
              'translate-y-3 2xl:translate-y-4': isMacWebkit,
            },
            isHouseWithSmoke
              ? 'text-cream text-shadow-strong'
              : 'text-black text-shadow-regular',
          ]"
          >HOME SWEET HOME</span
        >
      </a>

      <!-- Main Navigation Items -->
      <div class="flex">
        <div
          v-for="(item, index) in navItems"
          :key="item.label"
          class="min-w-[210px] 2xl:min-w-[280px]"
          :class="{
            'z-50': index === 0,
            'z-30 -ml-4': index === 1,
            'z-20 -ml-4': index === 2,
          }"
        >
          <button
            v-if="item.subNavItems"
            class="flex items-center justify-center absolute -bottom-1 min-w-[210px] 2xl:min-w-[280px] min-h-[56px] 2xl:min-h-[74px] text-cream hover:text-gold border-t-4 border-x-4 border-gold rounded-t-xl outline-green-olive outline-solid outline-0 focus-visible:outline-2"
            :class="[
              item.bgColor,
              { 'border-b-green-olive': index === activeLvl1NavItemIndex },
            ]"
            @click="
              activeLvl1NavItemIndex = index;
              activeLvl2NavItemIndex = -1;
              activeLvl3NavItemIndex = -1;
              activeLvl4NavItemIndex = -1;
            "
          >
            <span
              class="text-36px 2xl:text-48px font-garage-gothic font-medium tracking-wider uppercase leading-none py-2 px-4"
              :class="[
                {
                  'text-gold': activeLvl1NavItemIndex === index,
                },
                { 'translate-y-3 2xl:translate-y-4': isMacWebkit },
              ]"
            >
              {{ item.label }}
            </span>
          </button>

          <a
            v-else
            :href="`/${item.slug}`"
            class="flex items-center justify-center absolute -bottom-1 min-w-[210px] 2xl:min-w-[280px] min-h-[56px] 2xl:min-h-[74px] text-cream hover:text-gold border-t-4 border-x-4 border-gold rounded-t-xl pl-3 outline-green-olive outline-solid outline-0 focus-visible:outline-2"
            :class="[
              item.bgColor,
              { 'border-b-green-olive': index === activeLvl1NavItemIndex },
            ]"
          >
            <span
              class="text-36px 2xl:text-48px font-garage-gothic font-medium tracking-wider uppercase leading-none py-2 px-4"
              :class="[
                { 'text-gold': item.slug === currentRouteLvl1 },
                { 'translate-y-3 2xl:translate-y-4': isMacWebkit },
              ]"
            >
              {{ item.label }}
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- Level 2 Navigation Bar with Categories -->
    <div
      v-if="activeLvl1NavItemIndex !== null && activeLvl1NavItem?.subNavItems"
      class="flex items-center justify-center gap-36 relative min-h-[74px] bg-green-olive border-t-4 border-gold z-40 shadow-menu py-3 px-[20px]"
    >
      <button
        v-for="(item, index) in activeLvl1NavItem?.subNavItems"
        :key="item.label"
        class="font-garage-gothic text-39px 2xl:text-52px leading-none font-medium tracking-wider uppercase transition-colors rounded-md outline-gold outline-solid outline-0 focus-visible:outline-2 px-3"
        :class="[
          {
            'text-green-gray hover:text-gold': activeLvl2NavItemIndex !== index,
            'text-gold': activeLvl2NavItemIndex === index,
          },
        ]"
        @click="
          activeLvl2NavItemIndex = index;
          activeLvl3NavItemIndex = -1;
          activeLvl4NavItemIndex = -1;
        "
      >
        <span
          class="block w-full text-center leading-[47px] 2xl:leading-[60px]"
          :class="[
            {
              'translate-y-[14px] 2xl:translate-y-[18px]': isMacWebkit,
            },
          ]"
          >{{ item.label }}</span
        >
      </button>
    </div>
    <div
      v-else
      class="flex relative bg-green-olive border-t-4 border-gold z-50"
    ></div>

    <!-- Level 3 Navigation Items -->
    <DesktopNavSubMenu
      :key="`level2-index${activeLvl2NavItemIndex}-level-3-subnav`"
      v-if="activeLvl2NavItem?.subNavItems"
      :items="activeLvl2NavItem?.subNavItems"
      :parentSlug="`${activeLvl1NavItem?.slug}/${activeLvl2NavItem?.slug}`"
      @activeItemIndex="activeLvl3NavItemIndex = $event"
      class="z-50"
    />

    <!-- Level 4 Navigation Items -->
    <DesktopNavSubMenu
      key="level-4-subnav"
      v-if="activeLvl3NavItem?.subNavItems"
      :items="activeLvl3NavItem?.subNavItems"
      :parentSlug="`${activeLvl1NavItem?.slug}/${activeLvl2NavItem?.slug}/${activeLvl3NavItem?.slug}`"
      class="z-40"
    />
  </nav>
</template>
