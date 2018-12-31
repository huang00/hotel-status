<template>
    <div class="finance-item padding-l-r-10">
        <div class="edit" key="100" v-if="edit">
            <Row>
                <Col span="2" v-if="!hideLabel">
                    <span style="font-size: 16px;">财务：</span>
                </Col>
                <Col :span="hideLabel ? 24 : 22">
                    <div style="margin-bottom: 10px;" v-for="(item, index) in data.records" :key="index">
                        <Select
                            style="width: 108px;"
                            :disabled="!item.canEdited"
                            v-model="item.financeType"
                            @on-change="reComputedFinance"
                        >
                            <Option
                                v-for="item in orderPaymentTypeList" :key="item.id"
                                :value="item.id" :label="item.name" />
                        </Select>
                        <Input
                            type="text"
                            style="width: 108px; margin-left: 30px;"
                            :disabled="!item.canEdited"
                            @on-blur="onBlurPrice(item)"
                            v-model="item.priceView"
                            placeholder="金额"/>
                        <Select
                            style="width: 108px; margin-left: 30px;"
                            v-model="item.paymentId"
                            :disabled="!item.canEdited"
                        >
                            <Option
                                v-for="item in orderPaymentList" :key="item.id"
                                :value="item.id" :label="item.name" />
                        </Select>
                        <span style="margin-left: 25px;">
                            <Icon
                                v-if="
                                    data.records.length >= 2 &&
                                    item.canEdited === 1
                                "
                                type="md-remove-circle"
                                style="cursor: pointer; margin-left: 5px;"
                                size="25"
                                color="#D67777"
                                @click="removePayItem(index)"
                            />
                            <span
                                style="cursor: pointer; margin-left: 5px;"
                                v-if="
                                    index === 0 && !hideAddPay && data.records.length < 20
                                "
                                @click="addPayItem">
                                <Icon
                                    type="md-add-circle"
                                    size="25"
                                    color="#286094"/>
                                <span style="font-size: 14px;">添加支付项</span>
                            </span>
                        </span>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="look" key="200" v-else>
            <Row>
                <Col span="2">
                    <span style="font-size: 16px;">财务：</span>
                </Col>
                <Col span="22" style="font-size: 14px;">
                    <div
                        style="margin-bottom: 10px;"
                        v-for="item in data.records"
                        :key="item.id"
                    >
                        <span>{{ fintOrderPaymentById(item.financeType) }}</span>
                        <span style="color: #D67777; margin-left: 15px; margin-right: 10px;">¥ {{toDecimal2(item.priceView)}}</span>
                        <span>{{ fintOrderPaymentTypeById(item.paymentId) }}</span> 
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import Base from '../Mixins/base'

    export default {
        name: 'FinanceItem',
        mixins: [Base],
        props: {
            hideAddPay: { // 隐藏添加支付项
                type: Boolean,
                default: false
            },
            hideLabel: { // 隐藏标签
                type: Boolean,
                default: false
            }
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
                    canEdited: 1,
                    paymentId: this.orderPaymentList[0].id
                }
            }
        },
        methods: {
            fintOrderPaymentById (id) {
                return this.orderPaymentTypeList.filter(item => item.id === id)[0].name
            },
            fintOrderPaymentTypeById (id) {
                return this.orderPaymentList.filter(item => item.id === id)[0].name
            },
            addPayItem () {
                this.data.records.unshift(Object.assign({}, this.newRecordsItem))
            },
            removePayItem (index) {
                this.data.records.splice(index, 1)
                this.reComputedFinance()
            },
            onBlurPrice (item) {
                this.moneyToDecimal2(item, 'priceView')
                this.reComputedFinance()
            }
        }
    }
</script>

<style lang="scss">
    .finance-item {
        margin-top: 20px;
    }
</style>
