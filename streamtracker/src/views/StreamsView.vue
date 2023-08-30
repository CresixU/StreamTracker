<template>
<div>
    <table class="w-full mt-6">
        <thead>
            <tr>
                <th>Nazwa kanału</th>
                <th>Tytuł</th>
                <th>Rozpoczęty</th>
                <th>Zakończony</th>
                <th>Sprawdzony</th>
                <th>Szczegóły</th>
            </tr>
        </thead>
        <TransitionGroup name="animation" tag="tbody" v-if="data">
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
                    {{ stream.lastCheck ? returnNewDateFormat(stream.lastCheck) : '-' }}
                </td>
                <td>
                    <RouterLink :to="`/stream/${stream.id}`">
                        <VIcon icon="bi bi-bar-chart-line" ></VIcon>
                    </RouterLink>
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
                <div :class="{ disabled: currentPage == 1 }">
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
</template>
<script>
import VIcon from '@/components/VIcon.vue'
import VInputText from '@/components/VInputText.vue'

import streamsJSON from '@/template_data/streams.json'

export default {
    components: {
        VIcon,
        VInputText
    },
    data() {
        return {
            data: null,
            currentPage: 1,
            pageSize: 20
        }
    },
    methods: {
        async fetchData() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/?online=false&page=${this.currentPage-1}&size=${this.pageSize}`
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
        },
        async changePage(page) {
			if (page >= 0 && page < this.data.totalPages) {
				this.currentPage = page;
                console.log("page changed")
				await this.fetchData();
      		}
		}
    },
    created() {
        this.fetchData();
    },
    watch: {
        pageSize() {
            this.fetchData();
        }
    }
}
</script>