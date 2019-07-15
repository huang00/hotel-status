<template>
    <div class="order-details-warpper">
       <div class="update-details custom-scrollbar scroll-container">
           <main class="main-content">
                <Head
                    :data="data"
                    :edit="false">
                </Head>
                <suborder-item
                    :data="data"
                    :edit="false">
                </suborder-item>
                <Remark
                    :data="data"
                    :edit="false">
                </Remark>
                <finance-item
                    :data="data"
                    :edit="edit">
                </finance-item>
           </main>
            <Foot
                :data="data"
            ></Foot>
        </div>
        <order-buttons
            @on-click="handlerEventType('Updatefinance')"
            :buttons-list="buttonsList"
            ></order-buttons>
    </div>
</template>

<script>
    import orderDetailsMixins from '../Mixins/orderDetails'

    export default {
        name: 'OrderUpate',
        mixins: [ orderDetailsMixins ],
        data () {
            return {
                edit: true,
                buttonsList: ['confirm']
            }
        },
        created() {
            if (!this.data.records.length) {
                this.data.records.push({
                    id: null,
                    financeType: 1,
                    priceView: '',
                    paymentId: 1,
                    canEdited: 1
                })
            }
        }
    }
</script>

<style lang="scss">
    @import '../common/css/orderDetails';
</style>
