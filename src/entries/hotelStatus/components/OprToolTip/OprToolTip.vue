<template>
    <!-- 显示 预定、取消、入住 -->
    <div
        :class="{
            'tool-tip': true,
            'overflow-left': toolTipStyle.overflowLeft,
            'overflow-top': toolTipStyle.overflowTop
        }"
        ref="toolTip"
        :style="toolTipStyle">
        <span
            @click="busEventName('on-open-predetermine')"
            @mouseup.stop
            class="predetermine"
        > {{ isPredetermine? '预定': '补录'}}</span>
        <span
            @click="busEventName('on-open-check-in')"
            @mouseup.stop
            v-if="showCheckInButton"
            class="check-in">入住</span>
        <span
            @click="busEventName('on-cancle-all-checked')"
            @mouseup.stop
            class="cancle"
        >取消</span>
    </div>
</template>

<script>
export default {
    name: 'OprToolTip',
    props: {
        toolTipStyle: {
            type: Object,
            default () {
                return {}
            }
        },
        showCheckInButton: {
            type: Boolean,
            default: false
        },
        isPredetermine: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        busEventName (eventName) {
            this.$root.Bus.$emit(eventName)
        }
    }
}
</script>

<style lang="scss">
    .tool-tip {
        position: absolute;
        min-width: 104px;
        line-height: 40px;
        font-size: 14px;
        color: white;
        text-align: center;
        border-radius:0px 4px 4px 4px;
        z-index: 1;
        span {
            padding: 0 12px;
            cursor: pointer;
            float: left;
            &.predetermine {
                background: rgba(13,13,13, 0.6);
                border-bottom-left-radius: 4px;
                &:after {
                    left: 0;
                    top: -8px;
                    border-color: rgba(13,13,13, 0.6);
                    border-top-width: 0;
                    border-left-width: 0;
                    border-right-width: 10px;
                    border-style: dashed;
                    border-left-color: transparent;
                    border-right-color: transparent;
                }
            }
            &.check-in {
                background: rgba(13,13,13,0.5);
            }
            &.cancle {
                background: rgba(13,13,13,0.3);
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            &:hover {
                background: rgba(13,13,13, 0.7) !important;
            }
            &.predetermine:hover {
                &:after {
                    border-bottom-color: rgba(13,13,13, 0.7);
                }
            }
            &:after {
                content: " ";
                position: absolute;
                line-height: 0;
                border-width: 8px;
            }
        }
    }
    .tool-tip.overflow-left {
        .predetermine {
            background: rgba(13,13,13, 0.6);
            border-radius: 4px 0 0 4px;
            &:after {
                display: none;
            }
        }
        .cancle {
            background: rgba(13,13,13,0.3);
            border-top-right-radius: 0;
            border-bottom-right-radius: 4px;
            &:after {
                right: 0;
                top: -8px;
                content: " ";
                border-color: rgba(13,13,13, 0.3);
                border-top-width: 0;
                border-right-width: 0;
                border-left-width: 10px;
                border-style: dashed;
                border-left-color: transparent;
            }
            &:hover {
                &:after {
                    border-bottom-color: rgba(13,13,13, 0.7);
                }
            }
        }
    }
    .tool-tip.overflow-top {
        .predetermine {
            border-radius: 4px 0 0 0;
            &:after {
                left: 0;
                top: 40px;
                border-color: rgba(13,13,13, 0.6);
                border-bottom-width: 0;
                border-left-width: 0;
                border-right-width: 10px;
                border-top-width: 8px;
                border-style: dashed;
                border-left-color: transparent;
                border-right-color: transparent;
            }
        }
    }
    .tool-tip.overflow-top.overflow-left {
        .predetermine {
            border-radius: 4px 0 0 4px;
        }
        .cancle {
            border-radius: 0 4px 0 0;
            &:after {
                right: 0;
                top: 40px;
                content: " ";
                border-color: rgba(13,13,13, 0.3);
                border-bottom-width: 0;
                border-right-width: 0;
                border-top-width: 8px;
                border-left-width: 10px;
                border-style: dashed;
                border-left-color: transparent;
            }
            &:hover {
                &:after {
                    border-top-color: rgba(13,13,13, 0.7);
                }
            }
        }
    }
</style>

