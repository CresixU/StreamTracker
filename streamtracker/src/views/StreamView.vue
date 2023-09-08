<template>
<div v-if="data">
    <div>
        <h1 class="text-center my-24 text-5xl">
            <a :href="data.url">{{ data.name }}</a>
        </h1>
    </div>
    <div class="grid grid-flow-col">
        <div>
            <p>Nazwa kanału</p>
            <p>
                <RouterLink :to="`/channel/${data.id}`">
                    {{ data.streamer.name }}
                </RouterLink>
            </p>
        </div>
        <div>
            <p>Źródło</p>
            <p>
                <a :href="data.streamer.url">
                    {{ data.streamer.platform }}
                </a>
            </p>
        </div>
        <div>
            <p>Rozpoczęty</p>
            <p>{{ returnNewDateFormat(data.publishedAt) }}</p>
        </div>
        <div>
            <p>Zakończony</p>
            <p>{{ returnNewDateFormat(data.endedAt) }}</p>
        </div>
        <div>
            <p>Czas trwania</p>
            <p>{{ timeElapsed }}</p>
        </div>
        <div>
            <p>Średnia ilość widzów</p>
            <p>
                {{ this.views.amout.length > 0 ? Math.round(this.returnArraySum(this.views.amout) / this.views.amout.length) : '0' }}
            </p>
        </div>
        <div>
            <p>Największa ilość widzów</p>
            <p>{{ this.views.amout.length > 0 ? Math.max(...this.views.amout) : '0' }}</p>
        </div>
    </div>
    <div class="mt-20">
        <apexchart type="bar" :options="options" :series="series" v-if="isChartLoaded"></apexchart>
    </div>
</div>
<div v-else>
    <h1 class="text-center my-24 text-5xl">Stream nie istnieje</h1>
</div>
</template>
<script>
export default {
    data() {
        return {
            data: null,
            views: {
                at: [],
                amout: []
            },
            isChartLoaded: false,
            options: {
                chart: {
                    id: 'vuechart-example',
                    theme: 'dark'
                },
                xaxis: {
                    categories: []
                }
            },
            series: [{
                name: 'Ilość widzów',
                data: []
            }]
        }
    },
    methods: {
        async fetchData() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/${this.$route.params.id}/`;
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
            this.data = await response.json();
        },
        async fetchViews() {
            const after = new Date().getTime() - ( 24 * 60 * 60 * 1000);
            const before = new Date().getTime();
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/${this.$route.params.id}/views/?after=${after}&before=${before}`;
            //const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/0ab4dd12-d552-48db-8707-964b7e8bef7d/views/?after=1&before=99999999999999`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
            const temp = await response.json();
            this.views.at = temp.map(e => this.returnNewDateFormat(e.at));
            this.views.amout = temp.map(e => e.views);
            this.options.xaxis.categories = this.views.at;
            this.series[0].data = this.views.amout;
            this.isChartLoaded = true;
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
        returnArraySum(array) {
            let sum = 0;
            array.forEach(num => {
                sum += num;
            })
            return sum;
        }
    },
    async created() {
        await this.fetchData();
        await this.fetchViews();
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
<style scoped>
.grid > div > p:first-child {
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 10px;
}
.grid > div p {
    text-align: center;
}

</style>