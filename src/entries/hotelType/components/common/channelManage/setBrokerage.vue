<template>
    <div class="setBrokerageBox">
        <!-- 设置佣金模态框 -->
        <div class="brokerageMethod">
            <span :class="['radio', dataObj.method==='ratio'?'selected':'']" @click="switchMethod(dataObj)" :key="1">按照固定比例</span>
            <span :class="['radio', dataObj.method==='fixed'?'selected':'']" @click="switchMethod(dataObj)" :key="2">按照固定金额</span>
        </div>
        <div class="brokerageRatio">
            <p class="errinfo" v-if="errinfo">不能为空 ！</p>
            <p class="ratio" v-if="dataObj.method==='ratio'" key="1">
                佣金比例：<input type="text" maxlength="6" v-model="dataObj.value" placeholder="输入佣金比例"> &nbsp;%
            </p>
            <p class="fixed" v-if="dataObj.method==='fixed'" key="2">
                佣金金额：<input type="text" maxlength="6" v-model="dataObj.value" placeholder="输入佣金金额">
            </p>
        </div>
    </div>
</template>

<script>
import { trimAll } from 'common_libs/util.js'

export default {
    name: 'setBrokerage',
    props: {
        brokerageValue: { default: '' },
        brokerageMethod: { type: String, default: 'ratio'}
    },
    data () {
        return {
            dataObj: {
                value: '',
                method: 'ratio'
            },
            errinfo: false
        }
    },
    methods: {
        switchMethod (dataObj) {
            let method = dataObj.method
            dataObj.value = ''
            dataObj.method = method === 'ratio' ? 'fixed' : 'ratio'
        }
    },
    watch: {
        dataObj: {
            handler (val) {
                let isNum = /^[0-9]+\.?[0-9]*$/.test(val.value)
                if (isNum || Number(val.value) === 0) {
                    this.$emit('no-selected', {
                        value: parseFloat(val.value),
                        method: val.method
                    })
                } else {
                    setTimeout(() => {
                         val.value = 0
                    }, 100)
                }
                if (!trimAll(val.value) && val.value !== 0) {
                    this.errinfo = true
                } else {
                    this.errinfo = false
                }
            },
            deep: true
        }
    },
    created () {
        this.dataObj.value = this.brokerageValue
        this.brokerageMethod && (this.dataObj.method = this.brokerageMethod)
    }
}
</script>

<style scoped lang="scss">
    .setBrokerageBox {
        .brokerageMethod {
            display: flex;
            justify-content: space-around;
            .radio {
                width: 158px;
                height: 38px;
                line-height: 38px;
                font-size: 16px;
                text-align: center;
                display: inline-block;
                cursor: pointer;
                background: url('./img/brokerage.png') no-repeat 100% 100%;
                background-size: 100% 100%;
            }
            .radio.selected {
                background: url('./img/brokerageActive.png') no-repeat 100% 100%;
            }
        }
        .brokerageRatio {
            margin-top: 40px;
            font-size: 14px;
            color: #000000;
            padding-left: 94px;
            position: relative;
            input {
                border: 1px solid #D2D2D2;
                border-radius:6px;
                width:120px;
                height:28px;
                line-height: 28px;
                padding-left: 20px;
                font-size: 12px;
            }
            .errinfo {
                position: absolute;
                bottom: 35px;
                font-size: 12px;
                color: red;
                padding: 2px 25px;
                border-radius: 6px;
                left: 48%;
                box-shadow: 0px 2px 8px 0px rgba(189,189,189,1);
            }
            .errinfo:after {
                content: '';
                display: inline-block;
                width: 10px;
                height: 10px;
                border-top: 1px solid transparent;
                border-right: 1px solid transparent;
                transform: rotate(135deg);
                -webkit-transform: rotate(135deg);
                bottom: -5px;
                background: white;
                position: absolute;
                left: 19px;
                box-shadow: 1px -2px 3px 0px #bdbdbd;
            }
        }
    }
</style>
