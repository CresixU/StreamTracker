<template>
<Transition name="fade">
	<div class="modal-backdrop">
		<div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
			<header class="modal-header">
				<slot name="header">
					Title
				</slot>
				<button class="btn-close" @click="close" aria-label="Modal close">
					<VIcon icon="bi bi-x-lg"></VIcon>
				</button>
			</header>
			<section class="modal-body">
				<slot name="body">
					Default body content
				</slot>
			</section>
			<footer class="modal-footer">
				<slot name="footer">
					<VButton @click="close" aria-label="Modal close">
						Ok
					</VButton>
				</slot>
			</footer>
		</div>
	</div>
</Transition>
</template>
<script>
import VButton from '@/components/VButton.vue'
import VIcon from '@/components/VIcon.vue';

export default {
	components: {
		VButton,
		VIcon
	},
	methods: {
		close() {
			this.$emit('close');
		}
	}
}
</script>
