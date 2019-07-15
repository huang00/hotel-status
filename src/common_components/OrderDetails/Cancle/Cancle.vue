<template>
    <div class="cancle custom-scrollbar scroll-container">
        <div class="clearfix" style="margin-bottom: 20px;">
            <div class="paid-money">
                已收金额：¥  {{toDecimal2(data.paidAmountView)}}
            </div>
            <div
                class="add-pay-item"
                @click="addPayItem"
                v-if="data.records.length < 20"
            >
                <Icon
                    style="margin-right: 5px;"
                    type="md-add-circle"
                    size="25"
                    color="#286094"/>添加支付项
            </div>
        </div>
        <!-- <finance-item
            ref="financeItem"
            :data="data"
            :hide-add-pay="true"
            :hide-label="true"
            :edit="true">
        </finance-item> -->
        <div
            style="margin-left: 15px; position: relative; margin-bottom: 20px;"
            v-for="(item, index) in financeList"
            :key="index"
        >
            <Select
                style="width: 108px;"
                v-model="item.financeType"
            >
                <Option
                    v-for="subItem in orderPaymentTypeList" :key="subItem.id"
                    :value="subItem.id" :label="subItem.name" />
            </Select>
            <Input
                type="text"
                style="width: 108px; margin-left: 30px;"
                v-model="item.priceView"
                @on-blur="onBlurPrice(item)"
                placeholder="金额"/>
            <Select
                style="width: 108px; margin-left: 30px;"
                v-model="item.paymentId"
            >
                <Option
                    v-for="subItem in orderPaymentList" :key="subItem.id"
                    :value="subItem.id" :label="subItem.name" />
            </Select>
            <Icon
                type="md-remove-circle"
                style="cursor: pointer; margin-left: 15px;"
                size="25"
                v-if="financeList.length >= 2"
                color="#D67777"
                @click="removePayItem(index)"
            />
            <span
                class="wraning"
                v-if="item.priceViewErrMsg"
            >
                <span style="font-size: 14px;">
                    <Icon type="md-alert" />
                    {{ item.priceViewErrMsg }}
                </span>
            </span>
        </div>
        <Remark
            :hide-label="true"
            :data="data"
            :edit="true">
        </Remark>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import orderDetailsMixins from '../Mixins/orderDetails'
    import Base from '../components/Mixins/base'

    export default {
        name: 'OrderCancle',
        mixins: [ orderDetailsMixins, Base ],
        data () {
            return {
                financeList: []
            }
        },
        created () {
            this.financeList.push(Object.assign({}, this.newRecordsItem))
        },
        destroyed() {
            this.setFinanceListByCancleOrder([])
        },
        computed: {
            orderPaymentList () {
                return this.$store.getters.orderPaymentList
            },
            orderPaymentTypeList () {
                return this.$store.getters.orderPaymentTypeList
            },
            newRecordsItem () {
                return {
                    id: null,
                    financeType: 1,
                    priceView: '',
                    priceViewErrMsg: '',
                    canEdited: 1,
                    paymentId: this.orderPaymentList[0].id
                }
            }
        },
        methods: {
            ...mapMutations([
                'setFinanceListByCancleOrder'
            ]),
            addPayItem () {
                this.financeList.unshift(Object.assign({}, this.newRecordsItem))
            },
            removePayItem (index) {
                this.financeList.splice(index, 1)
            },
            onBlurPrice (item) {
                this.moneyToDecimal2(item, 'priceView')
                this.setFinanceListByCancleOrder(this.financeList)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common/css/orderDetails';
    .cancle {
        padding: 0 14px;
        color: #666;
        font-size: 14px;
        .wraning {
            position: absolute;
            left: 141px;
            top: 30px;
            color: #D67777;
            height: 22px;
            z-index: 1;
        }
        &.scroll-container {
            margin-top: -10px;
            padding: 10px 0;
            height: 304px;
            .clearfix {
                padding: 0 15px;
                .paid-money {
                    float: left;
                }
                .add-pay-item {
                    float: right;
                    cursor: pointer;
                }
            }
        }
    }
</style>
