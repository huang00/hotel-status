<template>
    <div
        class="order-info"
        :style="{
            background: data.status === 0 ? '#EA9A70' : data.status === 1 ? '#52ADF5':'#C7C7C7'
        }"
    >
        <p
            class="contact-name text-break-1"
            :style="{
                color: data.status === 2 ? '#333333' : 'white'
            }"
        >{{ data.contactName }}</p>
        <div class="order-from">
            <span
                :class="['channel-logo', getChannelFrom(findOrderFromById(data.orderFrom).channelCode).className]"
                :style="{
                    color: findOrderFromById(data.orderFrom).channelColor
                }"
            >
                <template v-if="!getChannelFrom(findOrderFromById(data.orderFrom).channelCode).className">
                    {{findOrderFromById(data.orderFrom).channelName.substr(0, 1)}}
                </template>
            </span>
            <span
                class="channel-name" v-if="data.nights !== 1"
                :style="{
                    color: data.status === 2 ? '#333333' : 'white'
                }"
            >{{findOrderFromById(data.orderFrom).channelName}}</span>
        </div>
        <span
            :class="['pay-marker',
            data.nights === 1? 'single': '',
            getChannelFrom(findOrderFromById(data.orderFrom).channelCode).playType]"
            v-if="data.isOtaOrder"
        >
            {{getChannelFrom(findOrderFromById(data.orderFrom).channelCode).playTypeName}}
        </span>
    </div>
</template>

<script>
    import {
        getChannelFrom
    } from 'common_libs/util'

    export default {
        name: 'OrderInfo',
        props: {
            single: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                getChannelFrom
            }
        },
        computed: {
            orderFromList () {
                return this.$store.getters.orderFromList
            }
        },
        methods: {
            findOrderFromById (fromId) {
                return this.orderFromList.filter(item => item.id === fromId)[0]
            }
        }
    }
</script>

<style lang="scss">
    .order-info {
        pointer-events: none;
        border-radius: 4px;
        background: #52ADF5;
        height: 70px;
        padding-top: 7px;
        padding-left: 10px;
        position: relative;
        color: white;
        .contact-name {
            font-size: 16px;
            width: 70%;
        }
        .pay-marker {
            position: absolute;
            padding: 0 8px;
            border-radius:6px;
            line-height: 22px;
            right: 10px;
            top: 8px;
            &.before {
                background: linear-gradient(231deg,rgba(255,210,90,1) 0%,rgba(255,175,45,1) 100%);
                box-shadow: 2px 2px 6px 0px rgba(245,166,35,0.34);
            }
            &.now {
                background:linear-gradient(225deg,rgba(25,199,197,1) 0%,rgba(21,176,168,1) 100%);
                box-shadow:2px 2px 6px 0px rgba(21,177,170,0.5);
            }
            &.quickly {
                background:linear-gradient(270deg,rgba(154,199,225,1) 0%,rgba(94,155,203,1) 100%);
            }
            &.single {
                top: initial;
                bottom: 8px;
            }
        }
        .order-from {
            margin-top: 10px;
            .channel-logo {
                height: 22px;
                width: 22px;
                line-height: 22px;
            }
        }
    }
</style>
