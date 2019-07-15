<template>
    <div class="modal-header fontSize16">
        {{ title }}
    </div>
</template>

<script>
export default {
    name: 'ModalHeader',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    $base-color: #235F92;
    .modal-header {
        color: $base-color;
        line-height: 35px;
        padding: 0 25px;
    }
</style>

