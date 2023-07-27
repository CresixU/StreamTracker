<template>
<div>
    <table class="w-full mt-6">
        <thead>
            <tr>
                <th>Nazwa kanału</th>
                <th>ID</th>
                <th>Źródło</th>
                <th>Ostatnio sprawdzony</th>
                <th>Historia streamów</th>
                <th colspan="2">Akcje</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Za mało danych</td></tr>
            <!--<tr v-for="channel in data.items" :key="channel.id">
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
                <td class="px-0">
                    <VIcon
                        v-if="channel.isPartner" 
                        icon="bi bi-award-fill" color="mediumpurple"
                        style="cursor:default">
                    </VIcon>
                </td>
            </tr>-->
        </tbody>
    </table>
</div>
</template>

<script>
import VIcon from '@/components/VIcon.vue'

export default {
    components: {
        VIcon
    },
    data() {
        return {
            data: null
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
    }
}
</script>