<template>
    <div class="hotelStatusPageHead">
        <pms-head-left :tittel="'疯特民宿管家'" :innName="hotelName"></pms-head-left>
        <pms-head-right :isAction="isAction" :proptDis="noRegistFinane"></pms-head-right>
    </div>
</template>
<script>
    import {getCookie, deleteCookie} from 'common_libs/util';
    import {hotelLogApiServers} from '../../../api/API';
    import pmsHeadLeft from 'pms-head-left'
    import pmsHeadRight from 'pms-head-right'


    export default {
        name: 'hotelStatusPageHead',
        props: ['isCloseSearch'],
        components: {
            pmsHeadLeft,
            pmsHeadRight
        },
        data() {
            return {
                hotelName: '',
                noRegistFinane: [
                    {
                        isAction: 'wefintFinance',
                        proptDis: true,
                    },
                ],
                userMessage: true,
                serversMessage: false,
                isAction: false
            }
        },

        created() {
            let param = {innId: getCookie('innId')};
            hotelLogApiServers.getInnInfo(param).then(result => {
                this.hotelName = result.content.innName;
            });
            hotelLogApiServers.getQuestionAndAnswer(param).then(result => {
                result.content.submitted === 0 ? this.noRegistFinane[0].proptDis = true : this.noRegistFinane[0].proptDis = false;
            })
        },
        methods: {}
    }
</script>
<style lang="scss" src="../../../assets/iconfont/iconfont.css"></style>
<style scoped lang="scss">
    .hotelStatusPageHead {
        position: relative;
        width: 100%;
        height: 100%;
        color: rgba(255, 255, 255, 1);
        background: #0B8CEF;
        display: flex;
        justify-content: space-between;
        .headLeft {
            height: 100%;
            min-width: 390px;
            display: flex;
            padding: 10px 10px;
            justify-content: flex-start;
            .wefintLogo, .wefintHotelName {
                padding: 0 5px;
            }
            .wefintHotelName {
                text-align: left !important;
                padding: 0 20px;
            }
            .wefintLogo {
                width: 188px;
                border-right: 1px solid #fff;
                .logo {
                    width: 43px;
                    height: 38px;
                    margin: -6px auto;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .tittel {
                    font-size: 16px;
                    text-align: center;
                    margin-top: 5px;
                    font-weight: 500;
                }
            }
            .wefintHotelName {
                font-size: 16px;
                text-align: center;
                line-height: 55px;
                font-weight: 600;
            }
        }
        .preciseSearch {
            position: absolute;
            top: 22px;
            left: 350px;
        }
        .headRight {
            height: 100%;
            display: flex;
            justify-content: flex-start;
            .headRightLeftBar {
                height: 100%;
                .blueBgColor {
                    background-color: #0E61DD;
                }
                .leftBarUl {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    .leftBarLi:hover {
                        background-color: #0E61DD;
                    }
                    .leftBarLi {
                        width: 85px;
                        padding-top: 15px;
                        position: relative;
                        cursor: pointer;
                        .prot {
                            width: 10px;
                            height: 10px;
                            background: red;
                            position: absolute;
                            right: 15px;
                            top: 10px;
                            border-radius: 50%;
                        }
                        .leftBarImage {
                            width: 45px;
                            height: 35px;
                            text-align: center;
                            margin: 0 auto;
                            img {
                                width: 30px;
                                height: 22px;
                            }
                        }
                        .leftBarCont {
                            color: #fff;
                            font-size: 15px;
                            font-weight: 600;
                            text-align: center;
                            margin-top: -5px;
                        }
                    }
                }
            }
            .headRightRightBar {
                height: 50px;
                margin: 15px 5px;
                border-left: 1px solid #fff;
                .rightBarUl {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-around;
                    .rightBarLi {
                        position: relative;
                        width: 80px;
                        height: 50px;
                        text-align: center;
                        line-height: 65px;

                        .messageNotify {
                            position: absolute;
                            top: 5px;
                            right: 15px;
                            width: 10px;
                            height: 10px;
                            border-radius: 5px;
                            background-color: red;
                        }
                        img {
                            height: 25px;
                            width: 25px;
                        }
                    }
                    .userPortrait {
                        position: relative;
                        .out {
                            width: 75px;
                            height: 32px;
                            background: rgba(255, 255, 255, 1);
                            box-shadow: 1px 0px 4px rgba(203, 200, 200, 1);
                            color: #1E1E1E;
                            line-height: 32px;
                            top: 40px;
                            left: -30px;
                            position: absolute;
                            cursor: pointer;
                            display: none;
                        }
                    }
                    .userPortrait:hover {
                        .out {
                            display: block;
                        }
                    }
                    .setting {
                        position: relative;
                        .log {
                            background: white;
                            height: 32px;
                            line-height: 32px;
                            width: 81px;
                            font-size: 12px;
                            top: 45px;
                            position: absolute;
                            left: -7px;
                            color: black;
                            box-shadow: 2px 0px 4px rgba(212, 212, 212, 1);
                            cursor: pointer;
                            display: none;
                        }
                        .log i {
                            font-size: 17px;
                            margin-right: 4px;
                            vertical-align: text-bottom;
                        }
                    }
                    .setting:hover .log {
                        display: block;
                    }
                }
            }
        }
    }
</style>
