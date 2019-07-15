<template>
    <div :class="['order-buttons', 'clearfix', getButtons.length === 1 ? 'center':'']">
        <button
            :class="item.className"
            v-for="(item, index) in getButtons"
            @click="handlerClick(item.className)"
            :key="index">{{ item.text }}
        </button>
    </div>
</template>

<script>
    export default {
        name: 'OrderButtons',
        props: {
            buttonsList: {
                type: Array,
                default () {
                    return []
                }
            },
            isOtaOrder: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                originButtonsList: [
                    { text: this.isOtaOrder ? '未到NO SHOW': '取消订单', className: 'cancle' },
                    { text: '修改订单', className: 'update' },
                    { text: '办理入住', className: 'check-in' },
                    { text: '办理退房', className: 'check-out' },
                    { text: '补录订单', className: 'repair' },
                    { text: '确定修改', className: 'confirm' },
                    { text: '确认预定', className: 'predetermine' }
                ]
            }
        },
        computed: {
            getButtons() {
                return this.originButtonsList.filter(item => this.buttonsList.indexOf(item.className) >= 0)
            }
        },
        methods: {
            handlerClick (className) {
                this.$emit('on-click', className)
            }
        }
    }
</script>

<style lang="scss">
    .order-buttons {
        height: 50px;
        background: #FCFCFC;
        padding: 8px 35px 0;
        margin-left: -10px;
        margin-right: -10px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        button {
            border: 0;
            cursor: pointer;
            outline: none;
            width: 110px;
            height: 32px;
            border-radius: 17px;
            font-size: 14px;
            &:not(.cancle) {
                margin-left: 50px;
                float: right;
                color: white;
            }
            &.cancle {
                background:linear-gradient(270deg,rgba(243,243,243,1) 0%,rgba(224,224,224,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(183,183,183,0.34);
            }
            &.update {
                background:linear-gradient(270deg,rgba(153,200,135,1) 0%,rgba(79,152,55,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(169,242,156,0.45);
            }
            &.check-in {
                background:linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
            }
            &.check-out {
                background:linear-gradient(270deg,rgba(221,175,141,1) 0%,rgba(184,91,43,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(242,191,156,0.45);
            }
            &.predetermine {
                background:linear-gradient(270deg,rgba(147,202,240,1) 0%,rgba(83,167,233,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
            }
            &.repair {
                background:linear-gradient(270deg,rgba(224,144,144,1) 0%,rgba(195,78,45,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(242,191,156,0.45);
            }
            &.confirm {
                background:linear-gradient(270deg,rgba(153,200,135,1) 0%,rgba(79,152,55,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(169,242,156,0.45);
            }
        }
        &.center {
            text-align: center !important;
            button {
                float: inherit !important;
            }
        }
    }
</style>
