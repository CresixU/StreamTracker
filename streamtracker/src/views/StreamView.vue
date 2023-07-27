<template>
<div>
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
            <!--Obliczanie avg widzów można zrobić z Math.round(let avg /= watchers.length)-->
            <p>a</p>
        </div>
        <div>
            <p>Największa ilość widzów</p>
            <!--Obliczanie max widzów można zrobić z Math.max(...array)-->
            <p>a</p>
        </div>
    </div>
    <div class="mt-20">
        <apexchart type="bar" :options="options" :series="series"></apexchart>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            data: null,
            options: {
                chart: {
                    id: 'vuechart-example',
                    theme: 'dark'
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                }
            },
            series: [{
                name: 'Ilość widzów',
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }]
        }
    },
    methods: {
        async fetchData() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/${this.$route.params.id}`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
            this.data = await response.json();
        },
        async fetchViews() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streams/${this.$route.params.id}/views/`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
            const views = await response.json();
            this.options.xaxis.categories = views.at;
            this.options.series.data = views.views;
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