<template>
    <div class="other-case">
        <div class="edit" v-if="edit">
            其他消费：
            <Input
                style="width: 251px;"
                placeholder="请输入房费外消费，如没有则填写0"
                @on-blur="onBlurOtherCast"
                v-model="data.otherCastView"
            />
            <span class="overflow-prompt" v-if="data.depositView < data.otherCastView">
                超出 {{ toDecimal2(data.depositView) }} 元押金的部分请现付
            </span>
            <span
                class="wraning"
                v-if="data.otherCastViewErrMsg"
            >
                <span style="font-size: 14px;">
                    <Icon type="md-alert" />
                    {{ data.otherCastViewErrMsg }}
                </span>
            </span>
        </div>
        <div class="look" v-else>
            其他消费：<span class="amount">￥&nbsp;{{toDecimal2(data.otherCastView)}}</span>
        </div>
    </div>    
</template>

<script>
import Base from '../Mixins/base'

export default {
    name: 'OtherCast',
    mixins: [Base],
    methods: {
        onBlurOtherCast () {
            this.moneyToDecimal2(this.data, 'otherCastView')
            this.reComputedFinance()
        }
    }
}
</script>

<style lang="scss">
    .other-case {
        padding-left: 15px;
        font-size: 14px;
        .edit {
            position: relative;
            .overflow-prompt {
                color: #D67777;
                margin-left: 20px;
            }
            .wraning {
                position: absolute;
                color: #D67777;
                top: 24px;
                left: 72px;
                line-height: 32px;
            }
        }
        .look {
            .amount {
                color: #D67777;
            }
        }
    }
</style>
