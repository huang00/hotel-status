<template>
    <div class="addRommType">
        <div class="close" @click="closeAddRoomModal"><i class="iconfont icon-guanbi-"></i></div>
        <div class="modalHead">{{thisOpenValue? '修改房型':'添加房型'}}</div>
        <div class="modalBody">
            <p><span class="required">*</span><span>房间类型：</span>
                <i-input style="width: 180px" v-model="roomTypeName" :maxlength="20"></i-input>
            </p>
            <p><span class="required">*</span><span>初始价格：</span>
                <i-input style="width: 180px" v-model="roomDefaultPrice"></i-input>
            </p>
            <div class="addRoomBtn">
                <span class="required">*</span><span>房间号：</span>
                <div class="roomList">
                    <div class="roomListRow" v-for="(item,value) in addRoomNumberList" :key="value">
                        <i-input style="width: 180px" v-model="item.roomNo"></i-input>
                        <Icon
                            v-if="value===0"
                            type="ios-add-circle-outline"
                            size="22"
                            style="font-weight: 600; cursor: pointer;"
                            color="#1987ED"
                            @click="addRoom"/>
                        <Icon
                            v-if="value!==0"
                            type="ios-remove-circle-outline"
                            size="22"
                            style="font-weight: 600; cursor: pointer;"
                            color="#FF0000"
                            @click="deliteThisRoom(value)" />
                    </div>
                </div>
            </div>
        </div>
        <div class="modalFoot">
            <div class="sureAddRoomBtn" @click="suerAddRoomTypeAndRoomNo">确认</div>
        </div>
    </div>
</template>
<script>
    import {clone as _clone, cloneDeep } from 'lodash'
    import {mapActions} from 'vuex'
    import {getCookie, compare} from 'common_libs/util.js'
    import {innRoomTypeApiServers, trimAll} from '../../../api/API'

    export default {
        name: 'addRoomType',
        props: ['thisOpenValue', 'roomTypeId'], // 修改或者删除时打开模态框的数据
        data() {
            return {
                roomTypeName: '',
                roomDefaultPrice: '',
                addRoomNumberList: [{roomNo: ''}],
                addList: [],
                updateList: [],
                deleteList: []
            }
        },
        computed: {
            hotelRoomTypeInfoList() {
                return this.$store.state.hotelStatus.hotelRoomTypeInfoList;
            }
        },
        created() {
            let value = this.thisOpenValue;
            if (value !== false) {
                this.addRoomNumberList = [];
                let nowRoomTypeObj = _clone(this.hotelRoomTypeInfoList[value]);
                this.roomTypeName = nowRoomTypeObj.roomTypeName;
                this.roomDefaultPrice = nowRoomTypeObj.defaultPrice;

                let roomList = cloneDeep(nowRoomTypeObj.roomList)
                for (let i = 0; i < roomList.length; i++) {
                    this.addRoomNumberList.push(roomList[i])
                }
                this.addRoomNumberList = this.addRoomNumberList.sort(compare('updateDate', false));
                this.addRoomNumberList.unshift({roomNo: ''})
            }
        },
        methods: {
            ...mapActions(['dispatchGetHotelRoomTypeInfoList']),
            addRoom() {
                this.addRoomNumberList.unshift({roomNo: ''});
            },
            deliteThisRoom(value) {
                let delItem = this.addRoomNumberList.splice(value, 1)[0];
                if(delItem.roomId) {
                    innRoomTypeApiServers.isRoomCanDelete({roomId: delItem.roomId}).then(result => {
                        if(result.content && result.code === '000000') {
                            /* 房间可以被删除 */
                            delItem.deleted = 1;
                            this.deleteList.push(delItem);
                        } else {
                            /* 房间不可以被删除 */
                            this.addRoomNumberList.splice(value, 0, delItem);
                            alert('房间有订单，无法删除！')
                        }
                    })
                }
                
                return false;
            },
            closeAddRoomModal() {
                this.addRoomNumberList = [];
                this.roomTypeName = '';
                this.roomDefaultPrice = '';
                this.$emit('closeAddRoomModal', false)
            },
            suerAddRoomTypeAndRoomNo() {
                if (this.roomTypeName !== '') {
                    if (this.roomDefaultPrice !== '') {
                        let publicParam = {
                            innId: getCookie('innId'),
                            uid: getCookie('userId'),
                            roomTypeName: this.roomTypeName,
                            defaultPrice: this.roomDefaultPrice,
                        };
                        let realList = this.filterEmpty(this.addRoomNumberList);
                        if (!realList.length) {
                            alert('房间号不能为空！')
                            return false;
                        }
                        if (publicParam.defaultPrice > 1000000) {
                            alert('数额不可超过1,000,000')
                            return false;
                        }
                        if (this.thisOpenValue !== false) {
                            /* 修改房间 */
                            let updateList = [], obj = {};
                            for(let i = 0, len = realList.length; i < len; i++) {
                                obj = {...realList[i], innId: getCookie('innId')};
                                updateList.push(obj);
                            }
                            updateList = updateList.concat(this.deleteList);
                            updateList.reverse();

                            this.upate({...publicParam, roomTypeId: this.roomTypeId, updateList});
                        } else {
                            /* 添加房间 */
                            this.add({...publicParam, addList: realList})
                        }
                    } else {
                        alert('默认价格不能为空！')
                    }
                } else {
                    alert('房间类型名称不能为空！')
                }
            },
            upate(params) {
                let param = Object.assign({}, params)
                param.defaultPrice = Number(param.defaultPrice) * 100
                innRoomTypeApiServers.updateRoomType(param).then(result => {
                    if (result.code === '000000') {
                        this.$Message.success({
                            duration: 1,
                            content: '修改成功！',
                        });
                        this.getRoomTypeList();
                        this.closeAddRoomModal();
                        
                    } else {
                        alert(result.message);
                    }
                })
            },
            add(params) {
                /* 添加房间 */
                let addList = [], 
                    wrapAddList = params.addList;
                for (let i = 0, len = wrapAddList.length; i < len; i++) {
                    let addListObj = {
                        'roomNo': wrapAddList[i].roomNo,
                        'innId': params.innId,
                        'roomSequence': i,
                    };
                    addList.push(addListObj)
                }
                addList.reverse();
                params.defaultPrice = Number(params.defaultPrice) * 100
                innRoomTypeApiServers.addRoomType({...params, addList}).then(result => {
                    if (result.code === '000000') {
                        this.$Message.success({
                            duration: 1,
                            content: '添加成功！',
                        });
                        this.$emit('closeSetPriceModal')
                        this.closeAddRoomModal();
                        this.getRoomTypeList();
                    } else {
                        alert(result.message);
                    }
                })
            },
            filterEmpty(arr) {
                /* 过滤掉空的房间 */
                if (!arr.length) {
                    return false;
                }
                let result = [];
                for (let i = 0, len = arr.length; i < len; i++) {
                    if(arr[i].roomNo.replace(/(^\s+|\s+$)/, '')) {
                        result.push(arr[i])
                    }
                }
                return result;
            },
            getRoomTypeList() {
                this.dispatchGetHotelRoomTypeInfoList({'innId': getCookie('innId')});
            }
        },
    }
