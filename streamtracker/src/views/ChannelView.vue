<template>
<div>
    <div>
        <h1 class="text-center my-24 text-5xl">Streamer name</h1>
    </div>
    <div>
        <table class="w-full mt-6">
			<thead>
				<tr>
					<th>Nazwa</th>
					<th>Rozpoczęty</th>
					<th>Zakończony</th>
					<th>Czas trwania</th>
					<th>Szczegóły</th>
				</tr>
			</thead>
			<tbody>
				<!--Dane wpisane na ślepo-->
				<tr v-for="stream in data.data" :key="stream.id">
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
			</tbody>
		</table>
    </div>
</div>
</template>
<script>
export default {
	data() {
		return {
			data: null
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
        }
	},
	computed: {
        timeElapsed() {
            if(this.data.endedAt) 
                return this.returnDurationTime(new Date(this.data.endedAt) - new Date(this.data.publishedAt));
            return this.returnDurationTime(Date.now() - new Date(this.data.publishedAt));
        }
    }
}
</script>