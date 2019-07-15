<template>
    <div class="hotelTypeRightContent f_d">
        <div class="labelTittel">
            <p class="tittelCont">房型列表</p>
            <div class="addRoom">
                <div class="addRoomBtn" @click="openModal('addRoomModal')">
                    <Icon type="md-add" size="19" style="font-weight: 600;"></Icon>
                    <span>添加房型</span>
                </div>
            </div>
        </div>
        <div class="roomList">
            <div class="decorativeStrip"></div>
            <div class="table">
                <ul class="tableHead">
                    <li class="roomType">房间类型</li>
                    <li class="roomId">房间号</li>
                    <li class="roomNumber">房间数</li>
                    <li class="defaultPrice">初始价格</li>
                    <li class="action"></li>
                </ul>
                <div class="tableBody">
                    <ul class="tableRow" v-for="(item,value) in hotelRoomTypeInfoList" :key="value">
                        <li class="roomTypeRow roomType" :roomTypeId="item.roomTypeId">{{item.roomTypeName}}</li>
                        <li class="roomTypeRow roomId">
                            <span v-for="(key, index) in item.roomList" :roomId="key.roomId" :key="index">{{key.roomNo}}</span>
                        </li>
                        <li class="roomTypeRow roomNumber">{{item.roomList.length}}</li>
                        <li class="roomTypeRow defaultPrice">{{item.defaultPrice}}</li>
                        <li class="roomTypeRow action">
                            <div class="settingPrice" @click="openModal('setPriceModal',value, item.roomTypeId)">
                                <span class="icon"><i class="iconfont icon-shezhi"></i></span>
                                <span class="content">设置周末或特殊价格</span>
                            </div>
                            <div class="modify" @click="openModal('addRoomModal',value, item.roomTypeId)">
                                <span class="icon"><i class="iconfont icon-xiugai"></i></span>
                                <span class="content">修改</span>
                            </div>
                            <div class="delite" @click="del(item.roomTypeId)">
                                <span class="icon"><i class="iconfont icon-delete"></i></span>
                                <span class="content">删除</span>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        <div class="roomSort">
            <div class="roomTab">
                <span @click="currentComponent = 'roomTypeSort'" :class="[currentComponent==='roomTypeSort'?'active':'', 'item-tab']">房型排序</span>
                <!-- <span @click="currentComponent = 'roomSort'" :class="[currentComponent==='roomSort'?'active':'', 'item-tab']">房间排序</span>
                <span class="hint" v-if="currentComponent === 'roomSort'">
                    <Icon type="ios-medical" color="#FA2323"></Icon> 你可以拖动房间号改变房间归属，同时可以改变房型下面的房间排序
                </span> -->
            </div>
            <component v-bind:is="currentComponent"></component>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    import roomTypeSort from './roomTypeSort.vue'
    import roomSort from './roomSort.vue'
    import addRommTypeModal from '../hotelModal/addHotelRoomTypeModal'
    import {getCookie, compare} from '../../../../../common_libs/util';
    
    export default {
        name: 'hotelTypeRightContent',
        components: {
            roomTypeSort,
            roomSort,
            addRommTypeModal
        },
        data() {
            return {
                currentComponent: 'roomTypeSort'
            }
        },
        computed: {
            hotelRoomTypeInfoList() {
                let list = this.$store.state.hotelStatus.hotelRoomTypeInfoList;
                list = list.sort(compare('roomTypeSequence'))
                for (let i = 0, len = list.length; i < len; i++) {
                    list[i].roomList = list[i].roomList.sort(compare('roomSequence', false))
                }
                return list;
            },
        },
        methods: {
            ...mapActions(['dispatchWhenChangeOrderAndUpIsTrue']),
            openModal(modalName, value, roomTypeId) {
                if (modalName === 'addRoomModal') {
                    this.$emit('openModal', [modalName, value, roomTypeId])
                } else if (modalName === 'setPriceModal') {
                    this.$emit('openModal', [modalName, value, roomTypeId])
                } else {
                    this.$emit('openModal', modalName)
                }

            },
            del(roomId) {
                this.dispatchWhenChangeOrderAndUpIsTrue({
                    'isOpen': true,
                    'type': 3,
                    'bodyCont': '确认删除？',
                    'data': {
                        roomTypeId: roomId,
                        innId: getCookie('innId'),
                        uid: getCookie('userId')
                    },
                });
            }
        }
    }
