<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import headerImageDesktop from '@/assets/old-time-logo-desktop.png';
</script>

<template>
  <header class="bg-[url(../assets/header-background.png)] pt-14">
    <img
      :src="headerImageDesktop.src"
      alt="Header Image"
      class="w-[1259px] h-[68px] mx-auto mb-14"
    />
    <Navigation />
  </header>
</template>
