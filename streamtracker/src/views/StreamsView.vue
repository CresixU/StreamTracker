<template>
<div>
    <table class="w-full mt-6">
        <thead>
            <tr>
                <th>Nazwa kanału</th>
                <th>Tytuł</th>
                <th>Rozpoczęty</th>
                <th>Zakończony</th>
                <th>Szczegóły</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="stream in data.items" :key="stream.id">
                <td>
                    <a :href="stream.streamer.url">
                        {{ stream.streamer.name }}
                    </a>
                </td>
                <td>
                    <a :href="stream.url">
                        {{ stream.name }}
                    </a>
                </td>
                <td>
                    {{ this.returnNewDateFormat(stream.publishedAt) }}
                </td>
                <td>
                    {{ this.returnNewDateFormat(stream.endedAt) }} 
                </td>
                <td>
                    <RouterLink :to="`/stream/${stream.id}`">
                        <VIcon icon="bi bi-bar-chart-line" ></VIcon>
                    </RouterLink>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>
<script>
import VIcon from '@/components/VIcon.vue'

import streamsJSON from '@/template_data/streams.json'

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
        async fetchData() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
            this.data = await response.json();
        },
        returnNewDateFormat(date) {
            if(date == null) return '-';
            return `${date.substring(0,10)} ${date.substring(11,16)}`;
        }
    },
    created() {
        this.fetchData();
    }
}
</script>