</script>
<style lang="scss" src="../../../assets/iconfont/iconfont.css"></style>
<style scoped lang="scss">
    .hotelTypeRightContent {
        height: 100%;
        -moz-user-select: none;
        user-select: none;
        .labelTittel {
            width: 100%;
            height: 50px;
            display: flex;
            line-height: 50px;
            padding: 5px 0 60px;
            justify-content: space-between;
            .tittelCont {
                width: 20%;
                font-size: 18px;
                font-weight: 500;
                color: #000;
            }
            .addRoom {
                width: 30%;
                display: flex;
                padding-top: 10px;
                color: #fff;
                justify-content: flex-end;
                .addRoomBtn {
                    width: 130px;
                    height: 29px;
                    line-height: 30px;
                    text-align: center;
                    background-color: #0B8CEF;
                    font-size: 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
        .roomList {
            width: 100%;
            height: 335px;
            overflow-y: auto;
            .decorativeStrip {
                width: 100%;
                height: 6px;
                background: linear-gradient(#0B8CEF, #B9E1FF);
                border-radius: 0 0 3px 0;
            }
            .table {
                .roomType {
                    width: 12%;
                }
                .roomId {
                    width: 28%;
                }
                .roomNumber {
                    width: 9%;
                }
                .defaultPrice {
                    width: 11%;
                }
                /*.weekenPrice {*/
                /*width: 12%;*/
                /*}*/
                .action {
                    width: 40%;
                }
                width: 100%;
                .tableHead {
                    width: 100%;
                    height: 35px;
                    background-color: #DDEAF4;
                    font-size: 16px;
                    line-height: 35px;
                    color: #000;
                    font-weight: 500;
                    display: flex;
                    border-left: 1px solid #AAAAAA;
                    border-right: 1px solid #AAAAAA;
                    justify-content: flex-start;
                    li {
                        padding-left: 25px;
                    }
                }
                .tableBody {
                    width: 100%;
                    .tableRow {
                        width: 100%;
                        border-left: 1px solid #AAAAAA;
                        border-bottom: 1px solid #AAAAAA;
                        border-right: 1px solid #AAAAAA;
                        display: flex;
                        justify-content: flex-start;
                        .roomTypeRow {
                            padding: 15px 36px;
                            color: #434343;
                            border-left: 1px solid #AAAAAA;
                            word-break: break-all;
                            > span {
                                padding: 5px;

                            }
                        }
                        .action {
                            padding: 9px 20px;
                            display: flex;
                            justify-content: space-between;
                            .settingPrice, .modify, .delite {
                                height: 30px;
                                border: 1px solid #AAAAAA;
                                border-radius: 12px;
                                line-height: 30px;
                                text-align: center;
                                cursor: pointer;
                                .icon {
                                    i {
                                        font-size: 20px;
                                        color: #4D4D4D;
                                    }
                                }
                                .content {
                                    position: relative;
                                    top: -2px;
                                    left: 5px;
                                }
                            }
                            .settingPrice {
                                width: 45%;
                            }
                            .modify {
                                width: 18%;
                                .content {
                                    color: #414CDC;
                                }
                            }
                            .modify:hover {
                                background-color: #0B8CEF;
                                .content {
                                    color: #fff;
                                }
                                .icon i {
                                    color: #fff;
                                }
                            }
                            .delite {
                                width: 18%;
                                .content {
                                    color: #EE2626
                                }
                            }
                            .delite:hover {
                                background-color: #FA2323;
                                .content {
                                    color: #fff;
                                }
                                .icon i {
                                    color: #fff;
                                }
                            }
                        }
                        .roomTypeRow:nth-of-type(1) {
                            border-left: none;
                        }
                    }
                }
            }
        }
        .roomSort {
            width: 100%;
            margin-top: 25px;
            .roomTab {
                margin-bottom: 15px;
                font-size:16px;
                .item-tab {
                    padding: 7px 10px;
                    cursor: pointer;
                }
                .hint {
                    font-size: 14px;
                    margin-left: 40px;
                    vertical-align: sub;
                }
                .active {
                    font-size:17px;
                    font-weight: 800;
                    border-bottom: 2px solid #1F96FC;
                }
            }
        }
    }
</style>
