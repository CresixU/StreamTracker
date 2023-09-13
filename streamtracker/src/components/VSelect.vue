<template>
<div>
    <label class="block">{{ placeholder }}
        <select class="w-full"
        v-if="!isDataObject"
        :name="name"
        :id="id"
        @change="$emit('update:modelValue', $event.target.value)">
            <option>Wybierz</option>
            <option :value="item" v-for="item in items">{{ item }}</option>
        </select>
        <select class="w-full"
        v-else
        :name="name"
        :id="id"
        @change="$emit('update:modelValue', $event.target.value)">
            <option>Wybierz</option>
            <option :value="item.id" v-for="item in items">{{ item.name }}</option>
        </select>
    </label>
</div>
</template>
<script>
export default {
    props: {
        items: {
            required: true
        },
        id: String,
        name: String,
        placeholder: String,
        modelValue: String,
        isDataObject: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue']
}
</script>
<style scoped>
select {
    color: rgb(238, 238, 238);
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.253);
    padding: 10px 10px;
    border: none;
    outline: none;
}
select * {
    color: rgb(238, 238, 238);
    background-color: #191e25; 
    padding: 10px 10px;
    border: none;
}
</style>