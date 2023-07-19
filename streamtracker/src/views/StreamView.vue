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
</div>
</template>
<script>
import stream from '@/template_data/singleStream.json'

export default {
    data() {
        return {
            data: null
        }
    },
    methods: {
        fetchData() {
            this.data = stream;
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
    created() {
        this.fetchData();
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