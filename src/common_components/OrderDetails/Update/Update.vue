<template>
    <div class="order-details-warpper">
       <div class="update-details custom-scrollbar scroll-container">
           <main class="main-content">
                <Head
                    :data="data"
                    :edit="edit">
                </Head>
                <suborder-item
                    :data="data"
                    order-opr-type="update"
                    :edit="edit">
                </suborder-item>
                <template v-if="data.payType === 'quickly'">
                    <other-cast
                        :data="data"
                        :edit="edit"
                    ></other-cast>
                </template>
                <Remark
                    :data="data"
                    :edit="edit">
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
            @on-click="handlerEventType('update')"
            :buttons-list="buttonsList"
            ></order-buttons>
    </div>
</template>

<script>
    import orderDetailsMixins from '../Mixins/orderDetails'
    import {
        TODAY,
        formatDate
    } from 'common_libs/util'
    import {
        checkIsPredetermine,
        newClientItem
    } from 'hotelStatus/libs/util'

    export default {
        name: 'OrderUpate',
        mixins: [ orderDetailsMixins ],
        data () {
            return {
                edit: true
            }
        },
        created () {
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
            this.data.suborders.map((item, index) => {
                if (!item.clients.length && item.status === 2)
                    item.clients.push(Object.assign({}, newClientItem))
            })
        },
        computed: {
            orderPaymentList () {
                return this.$store.getters.orderPaymentList
            },
            buttonsList () {
                let buttonsList = []
                let isPredetermine = false

                for (let i = this.data.suborders.length; i--;) {
                    let item = this.data.suborders[i]
                    let checkInDate = +new Date(formatDate(item.checkInDateView))
                    if (!this.data.id)
                        isPredetermine = checkIsPredetermine(checkInDate)
                }
                if (this.data.id)
                    buttonsList.push('confirm')
                else if (isPredetermine)
                    buttonsList.push('predetermine')
                else
                   buttonsList.push('repair')
                return buttonsList
            }
        }
    }
</script>

<style lang="scss">
    @import '../common/css/orderDetails';
</style>
