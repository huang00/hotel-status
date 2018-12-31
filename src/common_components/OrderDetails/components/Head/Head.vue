<template>
    <div class="order-header clearfix">
        <div class="edit clearfix" :key="1" v-if="edit">
            <div class="header-left">
                <p class="user-name-wrapper">
                    <Input
                        v-model="data.contactName"
                        placeholder="联系人"
                        style="width: 160px"
                        :maxlength="inputMaxLen"
                        @on-change="onChangeContactName(data.contactName)"
                    />
                    <Icon type="ios-medical" color="#D67777" />
                    <span class="wraning" v-if="errMsg">
                        <span style="font-size: 14px;">
                            <Icon type="md-alert" />
                            {{ errMsg }}
                        </span>
                    </span>
                    <Input
                        v-model="data.contactPhone"
                        placeholder="电话"
                        :maxlength="30"
                        style="width: 160px; margin-left: 50px;"
                        @on-keyup="requiredNumber(data, 'contactPhone')"
                    />
                </p>
            </div>
            <div class="header-right">
                <Select
                    v-model="data.orderFrom"
                    style="width:133px"
                    :disabled="!!data.otaOrderNo"
                >
                    <Option
                        v-for="item in orderFromList" :key="item.id"
                        :value="item.id"
                    > <span
                        :class="['channel-logo', getChannelFrom(item.channelCode).className]"
                        :style="{
                            color: item.channelColor
                        }"
                        >
                        <!-- <template v-if="!getChannelFrom(item.channelCode).className">
                            {{item.channelName.substring(0, 1)}}
                        </template> -->
                        </span> {{item.channelName}}</Option>
                </Select>
            </div>
        </div>
        <div class="look" :key="2" v-else>
            <div class="header-left">
                <p class="user-name-wrapper">
                    <span class="user-name">
                        <Icon type="md-person" size="25" style="margin-right: 23px;"/>{{data.contactName}}
                    </span> &nbsp;&nbsp;&nbsp;
                    <span class="order-ticket connect" v-if="data.otaOrderNo"> 直连 </span> 
                    <span class="order-ticket quickly" v-if="data.payType === 'quickly'"> 闪住 </span>
                </p>
                <p class="user-phone">
                    {{data.contactPhone}}
                </p>
            </div>
            <div class="header-right">
                <p class="channel">
                    <span
                        :class="['channel-logo', getChannelFrom(findOrderFromById(data.orderFrom)[0].channelCode).className]"
                        :style="{
                            color: findOrderFromById(data.orderFrom)[0].channelColor
                        }"
                    >
                        <template v-if="!getChannelFrom(findOrderFromById(data.orderFrom)[0].channelCode).className">
                            {{findOrderFromById(data.orderFrom)[0].channelName.substring(0, 1)}}
                        </template>
                    </span>
                    {{ findOrderFromById(data.orderFrom)[0].channelName }}
                </p>
                <p class="order-num" style="height: 18px;">
                    <template v-if="data.otaOrderNo">
                        订单号：{{ data.otaOrderNo }}
                    </template>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getChannelFrom,
        trimAll
    } from 'common_libs/util'
    import Base from '../Mixins/base'

    export default {
        name: 'Head',
        mixins: [Base],
        data () {
            return {
                getChannelFrom,
                errMsg: ''
            }
        },
        created() {
            this.$root.Bus.$on('on-order-form-validate', (errObj) => {
                this.errMsg = errObj.contactName && errObj.contactName.errMsg
            })
        },
        computed: {
            orderFromList () {
                let orderFromList = this.$store.getters.orderFromList.filter(item => item.deleted === 0)
                if (!this.data.orderFrom || this.findOrderFromById(this.data.orderFrom)[0].deleted === 1) {
                    orderFromList.map(item => {
                        if (item.channelCode === '000000')
                            this.data.orderFrom = item.id
                    })
                }
                return orderFromList
            }
        },
        methods: {
            findOrderFromById (fromId) {
                return this.$store.getters.orderFromList.filter(item => item.id === fromId)
            },
            onChangeContactName (val) {
                this.errMsg = !trimAll(val)
                    ? '联系人姓名不能为空' : ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .order-header {
        .edit {
            height: 45px;
            padding-top: 6px;
            .header-left {
                padding-left: 14px;
                .user-name-wrapper {
                    position: relative;
                    .wraning {
                        position: absolute;
                        color: #D67777;
                        top: 30px;
                        left: 0;
                        width: 148px;
                        line-height: 32px;
                    }
                }
                &:before {
                    top: -5px;
                }
            }
            .header-right {
                float: right;
                padding-right: 15px;
            }
        }
        .look {
            .header-left {
                padding-left: 10px;
                .user-name-wrapper {
                    .user-name {
                        color: #1F5A8E;
                        font-size: 18px;
                    }
                    .order-ticket {
                        width:31px;
                        line-height:18px;
                        border-radius:6px;
                        color: white;
                        display: inline-block;
                        text-align: center;
                        &.connect {
                            background:linear-gradient(270deg,rgba(234,166,166,1) 0%,rgba(214,119,119,1) 100%);
                        }
                        &.quickly {
                            background:linear-gradient(270deg,rgba(154,199,225,1) 0%,rgba(94,155,203,1) 100%);
                        }
                    }
                }
                .user-phone {
                    font-size: 14px;
                    color: #666;
                    line-height: 27px;
                    padding-left: 46px;
                }
                &:before {
                    top: 7px;
                }
            }
            .header-right {
                float: right;
                text-align: right;
                margin-top: 5px;
                color: #666666;
                padding-right: 15px;
                .channel {
                    font-size: 14px;
                    line-height: 25px;
                    margin-bottom: 5px;
                }
            }
        }
        .channel-logo {
            width: 19px;
            height: 19px;
            line-height: 19px;
            margin-right: 5px;
            background-color: #F7F7F7;
        }
        .header-left {
            float: left;
            padding-left: 20px;
            line-height: 35px;
            position: relative;
            &:before {
                content: " ";
                display: inline-block;
                width: 2px;
                background: #1F5A8E;
                height: 47px;
                position: absolute;
                left: -10px;
            }
        }
    }
</style>
