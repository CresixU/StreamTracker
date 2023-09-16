<template>
<div>
    <VModalChoice
		v-show="(requestLoading && modalVisible) || modalVisible">
		<template v-slot:header>
			Informacja
		</template>
		<template v-slot:body class=" text-center">
			<p v-if="requestLoading">Trwa dodawanie nowego taska <br> Nie powinno to zająć dłużej, niż 10 sekund <br> Nie opuszczaj strony</p>
            <p v-else>Task zakończył swoje działanie, można opuścić stronę</p>
		</template>
		<template v-slot:footer class="flex justify-evenly">
			<VButton v-show="!requestLoading" @click="modalVisible = false">OK</VButton>
		</template>
	</VModalChoice>
    <div v-if="platforms">
        <h2 class=" text-lg font-bold mb-3">Start task</h2>
            <div class="flex">
                <input type="file" id="file" v-on:change="handleFileUpload( $event )">
                <VSelect :items="platforms" style="min-width: 200px;" class="mx-5" id="platform" v-model="form.platform"></VSelect>
                <VButton @click="startTask()">Start</VButton>
            </div>
    </div>
    <div class="my-10"></div>
    <div>
        <table class="w-full mt-6">
            <thead>
                <th>ID</th>
                <th>Status</th>
                <th>Platforma</th>
            </thead>
            <TransitionGroup name="animation" tag="tbody" v-if="tasks">
                <tr v-for="task in tasks" :key="task.id">
                    <td>
                        {{ task.id }}
                    </td>
                    <td>
                        {{ task.status }}
                    </td>
                    <td>
                        {{ task.platform }}
                    </td>
                </tr>
            </TransitionGroup>
        </table>
    </div>
</div>
</template>
<script>
import VSelect from '@/components/VSelect.vue'
import VButton from '@/components/VButton.vue'
import VModalChoice from '@/components/VModalChoice.vue'
import axios from  'axios'

export default {
    components: {
        VSelect, VButton, VModalChoice
    },
    data() {
        return {
            statuses: null,
            tasks: null,
            platforms: null,
            taskFile: null,
            taskPlatform: '',
            form: {
                file: null,
                platform: ''
            },
            requestLoading: false,
            modalVisible: false
        }
    },
    methods: {
        async getStatuses() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/import/statuses/`
            const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json' 
				}
            })
            this.statuses = await response.json()
        },
        async getTasks() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/import/tasks/`
            const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
            })
            this.tasks = await response.json()
        },
        async getTaskById(id) {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/import/${id}/status/`
            const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
            })
            this.tasks = await response.json()
        },
        async startTask() {
            this.requestLoading = true;
            this.modalVisible = true;
            console.log("start modal "+this.requestLoading)
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/import/`
            const formData = new FormData();
                formData.append('file', this.form.file);
                formData.append('platform', this.form.platform);
                const headers = { 'Content-Type': 'multipart/form-data' };
                 
                await axios.post(url, formData, { headers })
                .then(async (res) => {
                    res.data.files; // binary representation of the file
                    res.status; // HTTP status
                    this.form.file = null;
                    this.form.platform = '';
                    await this.getTasks();
                    console.log("off modal "+this.requestLoading)
                    this.requestLoading = false;
                })
                .catch(
                    (err) => {
                        console.log("off modal "+this.requestLoading)
                        this.requestLoading = false;
                    }
                );
                
        },
        async getAvailablePlatforms() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/platforms/`
            const response = await fetch(url, {
                //credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
            });
			this.platforms = await response.json();
        },
        handleFileUpload( e ) {
            this.form.file = e.target.files[0];
        }
    },
    async created() {
        await this.getAvailablePlatforms();
        await this.getStatuses();
        await this.getTasks();
    }
}


</script>