<template>
    <div class="order-details-warpper">
       <div class="check-out custom-scrollbar scroll-container">
           <main class="main-content">
                <Head
                    :data="data"
                    :edit="false">
                </Head>
                <suborder-item
                    :data="data"
                    :hide-checkbox="false"
                    order-opr-type="check-out"
                    :edit="false">
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
            @on-click="handlerEventType('check-out')"
            :buttons-list="buttonsList">
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
                edit: true,
                buttonsList: ['check-out']
            }
        }
    }
</script>

<style lang="scss">
    @import '../common/css/orderDetails';
</style>
