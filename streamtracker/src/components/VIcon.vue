<template>
    <i :class="icon" :style="'font-size:'+size+';color:'+color"></i>
</template>
<script>
export default {
    props: {
        icon: {
            String,
            required: true
        },
        color: {
            String,
            default: 'white'
        },
        size: {
            String,
            default: "16px"
        }
    }
}
</script>