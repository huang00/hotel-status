<template>
    <div class="setWeekendPrice">
        <div class="setWeekPriceHead">
            <p class="headName">设置周末价格</p>
            <p class="tagging">注：每一天都可以单独设置金额或修改</p>
            <div class="weekList">
                <div class="weekOne" v-for="(item, index) in weekList" :key="index">
                    <p class="week">{{item.name}}</p>
                    <p class="price">
                        <i-input v-model="item.price" class="leftFivePx" style="width: 80px"></i-input>
                    </p>
                </div>
            </div>
            <div class="sureBtn">
                <div class="btn" @click="sureUpdataWeekPrice">确认</div>
            </div>
        </div>
    </div>
</template>
<script>
    import {forEach as _forEach} from 'lodash'
    import {pageloadCheckNavigator, testResponseCode, getCookie, toDecimal2} from 'common_libs/util.js'
    import {innRoomTypeApiServers} from '../../../api/API'

    export default {
        name: 'setWeekendPrice',
        props: ['thisOpenRoomTypeId'], // 打开弹窗时的房间型号
        data() {
            return {
                weekList: [
                    {
                        name: '周一',
                        price: '',
                        zEnName: 'mondayPrice'
                    },
                    {
                        name: '周二',
                        price: '',
                        zEnName: 'tuesdayPrice'
                    },
                    {
                        name: '周三',
                        price: '',
                        zEnName: 'wednesdayPrice'
                    },
                    {
                        name: '周四',
                        price: '',
                        zEnName: 'thursdayPrice'
                    },
                    {
                        name: '周五',
                        price: '',
                        zEnName: 'fridayPrice'
                    },
                    {
                        name: '周六',
                        price: '',
                        zEnName: 'saturdayPrice'
                    },
                    {
                        name: '周日',
                        price: '',
                        zEnName: 'sundayPrice'
                    },
                ],
                dataList: [], //数据列表
                cache: {
                    roomType: {}
                }
            }
        },
        computed: {},
        created() {
            this.getRoomTypeWeekendPrice(this.thisOpenRoomTypeId);
        },
        methods: {
            getRoomTypeWeekendPrice(roomTypeId) {
                if(!this.cache.roomType[roomTypeId]) {
                    const param = {
                        roomTypeId
                    };
                    try {
                        return innRoomTypeApiServers.getRoomTypeToWeekendPrice(param).then(result => {
                            if(result.code === '000000') {
                                this.dataList = result.content;
                                for (let i = 0; i < this.weekList.length; i++) {
                                    let week = this.weekList[i].zEnName
                                    this.dataList[week] && (this.dataList[week] = toDecimal2(this.dataList[week] / 100))
                                    
                                }
                                this.cache.roomType[roomTypeId] = result.content;
                                this.showWeekendPriceAndView(result.content)
                            } else {
                                alert(result.message)
                            }
                        })
                    } catch (err) {
                        return pageloadCheckNavigator(err)
                    }
                } else {
                    this.dataList = this.cache.roomType[roomTypeId];
                    this.showWeekendPriceAndView(this.dataList)
                }
            },
            showWeekendPriceAndView(resultContent) {
                const that = this;
                for (let i = 0; i < this.weekList.length; i++) {
                    _forEach(resultContent, function(value, key) {
                        if (that.weekList[i].zEnName === key) {
                            that.weekList[i].price = value;
                        }
                    })
                }
            },
            sureUpdataWeekPrice() {
                const param = {
                    roomTypeId: this.thisOpenRoomTypeId,
                    uid: getCookie('userId'),
                    innId: getCookie('innId'),
                    createUser: getCookie('userId'),
                    priceId: this.dataList.priceId || null
                };
                for (let i = 0; i < this.weekList.length; i++) {
                    let computedPrice = Number(this.weekList[i].price) * 100 ? Number(this.weekList[i].price) * 100 : null;
                    param[this.weekList[i].zEnName] = computedPrice
                    if (computedPrice > 100000000) {
                        alert('数额不可超过1,000,000')
                        return false;
                    }
                }
                this.dataList.priceId ? (this.addOrUpdate(param, false)) : (this.addOrUpdate(param, true));
            },
            addOrUpdate(param, boo) {
                /* boo 为true是添加 */
                let request = boo ? 'addWeekPrice': 'updateWeekPrice';
                innRoomTypeApiServers[request](param).then(result => {
                    if(result.code === '000000') {
                        this.$Message.success({
                            duration: 1.5,
                            content: '设置成功！',
                        });
                        this.$emit('closeSetPriceModal')
                        this.connectSpeciaPrice();
                    } else {
                        alert(result.message)
                    }
                })
            },
            connectSpeciaPrice() {
                /* 可以通过此函数直接操作到setSpeciaPrice组件 */
                this.$emit('connetSpecia')
            }
        },
        watch: {
            thisOpenRoomTypeId(curr) {
                this.getRoomTypeWeekendPrice(curr);
            }
        }
    }
</script>
<style scoped lang="scss">
    .setWeekendPrice {
        width: 100%;
        position: relative;
        color: black;
        font-size: 15px;
        .setWeekPriceHead {
            width: 100%;
            .headName, .tagging {
                text-align: center;
                font-size: 14px;
                color: #020202;
            }
            .headName {
                font-weight: 500;
            }
            .tagging {
                padding: 10px 0 15px 0;
            }
        }
        .weekList {
            width: 97%;
            height: 160px;
            margin: 0 auto;
            border: 1px dashed #aaa;
            display: flex;
            justify-content: flex-start;
            .weekOne {
                width: 14.3%;
                height: 100%;
                text-align: center;
                padding: 50px 10px;
                padding-bottom: 10px;
                .price {
                    margin-top: 15px;
                }
            }
        }
        .sureBtn {
            width: 100%;
            .btn {
                width: 120px;
                height: 40px;
                margin: 115px auto 0;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
                text-align: center;
                line-height: 40px;
                background: rgba(7, 185, 91, 1);
                border-radius: 12px;
            }
        }
    }
</style>
