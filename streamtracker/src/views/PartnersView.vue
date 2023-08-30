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
    <div>
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
							:icon="channel.favourite ? 'bi bi-star-fill' : 'bi bi-star'" 
							:color="channel.favourite ? 'yellow' : 'white'" 
							@click="clickFavourite(channel.id)">
						</VIcon>
					</td>
					<td>
						<VIcon
							:icon="channel.partner ? 'bi bi-award-fill' : 'bi bi-award'" 
							:color="channel.partner ? 'mediumpurple' : 'white'"
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
		<div class="grid grid-cols-3 mt-5">
			<div class="relative mt-3">
				<label for="page" style="top: -20px" class=" absolute">Strona</label>
				<VInputText 
					id="page" 
					type="number"
					class="bg-transparent"
					placeholder="Wpisz stronę" 
					style="border-radius: 5px; border-bottom: 1px solid white"
					v-model="currentPage"
					@input="changePage(currentPage)">
				</VInputText>
			</div>
			<div>
				<div class="pagination justify-evenly py-3 flex">
					<div :class="{ disabled: currentPage === 0 }">
						<a @click="changePage(currentPage - 1)">
							<VIcon icon="bi bi-chevron-double-left"></VIcon>
						</a>
					</div>
					<div>
						{{ parseInt(currentPage)+1 }}
					</div>
					<div :class="{ disabled: currentPage === data.totalPages }">
						<a @click="changePage(currentPage + 1)">
							<VIcon icon="bi bi-chevron-double-right"></VIcon>
						</a>
					</div>
				</div>
			</div>
			<div class="relative mt-3">
				<label for="page" style="top: -20px" class=" absolute">Ilość wyników</label>
				<VInputText 
					id="size" 
					type="number"
					placeholder="Wyniki na stronę"
					class="float-right bg-transparent"
					style="border-radius: 5px; border-bottom: 1px solid white"
					v-model="pageSize">
				</VInputText>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import VInputText from '@/components/VInputText.vue'
import VSelect from '@/components/VSelect.vue'
import VButton from '@/components/VButton.vue';
import VIcon from '@/components/VIcon.vue';
import VModalChoice from '@/components/VModalChoice.vue';

import streamersJSON from '@/template_data/streamers.json'

export default {
	components: {
		VInputText,
		VButton,
		VIcon,
		VModalChoice,
		VSelect
	},
	data() {
		return {
			data: null,
			currentPage: 0,
			search: '',
			pageSize: 20,
			isDeleteModalVisible: false,
			deleteClickedId: null,
		}
	},
	methods: {
		async fetchData() {
            
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/?page=${this.currentPage}&size=${this.pageSize}&favourite=false&partner=true`
            if(this.search != '' && this.search.length > 2) url += `&SearchPhrase=${this.search}`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            })
			
			
            this.data = await response.json()
			
			//this.data = streamersJSON
        },
		async changePage(page) {
			if (page >= 0 && page < this.data.totalPages) {
				this.currentPage = page;
				await this.fetchData();
      		}
		},
		async clickFavourite(id) {
			const channel = this.data.items.find(c => c.id == id);
			if(channel == null) {
				alert('Error');
				return;
			}
			channel.favourite = !channel.favourite;
			//Send api request
			const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/${id}/favourite/toggle/`
            const response = await fetch(url, {
                //credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				}
            })
		},
		async clickPartner(id) {
			const channel = this.data.items.find(c => c.id == id);
			if(channel == null) {
				alert('Error');
				return;
			}
			channel.partner = !channel.partner;
			//Send api request
			const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/${id}/partner/toggle/`
            const response = await fetch(url, {
                //credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				}
            })
		},
		async deleteChannel(id) {
			const channel = this.data.items.find(c => c.id == id);
			if(channel == null) {
				alert('Error');
				return;
			}
			//Send api request
			const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/${id}`
            await fetch(url, {
                //credentials: 'include',
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
            })
			await this.fetchData();
		},
		deleteModalToggle(id = 0) {
			this.isDeleteModalVisible = !this.isDeleteModalVisible;
			if(id != 0) this.deleteClickedId = id;
		}
	},
	created() {
		this.fetchData();
	}
}
</script>
<style scoped>
i {
	cursor: pointer;
}
</style>