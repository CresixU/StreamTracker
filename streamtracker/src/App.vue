<template>
<div class="container mx-auto px-4">
	<nav class="flex items-center space-x-2 text-base">
		<div>
			<RouterLink to="/">Home</RouterLink>
		</div>
		<div>
			<RouterLink to="streams">Streamy</RouterLink>
		</div>
	</nav>
	<main>
		<RouterView>
			<!--<Transition name="animation">
				<component :is="Component" />
			</Transition>-->
		</RouterView>
	</main>
</div>
</template>

<script>
import { RouterLink } from 'vue-router';

</script>

<style scoped>
.animation-enter-active,
.animation-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.animation-enter-from,
.animation-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>