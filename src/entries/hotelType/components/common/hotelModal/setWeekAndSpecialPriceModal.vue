<template>
    <div class="settingPrice">
        <div class="close" @click="closeSetPriceModal"><i class="iconfont icon-guanbi-"></i></div>
        <div class="modalHeader">
            <div class="label"></div>
            <span class="modalName">周末/特殊价格设置</span>

            <Select v-model="roomType">
                <Option v-for="item in roomTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>
        <div class="modalBody">
            <Tabs value="name1" class="tabChange">
                <TabPane label="周末价格" name="name1" class="weekendPrice">
                    <set-weekend-price :thisOpenRoomTypeId="roomType" v-on:connetSpecia='connetSpecia' v-on:closeSetPriceModal='closeSetPriceModal'></set-weekend-price>
                </TabPane>
                <TabPane label="特殊价格" name="name2" class="speciaPrice">
                    <set-specia-price v-on:closeSetPrice='closeSetPrice' :speciaUpdate='speciaUpdate' :thisOpenRoomTypeId="roomType"></set-specia-price>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import setSpeciaPrice from '../setSpeciaPrice/setSpeciaPrice.vue'
    import setWeekendPrice from '../setWeekendPrice/setWeekendPrice.vue'
    import {creatRoomTypeAndRoomNumberName} from '../../../libs/util'

    export default {
        name: 'setWeekAndSpecialPriceModal',
        props: ['thisOpenValue', 'roomTypeId'], // 打开弹窗时的房间型号
        components: {
            setSpeciaPrice,
            setWeekendPrice
        },
        data() {
            return {
                roomTypeList: [],
                roomType: null,
                roomTypeAndRoomNumnerList: [],
                speciaUpdate: false
            }
        },
        computed: {
            hotelRoomTypeInfoList() {
                return this.$store.state.hotelStatus.hotelRoomTypeInfoList;
            }
        },
        created() {
            this.roomTypeAndRoomNumnerList = this.hotelRoomTypeInfoList;
            this.roomTypeList = creatRoomTypeAndRoomNumberName(this);

            for(let i = 0, len = this.roomTypeList.length; i < len; i++) {
                let value = this.roomTypeList[i]['value'];
                if(value === this.roomTypeId) {
                    this.roomType = value;
                }
            }
        },
        methods: {
            closeSetPriceModal() {
                return this.$emit('closeSetPriceModal', false)
            },
            closeSetPrice(day) {
                this.$emit('closeSetPrice', day)
            },
            connetSpecia() {
                this.speciaUpdate = !this.speciaUpdate;
            }
        },
        watch: {
            roomType(cur, old) {
                console.log('roomTypeId,', this.roomTypeId)
            }
        }
    }
</script>
<style scoped lang="scss">
    .settingPrice {
        width: 100%;
        height: 100%;
        position: relative;
        .close {
            width: 35px;
            height: 35px;
            background-color: rgba(0, 0, 0, 0.2);
            position: absolute;
            top: -20px;
            right: -35px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            i {
                font-size: 22px;
                color: #fff;
            }
        }
        .modalHeader {
            width: 94%;
            height: 35px;
            margin: 25px auto 0;
            display: flex;
            justify-content: flex-start;
            .label {
                width: 6px;
                height: 20px;
                background-color: #338EF3;
            }
            .modalName {
                font-size: 16px;
                color: #000;
                margin-left: 10px;
                line-height: 20px;
                font-weight: 500;
            }
            .ivu-select {
                width: 160px;
                position: absolute;
                right: 25px;
                top: 37px;
                z-index: 10;
                .ivu-select-selection {
                    border:1px solid rgba(170,170,170,1);
                    .ivu-icon-arrow-down-b:before {
                        content: "\f107";
                        color: red;
                    }
                }
            }
        }
        .modalBody {
            height: 300px;
            width: 100%;
            .speciaPrice, .weekendPrice {
                padding: 15px;
            }
        }
    }
</style>
