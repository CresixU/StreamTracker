<template>
<div>
    <div v-if="platforms">
        <h2 class=" text-lg font-bold mb-3">Start task</h2>
        <form id="form">
            <div class="flex">
                <input type="file" id="file" v-on:change="handleFileUpload( $event )">
                <VSelect :items="platforms" style="min-width: 200px;" class="mx-5" id="platform" v-model="form.platform"></VSelect>
                <VButton @click="startTask()">Start</VButton>
            </div>
        </form>
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

export default {
    components: {
        VSelect, VButton
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
            }
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
            let formData = new FormData(form);

            formData.append('platform', this.form.platform);
            formData.append('file', this.form.file)
            try {
                const url = `${import.meta.env.VITE_API_KEY}/api/v1/streamers/import/`
                const response = await fetch(url, {
                    method: 'POST',
				    headers: {
					    'Content-Type': 'multipart/form-data;  boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu'
				    },
                    body: formData
                })
                
                const result = await response.json();
                await this.getTasks();
            }
            catch (error) {
                alert('Nie udało sie wystartować taska');
                console.log(error)
            }
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