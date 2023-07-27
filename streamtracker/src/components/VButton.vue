<template>
    <button>
        <slot></slot>
    </button>
</template>
<script>
export default {
    
}

</script>
<style scoped>
button {
    background-color: rgb(0, 173, 181);
    color: rgb(238, 238, 238);
    font-weight: bold;
    display: block;
    border-radius: 5px;
    padding: 5px 20px;
    border: 1px solid rgb(0, 173, 181);
}
button:hover {
    filter:brightness(1.2)
}
</style>