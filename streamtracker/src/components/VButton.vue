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
    width: 200px;
    height: 50px;
    border-radius: 5px;
}
</style>