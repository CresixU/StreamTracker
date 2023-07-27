<template>
<div>
    <VModalChoice
		v-show="isDeleteModalVisible"
		@close="toggleModal('delete')">
		<template v-slot:header>
			Usuwanie kanału
		</template>
		<template v-slot:body>
			Czy na pewno chcesz usunąć serwis? <br> id: {{ clickedServiceId }}
		</template>
		<template v-slot:footer class="flex justify-evenly">
			<VButton @click="toggleModal('delete')" style="background: transparent">Nie</VButton>
			<VButton @click="deleteService(clickedServiceId)">Tak</VButton>
		</template>
	</VModalChoice>

	<VModalChoice
		v-show="isAddModalVisible"
		@close="toggleModal('add')">
		<template v-slot:header>
			Dodawanie nowego serwisu
		</template>
		<template v-slot:body>
			<div class="mt-5">
				<label for="serviceName" class="block">Nazwa</label>
				<VInputText
					placeholder="Podaj nazwę serwisu"
					id="serviceName" 
					name="serviceName"
					v-model="modalData.name">
				</VInputText>
			</div>
            <div class="mt-5">
				<label for="servicePrefixes" class="block">Prefixy</label>
				<VInputText
					placeholder="Podaj nazwę serwisu"
					id="servicePrefixes" 
					name="servicePrefixes"
					v-model="modalData.prefixes">
				</VInputText>
                <p>Prefixy powinny być oddzielone przecinkami</p>
			</div>
		</template>
		<template v-slot:footer>
            <VButton @click="toggleModal('add')" style="background: transparent;">Anuluj</VButton>
			<VButton @click="addService">Dodaj serwis</VButton>
		</template>
	</VModalChoice>

    <VModalChoice
		v-show="isEditModalVisible"
		@close="toggleModal('edit')">
		<template v-slot:header>
			Edytowanie serwisu
		</template>
		<template v-slot:body>
			<div class="mt-5">
				<label for="serviceName" class="block">Nazwa</label>
				<VInputText
					placeholder="Podaj nazwę serwisu"
					id="serviceName" 
					name="serviceName"
					v-model="modalData.name">
				</VInputText>
			</div>
            <div class="mt-5">
				<label for="servicePrefixes" class="block">Prefixy</label>
				<VInputText
					placeholder="Podaj nazwę serwisu"
					id="servicePrefixes" 
					name="servicePrefixes"
					v-model="modalData.prefixes">
				</VInputText>
                <p>Prefixy powinny być oddzielone przecinkami</p>
			</div>
		</template>
		<template v-slot:footer>
            <VButton @click="toggleModal('edit')" style="background: transparent;">Anuluj</VButton>
			<VButton @click="addService">Dodaj serwis</VButton>
		</template>
	</VModalChoice>
    <div class="flex">
		<VButton 
			style="margin: auto 0px auto auto; width: 200px; height: 50px;"
			@click="toggleModal('add')">
			DODAJ SERWIS
		</VButton>
	</div>
    <div>
        <table class="w-full mt-6">
            <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Prefixy</th>
                    <th>Akcje</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in data" :key="item.id">
                    <td>
                        {{ item.name }}
                    </td>
                    <td>
                        {{ item.prefixes.join(', ') }}
                    </td>
                    <td class="flex justify-center">
                        <VIcon
                            class="clickable block mr-5"
                            icon="bi bi-pencil-square"
                            color="yellow"
                            @click="toggleModal('edit',item.id)">
                        </VIcon>
                        <VIcon 
                            class="clickable block"
                            icon="bi bi-trash" 
                            color="red" 
                            @click="toggleModal('delete',item.id)">
                        </VIcon>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import VInputText from '@/components/VInputText.vue'
import VButton from '@/components/VButton.vue';
import VIcon from '@/components/VIcon.vue';
import VModalChoice from '@/components/VModalChoice.vue';

export default {
    components: {
        VIcon, VInputText, VButton, VModalChoice
    },
    data() {
        return {
            data: [ { "id": "9089a209-87b0-4673-bec4-4cbe21a9afea", "name": "tipple", "prefixes": [ "tipple", "Tipple" ] } ],
            isDeleteModalVisible: false,
            isAddModalVisible: false,
            isEditModalVisible: false,
            modalData: {
                name: '',
                prefixes: ''
            },
            clickedServiceId: ''
        }
    },
    methods: {
        async fetchData() {
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/donates/`
            const response = await fetch(url, {
                //credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            this.data = response.json();
        },
        async toggleModal(type, id = '') {
            this.clickedServiceId = id;
            switch(type) {
                case 'delete': 
                    this.isDeleteModalVisible = !this.isDeleteModalVisible;
                    return;
                case 'edit': 
                    this.isEditModalVisible = !this.isEditModalVisible;
                    await this.loadDataToModal();
                    return;
                case 'add': 
                    this.isAddModalVisible = !this.isAddModalVisible;
                    return;
                default: alert("Błąd popup");
            }
        },
        async deleteService(id) {
            //send api request
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/donates/${id}/`
            await fetch(url, {
                method: 'DELETE',
                //credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            this.fetchData();
        },
        async addService() {
            const name = modalData.name;
            const prefixes = modalData.prefixes.replace(' ', '').split(',');
            //send api request
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/donates/${id}/`
            await fetch(url, {
                method: 'POST',
                //credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(`{"name": ${name}, "prefixes": ${prefixes}}`)
            });
            this.fetchData();
        },
        async loadDataToModal() {
            //send api request by clickedServiceId
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/donates/${this.clickedServiceId}`
            const response = await fetch(url, {
                //credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            const x = response.json();
            this.modalData.name = x.name;
            this.modalData.prefixes = x.prefixes;
        },
        async updateService(id) {
            const name = modalData.name;
            const prefixes = modalData.prefixes.replace(' ', '').split(',');
            //send api request
            const url = `${import.meta.env.VITE_API_KEY}/api/v1/donates/${id}/`
            await fetch(url, {
                method: 'PUT',
                //credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(`{"name": ${name}, "prefixes": ${prefixes}}`)
            });
            this.isEditModalVisible = !this.isEditModalVisible;
            await this.fetchData();
        }
    }
}
</script>
<style scoped>
i {
    max-width: 25px;
}
.modal-body p {
    font-size: 12px;
    margin: -2px 0px 0px 2px;
    color: gray;
}
</style>