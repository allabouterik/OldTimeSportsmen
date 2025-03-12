<script setup lang="ts"></script>

<template>
  <nav class="relative">
    <!-- Top Navigation Bar -->
    <div class="flex justify-between items-center border-b-2 border-">
      <!-- Home Menu Item -->
      <div class="flex items-center px-8 py-2">
        <a
          href="/"
          class="flex items-center"
        >
          <img
            src="/images/house-icon.png"
            alt="Home Icon"
            class="h-8 mr-3"
          />
          <img
            src="/images/home-sweet-home.png"
            alt="Home Sweet Home"
            class="h-6"
          />
        </a>
      </div>

      <!-- Main Navigation Items -->
      <div class="flex">
        <!-- Postal Gallery Nav Item -->
        <div class="relative">
          <a
            href="/postal-gallery"
            class="block bg-green-olive border-t-4 border-gold px-8 py-5 rounded-t-xl shadow-lg"
          >
            <h2
              class="text-48px text-cream font-garage-gothic font-medium tracking-wider"
            >
              POSTAL GALLERY
            </h2>
          </a>
        </div>

        <!-- The Book Nav Item -->
        <div class="relative">
          <a
            href="/the-book"
            class="block bg-black border-t-4 border-gold px-8 py-5 rounded-t-xl shadow-md"
          >
            <h2
              class="text-48px text-cream font-garage-gothic font-medium tracking-wider"
            >
              THE BOOK
            </h2>
          </a>
        </div>

        <!-- Contact & Credits Nav Item -->
        <div class="relative">
          <a
            href="/contact-credits"
            class="block bg-brown-dark border-t-4 border-gold px-8 py-5 rounded-t-xl shadow-md"
          >
            <h2
              class="text-48px text-cream font-garage-gothic font-medium tracking-wider"
            >
              CONTACT & CREDITS
            </h2>
          </a>
        </div>
      </div>
    </div>

    <!-- Secondary Navigation Bar with Categories -->
    <div
      class="bg-green-olive py-[32px] px-[20px] flex justify-center gap-[60px]"
    >
      <a
        href="/hunting"
        class="font-garage-gothic text-[52px] text-green-gray font-medium tracking-wider hover:text-cream transition-colors"
        >HUNTING</a
      >
      <a
        href="/fishing"
        class="font-garage-gothic text-[52px] text-green-gray font-medium tracking-wider hover:text-cream transition-colors"
        >FISHING</a
      >
      <a
        href="/camp-cabin"
        class="font-garage-gothic text-[52px] text-green-gray font-medium tracking-wider hover:text-cream transition-colors"
        >CAMP & CABIN</a
      >
      <a
        href="/tall-tales"
        class="font-garage-gothic text-[52px] text-green-gray font-medium tracking-wider hover:text-cream transition-colors"
        >TALL TALES</a
      >
    </div>
  </nav>
</template>
