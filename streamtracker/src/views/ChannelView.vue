<template>
<div>
    <div>
        <h1 class="text-center my-24 text-5xl" v-if="data">
			<a :href="data.url">{{ data.name }}</a>
		</h1>
    </div>
    <div>
        <table
		 	class="w-full mt-6"
			v-if="streams && !streams.error && streams.items.length > 0">
			<thead>
				<tr>
					<th>Nazwa</th>
					<th>Rozpoczęty</th>
					<th>Zakończony</th>
					<th>Czas trwania</th>
					<th>Szczegóły</th>
				</tr>
			</thead>
			<TransitionGroup name="animation" tag="tbody" v-if="data">
				<tr v-for="stream in streams.items" :key="stream.id">
					<td>{{ stream.title }}</td>
					<td>{{ returnNewDateFormat(stream.startAt) }}</td>
					<td>{{ returnNewDateFormat(stream.endedAt) }}</td>
					<td>{{ timeElapsed }}</td>
					<td> 
						<RouterLink :to="{ path: `/stream/${stream.id}` }"> 
							<VIcon  icon="bi bi-card-list" color="white"></VIcon>
						</RouterLink>
					</td>
				</tr>
			</TransitionGroup>
		</table>
		<div v-else>
			<h1 class=" text-2xl text-center  my-5" v-if="!data.error">Użytkownik nie prowadził streamów</h1>
			<h1 class=" text-2xl text-center  my-5" v-else>Nie znaleziono użytkownika</h1>
		</div>
		<div class="grid grid-cols-3 mt-5" v-if="streams && !streams.error && streams.items.length > 0">
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
					<div :class="{ disabled: currentPage === 0 }">
						<a @click="changePage(currentPage - 1)">
							<VIcon icon="bi bi-chevron-double-left"></VIcon>
						</a>
					</div>
					<div>
						{{ currentPage }}
					</div>
					<div :class="{ disabled: currentPage === data.totalPages }">
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

export default {
	components: {
		VInputText,
		VButton,
		VIcon,
		VSelect
	},
	data() {
		return {
			data: null,
			streams: null,
			currentPage: 1,
			pageSize: 20
		}
	},
	methods: {
		async fetchData() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/${this.$route.params.id}/`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            })
            this.data = await response.json()
        },
		async fetchStreams() {
			const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/?streamer_id=${this.$route.params.id}&page=${this.currentPage-1}&size=${this.pageSize}&online=false`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			this.streams = await response.json();
		},
		returnNewDateFormat(date) {
            if(date == null) return '-';
            return `${date.substring(0,10)} ${date.substring(11,16)}`;
        },
        returnDurationTime(ms) {
            let hours, min, seconds = 0;
            seconds = Math.floor(ms/1000);
            min = Math.floor(seconds/60);
            hours = Math.floor(min/60);
            return `${hours}h ${min%60}m`;
        },
		async changePage(page) {
			if (page >= 0 && page < this.data.totalPages) {
				this.currentPage = page;
				await this.fetchData();
      		}
		}
	},
	computed: {
        timeElapsed() {
            if(this.data.endedAt) 
                return this.returnDurationTime(new Date(this.data.endedAt) - new Date(this.data.publishedAt));
            return this.returnDurationTime(Date.now() - new Date(this.data.publishedAt));
        }
    },
	created() {
		this.fetchData();
		this.fetchStreams();
	}
}
</script>