<script setup lang="ts">
defineProps({
  iconName: {
    type: String,
    default: 'box',
  },
  width: {
    type: [Number, String],
    default: 18,
  },
  height: {
    type: [Number, String],
    default: 18,
  },
  fillColor: {
    type: String,
    default: 'transparent',
  },
  strokeColor: {
    type: String,
    default: 'currentColor',
  },
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >
      {{ iconName }} icon
    </title>
    <g
      :fill="fillColor"
      :stroke="strokeColor"
    >
      <slot />
    </g>
  </svg>
</template>
