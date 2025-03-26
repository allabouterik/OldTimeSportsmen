import { ref, onMounted, onUnmounted, computed } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

export function useResponsive() {
	// Initialize breakpoints
	const breakpoints = useBreakpoints(breakpointsTailwind);

	// Create refs for responsive states
	const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
	const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

	// Computed breakpoint values
	const isMobile = computed(() => breakpoints.smaller('sm').value);
	const isTablet = computed(() => breakpoints.between('sm', 'lg').value);
	const isDesktop = computed(() => breakpoints.greater('lg').value);
	const isLessThanXl = computed(() => breakpoints.smaller('xl').value);

	// Get current active breakpoint
	const currentBreakpoint = computed(() => breakpoints.active().value);

	// Update dimensions on resize
	const updateDimensions = () => {
		width.value = window.innerWidth;
		height.value = window.innerHeight;
	};

	// Lifecycle hooks for event handling
	onMounted(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', updateDimensions);
			updateDimensions();
		}
	});

	onUnmounted(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateDimensions);
		}
	});

	return {
		// Dimensions
		width,
		height,

		// Breakpoint states
		isMobile,
		isTablet,
		isDesktop,
		isLessThanXl,
		currentBreakpoint,

		// Original breakpoints object for custom queries
		breakpoints,
	};
}
