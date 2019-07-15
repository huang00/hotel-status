<template>
    <div class="order-details-warpper">
       <div class="check-in custom-scrollbar scroll-container">
           <main class="main-content">
                <Head
                    :data="data"
                    :edit="!data.id">
                </Head>
                <suborder-item
                    :data="data"
                    :hide-checkbox="false"
                    order-opr-type="check-in"
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
            @on-click="handlerEventType('check-in')"
            :buttons-list="['check-in']">
        </order-buttons>
    </div>
</template>

<script>
    import orderDetailsMixins from '../Mixins/orderDetails'
    import {
        newClientItem
    } from 'hotelStatus/libs/util'

    export default {
        name: 'OrderLook',
        mixins: [ orderDetailsMixins ],
        data () {
            return {
                edit: true
            }
        },
        created() {
            this.data.suborders.map((item, index) => {
                // item.checked = index === 0
                if (!item.clients.length && item.status === 0)
                    item.clients.push(Object.assign({}, newClientItem))
            })
            if (!this.data.records.length) {
                this.data.records.push({
                    id: null,
                    financeType: 1,
                    priceView: '',
                    priceViewErrMsg: '',
                    paymentId: this.orderPaymentList[0].id,
                    canEdited: 1
                })
            }
        },
        computed: {
            orderPaymentList () {
                return this.$store.getters.orderPaymentList
            }
        }
    }
</script>

<style lang="scss">
    @import '../common/css/orderDetails';
</style>
