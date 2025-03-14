<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import headerImageDesktop from '@/assets/images/old-time-logo-desktop.png';
</script>

<template>
  <header
    class="bg-[url(../assets/images/header-background.png)] bg-[size:100%_280px] bg-no-repeat pt-14"
  >
    <img
      :src="headerImageDesktop.src"
      alt="Header Image"
      class="h-[54px] 2xl:h-[68px] mx-auto mb-14"
    />
    <Navigation />
  </header>
</template>
