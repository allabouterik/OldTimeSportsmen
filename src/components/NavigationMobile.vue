<script setup lang="ts">
import { ref, watch } from 'vue';
import houseWithSmokeImage from '@/assets/images/house-with-smoke.png';
import houseWithoutSmokeImage from '@/assets/images/house-without-smoke.png';
import type { NavItem } from './Header.vue';

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

const isHouseWithSmoke = ref(false);
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
  <nav
    :class="[
      'fixed top-0 left-0 h-screen w-full max-w-sm bg-green-olive transform transition-transform duration-300 ease-in-out z-50',
      modelValue ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="h-full overflow-y-auto py-4">
      <!-- Navigation items -->
      <div class="space-y-7">
        <!-- Main nav items -->
        <div
          v-for="item in navItems"
          :key="item.label"
          class=""
        >
          <!-- Items with subnav -->
          <div
            v-if="item.subNavItems"
            @click="toggleSection(item.label)"
            class="grid grid-cols-[auto_minmax(auto,253px)] items-center cursor-pointer text-white hover:text-gray-200 py-2"
          >
            <img
              v-if="item.icon"
              :src="`/src/assets/icons/${item.icon}.svg`"
              alt="Icon"
              class="inline-block w-6 h-6 justify-self-end mr-2 mb-1"
            />
            <div>
              <span
                class="font-garage-gothic font-medium text-34px leading-none tracking-wider text-black"
                >{{ item.label }}</span
              >
              <div class="w-full h-[3px] bg-gold"></div>
            </div>
          </div>

          <!-- Page Links -->
          <a
            v-else
            :href="item.href"
            class="grid grid-cols-[auto_minmax(auto,253px)] items-center text-white hover:text-gray-200 py-2"
          >
            <img
              v-if="item.icon"
              :src="`/src/assets/icons/${item.icon}.svg`"
              alt="Icon"
              class="inline-block w-6 h-6 justify-self-end mr-2 mb-1"
            />
            <div>
              <span
                class="font-garage-gothic font-medium text-34px leading-none tracking-wider text-black"
                >{{ item.label }}</span
              >
              <div class="w-full h-[3px] bg-gold"></div>
            </div>
          </a>

          <!-- Subnav items, e.g. "HUNTING" -->
          <div
            v-if="item.subNavItems && isExpanded(item.label)"
            class="mt-4 space-y-4"
          >
            <template
              v-for="subItem in item.subNavItems"
              :key="subItem.label"
            >
              <div
                v-if="subItem.subNavItems"
                class="grid grid-cols-[auto_minmax(auto,253px)]"
              >
                <div class="justify-self-end text-green-gray mt-2 mr-2">
                  {{ isExpanded(subItem.label) ? '▼' : '▶' }}
                </div>
                <div class="space-y-2">
                  <div
                    @click="toggleSection(subItem.label)"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      class="font-garage-gothic font-medium tracking-wider text-32px text-green-gray hover:text-gray-700"
                      >{{ subItem.label }}</span
                    >
                  </div>

                  <!-- Second level items, e.g. "BIG GAME" -->
                  <div
                    v-if="isExpanded(subItem.label)"
                    class="ml-4 space-y-2"
                  >
                    <template
                      v-for="secondItem in subItem.subNavItems"
                      :key="secondItem.label"
                    >
                      <a
                        :href="secondItem.href"
                        class="block font-poppins font-normal text-16px text-white hover:text-gray-700"
                        >{{ secondItem.label }}</a
                      >
                    </template>
                  </div>
                </div>
              </div>

              <!-- Page Links -->
              <a
                v-else
                :href="subItem.href"
                class="grid grid-cols-[auto_minmax(auto,253px)] items-center text-green-gray hover:text-gray-700"
              >
                <div></div>
                <span
                  class="font-garage-gothic font-medium tracking-wider text-32px"
                  >{{ subItem.label }}</span
                >
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>

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
