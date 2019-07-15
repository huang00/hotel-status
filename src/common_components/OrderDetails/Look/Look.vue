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
            <Foot :data="data"></Foot>
        </div>
        <order-buttons
            :buttons-list="buttonsList"
            :is-ota-order="!!data.otaOrderNo"
            @on-click="handlerButtonClick">
        </order-buttons>
    </div>
</template>

<script>
    import orderDetailsMixins from '../Mixins/orderDetails'
    import {
        TODAY,
        formatDate
    } from 'common_libs/util'

    export default {
        name: 'OrderLook',
        mixins: [ orderDetailsMixins ],
        data () {
            return {
                edit: false
            }
        },
        computed: {
            buttonsList () {
                let buttonsList = []
                let isCheckIn = false
                let isCheckOut = false
                let isCancle = true
                let today = +new Date(formatDate(TODAY))
                for (let i = this.data.suborders.length; i--;) {
                    let item = this.data.suborders[i]
                    let checkInDate = +new Date(formatDate(item.checkInDateView))
                    let checkOutDate = +new Date(item.checkOutDateView)
                    if (
                        checkInDate <= today &&
                        item.status === 0 &&
                        this.data.id
                    ) isCheckIn = true
                    if (
                        item.status === 1 &&
                        (
                            item.payType !== 'quickly' ||
                            (item.payType === 'quickly' && checkOutDate <= today)
                        )
                    )
                        isCheckOut = true
                }
                if (
                    this.data.otaOrderNo &&
                    this.data.orderStatus !== 0 &&
                    this.data.orderStatus !== 6 &&
                    this.data.orderStatus !== 5
                ) isCancle = false
                isCheckIn &&
                    buttonsList.push('check-in')
                isCheckOut &&
                    buttonsList.push('check-out')
                isCancle &&
                    buttonsList.push('cancle')

                buttonsList.push('update')
                return buttonsList
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
