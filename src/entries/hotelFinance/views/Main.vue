<template>
    <div class="hotel-finance-main" style="background: #fafafa">
        <sider-menu></sider-menu>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>
<script>
    import SiderMenu from './siderMenu/'

    export default {
        name: 'hotelFinanceMain',
        components: {
            SiderMenu
        }
    }
</script>

<style lang="scss" scoped>
    .hotel-finance-main {
        height: 100%;
        padding-top: 70px;
        position: relative;
        padding-left: 200px;
        main {
            padding: 10px;
            overflow-y: scroll;
            height: 100%;
        }
    }

</style>
