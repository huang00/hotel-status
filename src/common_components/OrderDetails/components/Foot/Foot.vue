<template>
    <footer class="order-footer padding-l-r-10">
        已收：<span class="money">¥ {{toDecimal2(data.paidAmountView)}}</span> &nbsp;&nbsp;&nbsp;
        押金：<span class="money">¥ {{toDecimal2(data.depositView)}}</span> &nbsp;&nbsp;&nbsp;
        需补：<span class="money">¥ {{toDecimal2(data.subsidyView)}}</span> &nbsp;&nbsp;&nbsp;
        <span style="font-size: 16px;">订单总额：</span><span class="money">¥ {{toDecimal2(data.totalAmountView)}}</span>
    </footer>
</template>

<script>
    import Base from '../Mixins/base'

    export default {
        name: 'OrderFoot',
        mixins: [Base],
        props: {
            data: {
                type: Object,
                default () {
                    return {}
                }
            }
        }
    }
</script>

<style lang="scss">
    .order-footer {
        margin-top: 20px;
        text-align: right;
        font-size: 14px;
        .money {
            color: #D67777;
        }
    }
</style>