</script>
<style scoped lang="scss">
    .addRommType {
        width: 100%;
        height: 100%;
        position: relative;
        .close {
            width: 35px;
            height: 35px;
            background-color: rgba(0, 0, 0, 0.2);
            position: absolute;
            top: 5px;
            right: -35px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            i {
                font-size: 22px;
                color: #fff;
            }
        }
        .modalHead {
            width: 100%;
            height: 58px;
            background-color: #CACACA;
            color: #000;
            font-size: 16px;
            font-weight: 500;
            line-height: 58px;
            padding-left: 25px;
            border-radius: 12px 12px 0 0;
        }
        .modalBody {
            max-height: 290px;
            padding: 15px 57px 0;
            overflow: auto;
            p {
                margin: 20px 0;
                /*padding: 0 35px;*/
                width: 255px;
                display: flex;
                justify-content: space-between;
                line-height: 30px;
                position: relative;
            }
            .addRoomBtn {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                padding: 0 0 15px 0;
                .roomList {
                    margin-left: 17px;
                    .roomListRow:nth-of-type(1) {
                        margin-top: 0;
                    }
                    .roomListRow {
                        margin-top: 15px;
                        .addThis, .deliteThis {
                            color: #1987ED;
                            border: 1px solid #1987ED;
                            width: 18px;
                            height: 18px;
                            line-height: 0;
                            margin-left: 5px;
                        }
                        .deliteThis {
                            color: #FF0000;
                            border: 1px solid #FF0000;
                        }
                    }
                }
            }
            .newRoom {
                padding-left: 64px;
                .deliteThis {
                    position: absolute;
                    right: -25px;
                    top: 8px;
                    color: #FF0000;
                    border: 1px solid #FF0000;
                    line-height: 18px;
                    width: 18px;
                    height: 18px;
                }
            }
            .required {
                color:  #FF0000;
                padding-right: 3px;
            }
        }
        .modalFoot {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-around;
            .sureAddRoomBtn {
                width: 120px;
                height: 40px;
                background: rgba(7, 185, 91, 1);
                border-radius: 12px;
                line-height: 40px;
                text-align: center;
                color: #fff;
                cursor: pointer;
            }
        }
    }
</style>
