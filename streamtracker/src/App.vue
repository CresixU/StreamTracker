<template>
<div class="container mx-auto mt-5 px-4">
	<nav class="flex space-x-5 justify-center">
		<div>
			<RouterLink to="/">Lista kanałów</RouterLink>
		</div>
		<div>
			<RouterLink to="/streams">Trwające streamy</RouterLink>
		</div>
		<div>
			<RouterLink to="/favourites">Ulubione</RouterLink>
		</div>
		<div>
			<RouterLink to="/partners">Partnerzy</RouterLink>
		</div>
		<div>
			<RouterLink to="/services">Serwisy</RouterLink>
		</div>
	</nav>
	<main class="max-w-7xl mx-auto mt-28">
		<RouterView v-slot="{ Component }">
			<Transition name="animation">
				<component :is="Component" />
			</Transition>
		</RouterView>
	</main>
</div>
</template>

<script>
import { RouterLink } from 'vue-router';


</script>