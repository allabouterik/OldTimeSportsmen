<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import headerImageDesktop from '@/assets/images/old-time-logo-desktop.png';
import headerImageMobilePt1 from '@/assets/images/old-time-logo-mobile-pt1.png';
import headerImageMobilePt2 from '@/assets/images/old-time-logo-mobile-pt2.png';
import menuBurgerIcon from '@/assets/icons/menu-burger.svg';
</script>

<template>
  <header
    class="bg-[url(../assets/images/header-background.png)] bg-[size:100%_280px] bg-no-repeat py-4 xl:pt-14 xl:pb-0"
  >
    <!-- Mobile -->
    <button class="fixed xl:hidden top-3 left-3 sm:top-4 sm:left-4 z-10">
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

    <!-- Desktop -->
    <img
      :src="headerImageDesktop.src"
      alt="Header Image"
      class="hidden xl:block h-[54px] 2xl:h-[68px] mx-auto mb-14"
    />
    <Navigation class="hidden xl:block" />
  </header>
</template>
