<template>
    <div class="cancle custom-scrollbar scroll-container">
        <div class="clearfix">
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
        <finance-item
            ref="financeItem"
            :data="data"
            :hide-add-pay="true"
            :hide-label="true"
            :edit="true">
        </finance-item>
        <Remark
            :hide-label="true"
            :data="data"
            :edit="true">
        </Remark>
    </div>
</template>

<script>
    import orderDetailsMixins from '../Mixins/orderDetails'

    export default {
        name: 'OrderCancle',
        mixins: [ orderDetailsMixins ],
        methods: {
            addPayItem () {
                this.$refs.financeItem.addPayItem()
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
        &.scroll-container {
            height: 275px;
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
