<template>
    <div class="order-details-warpper">
       <div class="look-details custom-scrollbar scroll-container">
           <main class="main-content">
                <Head
                    :data="data"
                    :edit="edit">
                </Head>
                <suborder-item
                    :data="data"
                    :edit="edit">
                </suborder-item>
                <Remark
                    :data="data"
                    :edit="edit">
                </Remark>
                <finance-item
                    :data="data"
                    :edit="edit">
                </finance-item>
           </main>
            <Foot :data="data"></Foot>
        </div>
        <order-buttons
            :buttons-list="buttonsList"
            @on-click="handlerButtonClick">
        </order-buttons>
    </div>
</template>

<script>
    import orderDetailsMixins from '../Mixins/orderDetails'

    export default {
        name: 'OrderLook',
        mixins: [ orderDetailsMixins ],
        data () {
            return {
                edit: false,
                buttonsList: ['update']
            }
        },
        methods: {
            handlerButtonClick (oprType) {
                this.handlerEventType('switch', oprType)
            }
        }
    }
</script>

<style lang="scss">
    @import '../common/css/orderDetails';
</style>
