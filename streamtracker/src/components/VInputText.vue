<template>
    <input
    :type="type"
    :name="name"
    :id="id"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)">
</template>

<script>
export default {
    props: {
        type: {
            String,
            default: 'text'
        },
        id: String,
        name: String,
        placeholder: String,
        modelValue: [Number, String]
    },
    emits: ['update:modelValue']
}
</script>
<style scoped>
input {
    width: 300px;
    height: 50px;
    color: rgb(238, 238, 238);
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.253);
    padding: 0px 10px;
    border: none;
    outline: none;
}
</style>