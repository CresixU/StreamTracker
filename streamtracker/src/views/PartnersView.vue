<template>
<div>
    <VModalChoice
		v-show="isDeleteModalVisible"
		@close="deleteModalToggle()">
		<template v-slot:header>
			Usuwanie kanału
		</template>
		<template v-slot:body>
			Czy na pewno chcesz usunąć kanał? <br> id: {{ deleteClickedId }}
		</template>
		<template v-slot:footer class="flex justify-evenly">
			<VButton @click="deleteModalToggle()" style="background: transparent">Nie</VButton>
			<VButton @click="deleteChannel(deleteClickedId)">Tak</VButton>
		</template>
	</VModalChoice>
    <table class="w-full mt-6">
        <thead>
            <tr>
                <th>Nazwa kanału</th>
                <th>ID</th>
                <th>Źródło</th>
                <th>Ostatnio sprawdzony</th>
                <th>Historia streamów</th>
                <th colspan="3">Akcje</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="channel in data.items" :key="channel.id">
                <td>{{ channel.name }}</td>
                <td>{{ channel.externalId }}</td>
                <td>
                    <a :href="channel.url">{{ channel.platform }}</a>
                </td>
                <td>Brak</td>
                <td> 
                    <RouterLink :to="{ path: `/channel/${channel.id}` }"> 
                        <VIcon icon="bi bi-bar-chart-line" color="white"></VIcon>
                    </RouterLink>
                </td>
                <td>
                    <VIcon 
                        :icon="channel.isFavourite ? 'bi bi-star-fill' : 'bi bi-star'" 
                        :color="channel.isFavourite ? 'yellow' : 'white'" 
                        @click="clickFavourite(channel.id)">
                    </VIcon>
                </td>
                <td>
                    <VIcon
                        :icon="channel.isPartner ? 'bi bi-award-fill' : 'bi bi-award'" 
                        :color="channel.isPartner ? 'mediumpurple' : 'white'"
                        @click="clickPartner(channel.id)">
                    </VIcon>
                </td>
                <td>
                    <VIcon 
                        icon="bi bi-trash" 
                        color="red" 
                        @click="deleteModalToggle(channel.id)">
                    </VIcon>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import VIcon from '@/components/VIcon.vue'
import VModalChoice from '@/components/VModalChoice.vue';
import VButton from '@/components/VButton.vue'

export default {
    components: {
        VIcon, VModalChoice, VButton
    },
    data() {
        return {
            data: null,
            isDeleteModalVisible: false,
            deleteClickedId: ''

        }
    },
    methods: {
        async fetchData(page = 0) {
            
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/?page=0&size=20&favourite=false&partner=true`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            })
            this.data = await response.json()
        },
        async clickFavourite(id) {
			const channel = this.data.items.find(c => c.id == id);
			if(channel == null) {
				alert('Error');
				return;
			}
			channel.isFavourite = !channel.isFavourite;
			//Send api request
		},
		async clickPartner(id) {
			const channel = this.data.items.find(c => c.id == id);
			if(channel == null) {
				alert('Error');
				return;
			}
			channel.isPartner = !channel.isPartner;
			//Send api request
		},
		async deleteChannel(id) {
			const channel = this.data.items.find(c => c.id == id);
			if(channel == null) {
				alert('Error');
				return;
			}
			//Send api request
		},
		deleteModalToggle(id = 0) {
			this.isDeleteModalVisible = !this.isDeleteModalVisible;
			if(id != 0) this.deleteClickedId = id;
		},
    }
}
</script>