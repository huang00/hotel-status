<template>
    <div class="toolTipBoxModal" v-show="isShow">
        <!--<div class="header">-->
        <!--<p class="cont">消息提示</p>-->
        <!--</div>-->
        <div class="body">
            <p class="cont">{{bodyCont}}</p>
        </div>
        <div class="footer">
            <div class="confirmBtn" @click="thisConfirmIsTrue">确认</div>
            <div class="cancelBtn" @click="thisConfirmIsFalse">取消</div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {mapActions} from 'vuex'
    import {pageloadCheckNavigator, testResponseCode, getCookie} from 'common_libs/util.js'
    import {innRoomTypeApiServers} from '../../../api/API'

    export default {
        name: 'toolTipBoxModal',
        props: ['bodyCont'],
        data() {
            return {
                isShow: true
            }
        },
        computed: {
            hotelOrderChangeToolTipBox() {
                return this.$store.state.hotelStatus.hotelOrderChangeToolTipBox;
            },
            hotelAllOrdersInfoList() {
                return this.$store.state.hotelStatus.hotelOrderInfoList;
            },
            hotelRoomTypeInfoList() {
                return this.$store.state.hotelStatus.hotelRoomTypeInfoList;
            }
        },
        created() {},
        mounted() {
        },
        methods: {
            ...mapActions(['dispatchWhenChangeOrderAndUpIsTrue','dispatchGetHotelRoomTypeInfoList']),
            ...mapActions(['dispatchMouseUpShowThisOrderAllStatusIsFlase']),
            ...mapActions(['dispatchChangeThisOrderDownIsTrueStatus']),
            ...mapActions(['dispatchHotelOrderInfoListModify']),
            ...mapActions(['dispatchCheckIsCheckInOrderChange']),
            thisConfirmIsTrue() {
                /* type
                    1、添加 2、修改 3、删除
                */
                if (this.hotelOrderChangeToolTipBox.type === 3) {
                    this.del();
                }
            },
            del() {
                /* 删除房间类型 */
                let param = Object.assign({}, this.hotelOrderChangeToolTipBox.data);
                try {
                    innRoomTypeApiServers.delRoomType(param).then(result => {
                        if(result.code === '000000') {
                            this.getRoomTypeList();
                            return result;
                        } else {
                            alert(result.message);
                            this.thisConfirmIsFalse();
                        }
                    })
                } catch (err) {
                    return pageloadCheckNavigator(err)
                }
            },
            thisConfirmIsFalse() {
                this.dispatchWhenChangeOrderAndUpIsTrue({
                    isOpen: false
                });
            },
            getRoomTypeList() {
                this.dispatchGetHotelRoomTypeInfoList({'innId': getCookie('innId')});
                this.thisConfirmIsFalse();
            }
        }
    }
</script>
<style scoped lang="scss">
    .toolTipBoxModal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        width: 350px;
        padding-bottom: 12px;
        background: rgba(255, 255, 255, 1);
        border-radius: 12px;
        box-shadow: 9px 5px 16px rgba(184, 184, 184, 1);
        overflow: hidden;
        .header {
            width: 100%;
            height: 55px;
            background: rgba(11, 140, 239, 1);
            .cont {
                color: #fff;
                font-size: 16px;
                line-height: 55px;
                text-align: center;
                font-weight: 500;
            }
        }
        .body {
            width: 100%;
            padding: 0 45px;
            height: 110px;
            .cont {
                font-size: 20px;
                color: #000;
                text-align: center;
                line-height: 130px;
            }
        }
        .footer {
            width: 100%;
            padding: 0 40px;
            display: flex;
            justify-content: space-between;
            .confirmBtn, .cancelBtn {
                width: 115px;
                height: 35px;
                color: #fff;
                font-size: 16px;
                font-weight: 500;
                text-align: center;
                line-height: 35px;
                border-radius: 12px;
                cursor: pointer;
            }
            .confirmBtn {
                background: rgba(0, 168, 32, 1);
            }
            .cancelBtn {
                color: #646464;
                border: 1px solid #E2E2E2;
                background: rgba(255, 255, 255, 1);
            }
        }
    }
</style>
