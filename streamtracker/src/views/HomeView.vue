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

	<VModalChoice
		v-show="isAddChannelModalVisible"
		@close="this.isAddChannelModalVisible = !this.isAddChannelModalVisible">
		<template v-slot:header>
			Dodawanie nowego kanału
		</template>
		<template v-slot:body>
			<div>
				<label for="username" class="block">Nazwa użytkownika</label>
				<VInputText
					placeholder="Podaj nazwę kanału"
					id="username" 
					name="username"
					v-model="addModalData.username">
				</VInputText>
			</div>
			<div class="mt-5">
				<label for="channelLink" class="block">Link do kanału</label>
				<VInputText
					placeholder="Podaj link do kanału"
					id="channelLink" 
					name="channelLink"
					v-model="addModalData.channelLink">
				</VInputText>
			</div>
			<VSelect class="mt-5"
				placeholder="Wybierz platformę"
				label="Platforma"
				:items="availablePlatforms"
				v-model="addModalData.platform">
			</VSelect>
			<div class="grid grid-cols-2 mt-5">
				<div>
					<label class="clickable">
						<input type="checkbox" v-model="addModalData.favourite" class=" opacity-0 w-0">
						<VIcon 
							:icon="addModalData.favourite ? 'bi bi-star-fill' : 'bi bi-star'" 
							:color="addModalData.favourite ? 'yellow' : 'white'">
						</VIcon>
						Ulubiony: {{ addModalData.favourite ? 'Tak' : 'Nie' }}
					</label>
				</div>
				<div>
					<label class="clickable">
						<input type="checkbox" v-model="addModalData.partner" class=" opacity-0 w-0">
						<VIcon 
							:icon="addModalData.partner ? 'bi bi-award-fill' : 'bi bi-award'" 
							:color="addModalData.partner ? 'mediumpurple' : 'white'">
						</VIcon>
						Partner: {{ addModalData.partner ? 'Tak' : 'Nie' }}
					</label>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<VButton @click="addChannel">Dodaj kanał</VButton>
		</template>
	</VModalChoice>

	<div class="flex justify-between">
		<VInputText placeholder="Podaj kanał" v-model="search" v-on:input="fetchData()"></VInputText>
		<p class="pl-5 block">
			<span class="font-bold">Portfel:</span>
			<br>{{ recaptchaStatus.balance }}
		</p>
		<div style="min-width: 250px" class="mx-auto">
			<h4 class="text-center font-bold">Filtry</h4>
			<div class="flex justify-around mx-auto">
				<div @click="changeFavourite()" class="clickable">
					<VIcon 
						:icon="filterFavourite ? 'bi bi-star-fill' : 'bi bi-star'" 
						:color="filterFavourite ? 'yellow' : 'white'" 
						>
					</VIcon>
					<span :style="filterFavourite ? 'color: yellow;' : ''"> Ulubiony </span>
				</div>
				<div @click="changePartner()" class="clickable">
					<VIcon
						:icon="filterPartner ? 'bi bi-award-fill' : 'bi bi-award'" 
						:color="filterPartner ? 'mediumpurple' : 'white'"
						>
					</VIcon>
					<span :style="filterPartner ? 'color: mediumpurple;' : ''"> Partner </span>
				</div>
			</div>
		</div>
		<VButton 
			style="margin: auto 0px auto auto; width: 200px; height: 50px;"
			@click="this.isAddChannelModalVisible = !this.isAddChannelModalVisible">
			DODAJ KANAŁ
		</VButton>
	</div>
	<div>
		<table class="w-full mt-6">
			<thead>
				<tr>
					<th> </th>
					<th>Nazwa kanału</th>
					<th>ID</th>
					<th>Źródło</th>
					<th>Ostatnio sprawdzony</th>
					<th>Historia streamów</th>
					<th colspan="3">Akcje</th>
				</tr>
			</thead>
				<TransitionGroup name="animation" tag="tbody" v-if="data">
					<tr v-for="channel in data.items" :key="channel.id">
						<th>
							<VIcon
								av-show="channel.state != 'NORMAL'"
								:clickable="false"
								:icon="'bi bi-circle-fill'"
								size="8px"
								:color="returnColorDependOfState(channel.state)">
							</VIcon>
						</th>
						<td>{{ channel.name }}</td>
						<td>{{ channel.externalId }}</td>
						<td>
							<a :href="channel.url">{{ channel.platform }}</a>
						</td>
						<td>
							{{ channel.lastCheck ? returnNewDateFormat(channel.lastCheck) : '-' }}
						</td>
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
				</TransitionGroup>
		</table>
		<div class="grid grid-cols-3 mt-5" v-if="data">
			<div class="relative mt-3">
				<label for="page" style="top: -20px" class=" absolute ml-1">Strona</label>
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
			<div  v-if="data">
				<div class="pagination justify-evenly py-3 flex">
					<div :class="{ disabled: currentPage === 1 }">
						<a @click="changePage(currentPage - 1)">
							<VIcon icon="bi bi-chevron-double-left"></VIcon>
						</a>
					</div>
					<div>
						{{ currentPage }}
					</div>
					<div :class="{ disabled: currentPage === data.totalPages-1 }">
						<a @click="changePage(currentPage + 1)">
							<VIcon icon="bi bi-chevron-double-right"></VIcon>
						</a>
					</div>
				</div>
			</div>
			<div class="relative mt-3" v-if="data">
				<label for="page" style="top: -20px; right: 200px;" class="float-right absolute">Ilość wyników</label>
				<VInputText 
					id="size" 
					type="number"
					placeholder="Wyniki na stronę"
					class="float-right bg-transparent"
					style="border-radius: 5px; border-bottom: 1px solid white"
					v-model="pageSize"
					@input="changePage(currentPage)">
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
			currentPage: 1,
			search: '',
			pageSize: 20,
			recaptchaStatus: '',
			isDeleteModalVisible: false,
			isAddChannelModalVisible: false,
			deleteClickedId: null,
			addModalData: {
				username: '',
				channelLink: '',
				platform: null,
				favourite: false,
				partner: false
			},
			availablePlatforms: null,
			filterPartner: false,
			filterFavourite: false
		}
	},
	methods: {
		async fetchData() {
            let url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/?page=${this.currentPage-1}&size=${this.pageSize}&favourite=${this.filterFavourite}&partner=${this.filterPartner}`
            if(this.search != '' && this.search.length > 2) url += `&search=${this.search}`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            })
			console.log(url);
			
			
            let temp = await response.json()
			if(temp.status) return;
			this.data = temp;
			//this.data = streamersJSON
        },
		async getRecaptchaStatus() {
			let url = `${import.meta.env.VITE_API_KEY}/api/v1/catpcha/service/balance/`
            const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
            })
            this.recaptchaStatus = await response.json()
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
		},
		async getAvailablePlatforms() {
			const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/platforms/`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
			this.availablePlatforms = await response.json();
			
		},
		async addChannel() {
			//Send api request to extract id
			const url = `${import.meta.env.VITE_API_KEY}/api/v1/id/?urlOrUsername=${this.addModalData.channelLink}&platform=${this.addModalData.platform}`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
			if(!response.ok) {
				alert("Nie udało się dodać kanału");
			}
			else {
				const extractedId = await response.json()
				const url2 = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/`
            	const response2 = await fetch(url2, {
					method: 'POST',
					//credentials: 'include',
					headers: { 
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({name: this.addModalData.username, externalId: extractedId.id, url: this.addModalData.channelLink, platform: this.addModalData.platform, isFavourite: this.addModalData.favourite, isPartner: this.addModalData.partner})
            	});
				if(!response.ok) {
					alert("Nie udało się dodać kanału");
				}
				else {
					this.isAddChannelModalVisible = false;
					this.fetchData();
				}
			} 
		},
		changePartner() {
			this.filterPartner = !this.filterPartner;
			this.fetchData();
		},
		changeFavourite() {
			this.filterFavourite = !this.filterFavourite;
			this.fetchData();
		},
		returnNewDateFormat(date) {
            if(date == null) return '-';
            return `${date.substring(0,10)} ${date.substring(11,16)}`;
        },
		returnColorDependOfState(state) {
			if(state == 'NORMAL') return 'green'
			else if (state == 'WARNING') return 'yellow'
			else if (state == 'SUSPECT') return 'red'
			else return 'lightblue'
		}
		
	},
	created() {
		this.fetchData();
		this.getAvailablePlatforms();
		this.getRecaptchaStatus();
	},
    watch: {
        pageSize() {
            this.fetchData();
        }
    }
}
</script>
<style scoped>
th:first-child, td:first-child {
	padding: 5px;
}
</style>