<template>
<div>
    <label class="block">{{ placeholder }}
        <select class="w-full"
        :name="name"
        :id="id"
        @change="$emit('update:modelValue', $event.target.value)">
            <option>Wybierz</option>
            <option :value="item" v-for="item in items">{{ item }}</option>
        </select>
    </label>
</div>
</template>
<script>
export default {
    props: {
        items: {
            String,
            required: true
        },
        id: String,
        name: String,
        placeholder: String,
        modelValue: String, Array
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