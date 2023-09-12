<template>
    <i
        :class="[icon, clickable ? 'clickable' : '']"
        :style="'font-size:'+size+';color:'+color">
    </i>
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
            default: "20px"
        },
        clickable: {
            Boolean,
            default: true
        }
    }
}
</script>
<style scoped>
.clickable {
	cursor: pointer;
}
</style>