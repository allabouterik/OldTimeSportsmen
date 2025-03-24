<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import type { NavItem } from './Header.vue';
import closeIcon from '@/assets/icons/close.svg';

const props = defineProps<{
  navItems: NavItem[];
  modelValue: boolean;
}>();

const homeItem: NavItem = {
  label: 'HOME',
  href: '/',
  icon: 'home',
};

const navItems = [homeItem, ...props.navItems];

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const currentRoute = ref(window.location.pathname);
const expandedSections = ref<Set<string>>(new Set());

const toggleSection = (label: string) => {
  if (expandedSections.value.has(label)) {
    expandedSections.value.delete(label);
  } else {
    expandedSections.value.add(label);
  }
};

const isExpanded = (label: string): boolean => {
  return expandedSections.value.has(label);
};

const closeMenu = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <div
    :class="[
      'xl:hidden fixed top-0 left-0 h-screen w-full max-w-sm bg-green-olive transform transition-transform duration-300 ease-in-out z-50',
      modelValue ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Close Button -->
    <button
      class="fixed top-3 left-3 w-5 h-5"
      @click="closeMenu"
    >
      <img
        :src="closeIcon.src"
        alt="Close"
      />
    </button>

    <!-- Navigation -->
    <div class="h-full overflow-y-auto py-16">
      <!-- Main Navigation Items -->
      <nav class="space-y-7">
        <template
          v-for="item in navItems"
          :key="item.label"
          class=""
        >
          <!-- Main Navigation Items with Subnav -->
          <div
            v-if="item.subNavItems"
            @click="toggleSection(item.label)"
            class="grid grid-cols-[auto_minmax(auto,253px)] items-center cursor-pointer text-white hover:text-gray-200 py-2"
          >
            <img
              v-if="item.icon"
              :src="`/src/assets/icons/${item.icon}.svg`"
              alt="Icon"
              class="inline-block w-6 h-6 justify-self-end mr-3 mb-1"
            />
            <div>
              <span
                class="font-garage-gothic font-medium text-34px leading-none tracking-wider uppercase text-black"
                >{{ item.label }}</span
              >
              <div class="w-full h-[3px] bg-gold"></div>
            </div>
          </div>

          <!-- Main Navigation Page Links -->
          <a
            v-else
            :href="item.href"
            class="grid grid-cols-[auto_minmax(auto,253px)] items-center text-white hover:text-gray-200 py-2"
          >
            <img
              v-if="item.icon"
              :src="`/src/assets/icons/${item.icon}.svg`"
              alt="Icon"
              class="inline-block w-6 h-6 justify-self-end mr-3 mb-1"
            />
            <div>
              <span
                class="font-garage-gothic font-medium text-34px leading-none tracking-wider uppercase text-black"
                >{{ item.label }}</span
              >
              <div class="w-full h-[3px] bg-gold"></div>
            </div>
          </a>

          <!-- Level 2 Subnav items, e.g. "HUNTING" -->
          <div
            v-if="item.subNavItems && isExpanded(item.label)"
            class="mt-4 space-y-4"
          >
            <template
              v-for="Lvl2Item in item.subNavItems"
              :key="Lvl2Item.label"
            >
              <div
                v-if="Lvl2Item.subNavItems"
                class="grid grid-cols-[auto_minmax(auto,230px)]"
              >
                <Icon
                  icon="fa-solid:angle-right"
                  class="text-green-gray justify-self-end mt-4 mr-3 transition-transform duration-300 ease-in-out"
                  :class="{ 'rotate-90': isExpanded(Lvl2Item.label) }"
                />
                <div class="space-y-2">
                  <div
                    @click="toggleSection(Lvl2Item.label)"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      class="font-garage-gothic font-medium tracking-wider text-32px uppercase text-green-gray hover:text-gray-700"
                      >{{ Lvl2Item.label }}</span
                    >
                  </div>

                  <!-- Level 3 Subnav items, e.g. "BIG GAME" -->
                  <div
                    v-if="isExpanded(Lvl2Item.label)"
                    class="space-y-2"
                  >
                    <template
                      v-for="Lvl3Item in Lvl2Item.subNavItems"
                      :key="Lvl3Item.label"
                    >
                      <div
                        v-if="Lvl3Item.subNavItems"
                        class="grid grid-cols-[auto_minmax(auto,230px)]"
                      >
                        <Icon
                          icon="fa-solid:angle-right"
                          class="text-white justify-self-end mt-1 mr-3 transition-transform duration-300 ease-in-out"
                          :class="{ 'rotate-90': isExpanded(Lvl3Item.label) }"
                        />
                        <div class="space-y-2">
                          <div
                            @click="toggleSection(Lvl3Item.label)"
                            class="flex items-center gap-2 cursor-pointer"
                          >
                            <span
                              class="font-poppins font-normal text-16px uppercase text-white hover:text-gray-700"
                              >{{ Lvl3Item.label }}</span
                            >
                          </div>

                          <!-- Level 4 Page Links, e.g. "DEER" -->
                          <div
                            v-if="isExpanded(Lvl3Item.label)"
                            class="ml-4 space-y-2"
                          >
                            <a
                              v-for="Lvl4Item in Lvl3Item.subNavItems"
                              :key="Lvl4Item.label"
                              :href="Lvl4Item.href"
                              class="block font-poppins font-normal text-16px text-cream-light hover:text-gray-700"
                              >{{ Lvl4Item.label }}</a
                            >
                          </div>
                        </div>
                      </div>

                      <!-- Level 3 Page Links -->
                      <a
                        v-else
                        :href="Lvl3Item.href"
                        class="block font-poppins font-normal text-16px uppercase text-white hover:text-gray-700 ml-5"
                        >{{ Lvl3Item.label }}</a
                      >
                    </template>
                  </div>
                </div>
              </div>

              <!-- Level 2 Page Links -->
              <a
                v-else
                :href="Lvl2Item.href"
                class="grid grid-cols-[auto_minmax(auto,230px)] items-center text-green-gray hover:text-gray-700"
              >
                <div></div>
                <span
                  class="font-garage-gothic font-medium tracking-wider text-32px uppercase"
                  >{{ Lvl2Item.label }}</span
                >
              </a>
            </template>
          </div>
        </template>
      </nav>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="closeMenu"
  ></div>
</template>

<style scoped>
.bg-green-olive {
  background-color: rgb(84, 85, 70);
}
</style>
