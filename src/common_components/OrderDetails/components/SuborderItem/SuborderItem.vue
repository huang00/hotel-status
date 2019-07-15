<template>
    <div class="suborder-item padding-l-r-10">
        <!-- 编辑 -->
        <div class="edit" key="100" v-if="edit">
            <div style="margin-bottom: 20px;"
                v-for="(item, index) in data.suborders" :key="index">
                <div class="edit-container" :style="editContainerStyle">
                    <div
                        class="checkbox"
                        v-if="(!hideCheckbox && orderOprType !== 'check-in') || (orderOprType === 'check-in' && !item.fixedNotCheck)"
                        @click="switchChecked(item)"
                    >
                        <Icon type="md-checkmark-circle" size="18" color="#286094" v-if="item.checked"/>
                        <Icon type="md-radio-button-off" size="18" color="#286094" v-else/>
                    </div>
                    <div class="suborder-info flex">
                        <div class="room-type flex-item">
                            <span
                                :class="{
                                    'order-status': true,
                                    'predetermine': item.status === 0,
                                    'check-in': item.status === 1,
                                    'unsubscribe': item.status === 2
                                }"
                                style="margin-left: 3px;"
                            >
                                {{ item.status === 0?'预':item.status === 1? '住':'退' }}
                            </span>
                            <Select
                                style="width:197px;
                                margin-left: 5px;"
                                @on-change="onChangeRoom(item)"
                                :disabled="
                                    !item.checked && orderOprType === 'check-in'
                                "
                                v-model="item.roomId">
                                <Option
                                    v-for="item in roomList" :key="item.id"
                                    :value="item.roomId">
                                    {{item.roomTypeName}}&nbsp;&nbsp;{{ item.roomNo }}
                                </Option>
                            </Select>
                            <span class="wraning" style="left: 31px;" v-if="item.roomIdErrMsg">
                                <span style="font-size: 14px;">
                                    <Icon type="md-alert" />
                                    {{ item.roomIdErrMsg }}
                                </span>
                            </span>
                        </div>
                        <div class="check-in flex-item">
                            <DatePicker
                                :disabled="
                                    orderOprType === 'check-in' ||
                                    (item.status === 2 && !!item.id) ||
                                    item.status === 1 ||
                                    !!data.otaOrderNo
                                "
                                :options="checkInDateOptions"
                                type="date"
                                :clearable="false"
                                :editable="false"
                                placeholder="选择入住时间"
                                v-model="item.checkInDateView"
                                @on-change="handlerNights(item)"
                                style="width: 143px">
                            </DatePicker>
                            <Select
                                @on-change="handlerNights(item)"
                                v-model="item.nights"
                                :disabled="
                                    (!item.checked && orderOprType === 'check-in') ||
                                    (item.status === 2 && !!item.id) ||
                                    !!data.otaOrderNo
                                "
                                style="width:74px; margin-left: 10px;">
                                <Option
                                    v-if="item.isHourRoom === 1"
                                    :value="0"> 0 晚</Option>
                                <Option
                                    v-for="item in 60" :key="item"
                                    :value="item"> {{item}} 晚</Option>
                            </Select>
                        </div>
                        <div class="total-money flex-item">
                            <Input
                                prefix="logo-yen"
                                type="text"
                                placeholder="金额"
                                style="width: 104px;"
                                @on-keyup="validateSuborderAmount(item)"
                                @on-blur="moneyToDecimal2(item, 'suborderAmountView', onBlurSuborderAmount)"
                                :disabled="
                                    (!item.checked && orderOprType === 'check-in') ||
                                    !!data.otaOrderNo
                                "
                                v-model="item.suborderAmountView"
                                class="total-money-input" />
                            <span class="wraning" style="left: 0;" v-if="item.suborderAmountViewErrMsg">
                                <span style="font-size: 14px;">
                                    <Icon type="md-alert" />
                                    {{ item.suborderAmountViewErrMsg }}
                                </span>
                            </span>
                            <template v-if="orderOprType !== 'check-in' && !data.otaOrderNo">
                                <Icon
                                    type="md-remove-circle"
                                    style="cursor: pointer; margin-right: 5px;"
                                    size="25"
                                    color="#D67777"
                                    v-if="
                                        data.suborders.length >= 2 && 
                                        (
                                            !data.otaOrderNo ||
                                            (
                                                data.otaOrderNo &&
                                                item.status === 0
                                            )
                                        )
                                    "
                                    @click="removeRoom(index, item)"/>
                                <Icon
                                    type="md-add-circle"
                                    style="cursor: pointer;"
                                    size="25"
                                    color="#286094"
                                    v-if="index === 0"
                                    @click="addRoom"/>
                            </template>
                        </div>
                    </div>
                    <div
                        class="suborder-client-wrapper"
                        v-for="(subItem, subIndex) in item.clients" :key="subIndex">
                        <div class="suborder-client flex">
                            <div class="user-name flex-item" style="position: relative;">
                                <i class="iconfont user-name-icon">&#xe720;</i>
                                <Input
                                    :maxlength="inputMaxLen"
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    v-model.trim="subItem.name"
                                    @on-keyup="filterExpression(subItem, 'name')"
                                    @on-focus="nameFocuse(subIndex, subItem,'name', 'first', index)"
                                    @on-blur="myBlur(subIndex),filterExpression(subItem, 'name')"
                                    @on-change="onChangeContactName(subItem.name, subIndex, index)"
                                    style="width: 145px; margin-left: 33px;"
                                    placeholder="入住人姓名"></Input>
                                <div @click='inputIt(subIndex, subItem, index)' 
                                  v-show="!(!item.checked && orderOprType === 'check-in') && nameInput && subIndex == inputBtn1 && clientIndexFlag == 'clientIndex' + index " 
                                  class='inputBtn' style="width: 145px;left: 33px;">填入联系人</div>    
                                <!-- <ul  v-show="!(!item.checked && orderOprType === 'check-in')  && showName && subIndex == inputBtn1 && clientIndexFlag == 'clientIndex' + index" class='sug-ul' style=" top: 39px;left: 31px;"> -->
                                <ul  v-show="!(!item.checked && orderOprType === 'check-in')  && showName && subIndex == inputBtn1 && clientIndexFlag == 'clientIndex' + index" class='sug-ul' style=" top: 39px;left: 33px;">
                                  <li class='sug-li'  v-for=' (n,myIndex) in nameList' @click='chooseName(n, index, subIndex)' :key='myIndex'>
                                    <div style="line-height: 22px;" class='clearfix'>
                                      <div v-html="brightenKeyword(n.name, subItem.name)" class='t-over'  style='float: left; width: 108px; text-align: left;'></div>
                                      <div  class='t-over' style='float: right; text-align: right; width: 120px; '>{{n.telephoneNum}}</div>
                                    </div>
                                    <div class='clearfix' style="line-height: 22px;">
                                      <span style='float:left;display:inline-block;text-align:left;'>历史入住{{n.checkInNum}}次，总房费</span>
                                      <span style="float:left;display:inline-block;text-align:right;color:#D67777">￥{{n.roomAmount}}</span></div>
                                  </li>
                                </ul>
                            </div>
                            <div class="id-card flex-item">
                                <Select
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    placeholder="证件"
                                    v-model="subItem.identityType"
                                    @on-change="validateIdCard(subItem)"
                                    style="width: 77px;">
                                    <Option
                                        v-for="sunItem in certificatesType" :key="sunItem.value"
                                        :label="sunItem.name"
                                        :value="sunItem.value" />
                                </Select>
                                <Input
                                    style="width: 150px;"
                                    :maxlength="inputMaxLen"
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    placeholder="证件号码"
                                    @on-blur="validateIdCard(subItem)"
                                    v-model="subItem.identityNo">
                                </Input>
                                <span class="wraning" style="width: 200px; left: 80px; bottom: 21px; height: 0;" v-if="subItem.identityNoErrMsg">
                                    <span style="font-size: 14px;">
                                        <Icon type="md-alert" />
                                        {{ subItem.identityNoErrMsg }}
                                    </span>
                                </span>
                            </div>
                            <div class="user-phone flex-item" style="position: relative;">
                                <Input
                                    style="width: 104px;"
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    @on-keyup="validatePhoneNumber(subItem, 'phone')"
                                    @on-focus="nameFocuse(subIndex, subItem,'phone', 'second', index)"
                                    @on-blur="myBlur(subIndex),validatePhoneNumber(subItem, 'phone')"
                                    @on-change="onChangeContactPhone(subItem.phone, subIndex)"
                                    placeholder="电话号码"
                                    v-model.trim="subItem.phone"
                                    :maxlength="16"></Input>
                                   
                                <div @click='inputIt(subIndex, subItem, index)' v-show="!(!item.checked && orderOprType === 'check-in') && phoneInput && subIndex == inputBtn2 && clientIndexFlag == 'clientIndex' + index "class='inputBtn' style="width: 104px">填入联系人</div>    
                                <ul  v-show="!(!item.checked && orderOprType === 'check-in') && showPhone && subIndex == inputBtn2 && clientIndexFlag == 'clientIndex' + index" class='sug-ul' style=" top: 39px;left: 0;">
                                  <li  class='sug-li'  v-for=' (n,myIndex) in nameList' @click='chooseName(n,index, subIndex)' :key='myIndex'>
                                    <div style="line-height: 22px;" class='clearfix'>
                                      <div v-html="phoneKeyword(n.telephoneNum, subItem.phone)"  class='t-over'  style='float: left; width: 120px;text-align: left '></div>
                                      <div class='t-over'  style='float: right;  width: 108px; text-align: right; width: 108px'>{{n.name}}</div>
                                    </div>
                                    <div class='clearfix' style="line-height: 22px;">
                                      <span style='float:left;display:inline-block;text-align:left;'>历史入住{{n.checkInNum}}次，总房费</span>
                                      <span style="float:left;display:inline-block;text-align:right;color:#D67777">￥{{n.roomAmount}}</span></div>
                                  </li>
                                </ul>
                            </div>
                            <div
                                class="client-more"
                                v-if="(orderOprType === 'check-in' && item.checked)
                                    || orderOprType !== 'check-in'"
                            >
                                <span
                                    class="opr-client remove-client"
                                    v-if="item.clients.length >= 2"
                                    @click="removeClient(item, subIndex)"></span>
                                <span
                                    class="opr-client add-client"
                                    v-if=" subIndex === 0"
                                    @click="addClient(item)"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看 -->
        <div class="look" key="200" v-else>
            <div style="margin-bottom: 10px;"
                v-for="(item, index) in data.suborders" :key="index">
                <div class="look-container" :style="editContainerStyle">
                    <div class="checkbox" @click="switchChecked(item)" v-if="!hideCheckbox && !item.fixedNotCheck">
                        <Icon type="md-checkmark-circle" size="18" color="#286094" v-if="item.checked"/>
                        <Icon type="md-radio-button-off" size="18" color="#286094" v-else/>
                    </div>
                    <div class="suborder-info flex">
                        <div class="room-type flex-item">
                            <span
                                :class="{
                                    'order-status': true,
                                    'predetermine': item.status === 0,
                                    'check-in': item.status === 1,
                                    'unsubscribe': item.status === 2
                                }"
                                style="margin-left: 3px;"
                            >
                                {{ item.status === 0?'预':item.status === 1? '住':'退' }}
                            </span>
                            <span class="room-name">
                                <span class="room-type-name text-break-1" :title="roomFindById(item.roomId)[0].roomTypeName">
                                    {{ roomFindById(item.roomId)[0].roomTypeName }}
                                </span>
                                &nbsp;
                                <span class="room-no-name text-break-1" :title="roomFindById(item.roomId)[0].roomNo">
                                    {{ roomFindById(item.roomId)[0].roomNo }}
                                </span>
                            </span>
                        </div>
                        <div class="check-in flex-item">
                            {{formatDate(item.checkInDateView)}} — {{formatDate(item.checkOutDateView)}}
                            （{{ item.nights }}晚）
                        </div>
                        <div class="total-money flex-item">
                            ¥ {{toDecimal2(item.suborderAmountView)}}
                        </div>
                    </div>
                        <div
                            class="suborder-client-wrapper"
                            :ref="'suborderClientWrapper'+index"
                            style="height: 43px;"
                            v-if="item.clients.length"
                        >
                            <div class="suborder-client flex"
                                v-for="(subItem, subIndex) in item.clients"
                                :key="subIndex">
                                <div class="user-name flex-item">
                                    <i class="iconfont user-name-icon">&#xe720;</i>
                                    <span style="padding-left: 60px;">{{subItem.name}}</span>
                                </div>
                                <div class="id-card flex-item">
                                    <!-- <i class="iconfont id-card-icon">&#xe654;</i> -->
                                    <span :class="['id-card-icon', 'id-card-icon-'+subItem.identityType]"></span>
                                    <span style="padding-left: 15px;">{{subItem.identityNo}}</span>
                                </div>
                                <div class="user-phone flex-item">
                                    <Icon type="ios-call-outline" size="22" color="#9AA7C1" />
                                    {{subItem.phone}}
                                </div>
                                <div class="client-more" v-if="subIndex === 0 && item.clients.length >= 2">
                                    <span class="client-mun">{{item.clients.length}}</span>
                                    <Icon
                                        type="ios-arrow-down"
                                        class="client-mun-icon"
                                        size="25"
                                        color="#1F5A8E"
                                        @click="showMore(item.clients.length, index)"/>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        computedNights,
        formatDate,
        deepCopy,
        changeMoney,
        TODAY,
        toDecimal2,
        validateRoomRepeat,
        accurateComputed,
        validateRule,
    } from 'common_libs/util'
    import NP from 'number-precision'
    import Base from '../Mixins/base'
    import {
        hotelStatusApiSercers
    } from '../../../../entries/hotelStatus/api/API.js'

    export default {
        name: 'SuborderItem',
        mixins: [Base],
        props: {
            edit: {
                type: Boolean,
                default: true
            },
            data: {
                type: Object,
                default () {
                    return {}
                }
            },
            hideCheckbox: {
                type: Boolean,
                default: true
            },
            orderOprType: { // 订单操作类型（入住办理、编辑订单）
                type: String,
                default: ''
            }
        },
        data () {
            const _this = this
            return {
                showName: false,
                showPhone: false,
                showNameFlag: false,
                nameList: [],
                computedNights,
                formatDate,
                newSubordersItem: {
                    id: null,
                    checkInDateView: new Date(),
                    checkOutDateView: +new Date() + 24 * 3600000,
                    nights: 1,
                    roomId: null,
                    roomIdErrMsg: '',
                    suborderAmountViewErrMsg: '',
                    suborderAmountView: '',
                    status: 0,
                    details: [],
                    clients: []
                },
                newClientItem: {
                    id: null,
                    name: null,
                    phone: '',
                    identityType: 0,
                    identityNo: '',
                    identityNoErrMsg: ''
                },
                certificatesType: [ // 证件类型
                    {
                        value: 0,
                        name: '身份证'
                    }, {
                        value: 1,
                        name: '护照'
                    }, {
                        value: 2,
                        name: '军官证'
                    }, {
                        value: 3,
                        name: '其他'
                    }
                ],
                checkInDateOptions: {
                    disabledDate (date) {
                        let startDate = new Date(deepCopy(_this.dateList[0]).strDate)
                        let endDate = new Date(deepCopy(_this.dateList[_this.dateList.length - 1]).strDate)
                        startDate.setMonth(startDate.getMonth() - 1)
                        // endDate.setMonth(endDate.getMonth() + 2)
                        return date.valueOf() <= startDate.valueOf() - 24 * 3600000 || date.valueOf() >= endDate.valueOf()
                    }
                },
                changedRoomIds: [], // 房间id已经改变的订单集合
                changedCheckInDateIds: [],  // 入住时间id已经改变的订单集合
                contactPerson: false, // 是否有联系人
                contactMobilePhone: false, // 是否有联系电话
                inputBtn1: '-1', //是否显示快速导入联系人 判断是哪一个input
                inputBtn2: '-1', //是否显示快速导入电话 判断是哪一个input
                nameInput: false,
                phoneInput: false,
                tempCacheName: {},
                tempCachePhone: {},
                clientIndexFlag: 'clientIndex',
                identityNo: null,
                identityType: null
            }
        },
        computed: {
            dateList () {
                return this.$store.getters.dateList
            },
            roomList () {
                return this.$store.getters.roomList
            },
            realpriceList () {
                return this.$store.getters.realpriceList
            },
            editContainerStyle () {
                let paddingLeft = this.hideCheckbox ? 0 : 25
                return {
                    paddingLeft: paddingLeft + 'px'
                }
            }
        },
        watch: {
          data: {
            handler(val, oldVal) {
              // 监听是否有联系人 和联系电话 oldVal.contactName oldVal.contactPhone
              if (!val.contactName) {
                this.contactPerson = false
              } else {
                this.contactPerson = true
              }
              if (!val.contactPhone) {
                this.contactMobilePhone = false
              } else {
                this.contactMobilePhone = true
              }
            },
            deep: true
          }
        },
        created() {
            // 是否显示 快速导入按钮
            if (!this.data.contactName) {
              this.contactPerson = false
            } else {
              this.contactPerson = true
            }
            if (!this.data.contactPhone) {
              this.contactMobilePhone = false
            } else {
              this.contactMobilePhone = true
            }

            if (this.$root.Bus) {
                this.$root.Bus.$on('on-order-form-validate', (errObj) => {
                    let subordersErrMsg = errObj.suborders
                    if (subordersErrMsg) {
                        this.data.suborders.map((item, index) => {
                            for (let i = 0, len = subordersErrMsg.length; i < len; i++) {
                                let subItem = subordersErrMsg[i]
                                let clientsErrMsgList = subordersErrMsg[i].clients
                                if (subItem.index === index) {
                                    for (let key in subItem) {
                                        subItem[key] && 
                                            (item[key+'ErrMsg'] = subItem[key].errMsg)
                                    }
                                    if (clientsErrMsgList) {
                                        clientsErrMsgList.map((clientsErrItem, clientsIndex) => {
                                            for (let k = 0, kLen = item.clients.length; k < kLen; k++) {
                                                if (k === clientsErrItem.index)
                                                    item.clients[k].identityNoErrMsg = clientsErrItem.identityNo.errMsg
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                })
            }
            this.data.suborders.map(item => {
                let checkInDate = +new Date(formatDate(item.checkInDateView))
                if (this.orderOprType === 'check-in') {
                    let checkOutDate = +new Date(item.checkOutDateView)
                    let today = +new Date(formatDate(TODAY))
                    if (
                        checkInDate <= today &&
                        item.status === 0
                    ) {
                        item.checked = true // 是否选中该房间
                    }
                    if (
                        today < checkInDate ||
                        item.status === 1 ||
                        item.status === 2
                    ) {
                        item.fixedNotCheck = true  // 固定不能选择
                    }
                } else if (this.orderOprType === 'check-out') {
                    item.checked = item.status === 1 // 是否选中该房间
                    item.fixedNotCheck = item.status !== 1 // 固定不能选择
                } else if (this.orderOprType === 'update') {
                    if (item.status === 1 && !item.clients.length)
                        item.clients.push(Object.assign({}, this.newClientItem))
                }
            })
        },
        methods: {
          // 获取匹配的联系人
          getMatchName (obj) {
            hotelStatusApiSercers.getMatchNameResult(obj).then(res => {
                if (res.code === '000000' && res.content) {
                  if (res.content.length) {
                    for (let i = 0; i < res.content.length; i++) {
                      res.content[i].roomAmount = changeMoney(res.content[i].roomAmount) || '0.00'
                      res.content[i].checkInNum = res.content[i].checkInNum || '0'
                    }
                    this.nameList = res.content
                    this.tempCacheName[obj.name] = res.content
                    this.showName = true
                  } else {
                    this.nameList = []
                    this.showName = false
                  }
                } else {
                  this.nameList = []
                  this.showName = false
                }
            })
          },
          getMatchPhone (obj, flag) {
            hotelStatusApiSercers.getMatchPhoneResult(obj).then(res => {
                if (res.code === '000000' && res.content) {
                  if (res.content.length) {
                    if(flag) {
                      this.identityNo =  res.content[0].identityNo
                      this.identityType = res.content[0].identityType
                    } else {
                      for (let i = 0; i < res.content.length; i++) {
                        res.content[i].roomAmount = changeMoney(res.content[i].roomAmount) || '0.00'
                        res.content[i].checkInNum = res.content[i].checkInNum || '0'
                      }
                      this.nameList = res.content 
                      this.tempCachePhone[obj.phone] = res.content
                      this.showPhone = true
                    }
                    
                  } else {
                    this.nameList = []
                    this.showPhone = false
                    this.identityNo =  null
                    this.identityType = null
                  }
                } else {
                  this.nameList = []
                  this.showPhone = false
                }
            })
          },
          myBlur(subIndex) {
            // console.log(subIndex, this.inputBtn1, this.nameInput)
            setTimeout(() => {
              this.showName = false
              this.showPhone = false
              this.nameInput = false
              this.phoneInput = false
            }, 200)
          },
          handleEndName (obj) {
            if (JSON.stringify(this.tempCacheName) == "{}") { // 初始化为空的时候
              this.getMatchName(obj)
            } else {
                if (this.tempCacheName[obj.name] == undefined) { // 不存在 发送请求
                  this.tempCacheName[obj.name] = []  // 添加属性
                  this.getMatchName(obj)
                } else {
                    this.nameList = this.tempCacheName[obj.name]
                    if (this.nameList.length) {
                      this.showName = true
                    } else {
                      this.showName = false
                    }
                }
            }
          },
          onChangeContactName(val, subIndex, index) {
            // this.clientIndexFunc(index)
            let obj = {
              name: val, 
            }
            this.inputBtn1 = subIndex
            if (val.length) {
              this.nameInput = false
              if (validateRule.nation.test(val)) {
                this.handleEndName(obj)
              } else {
                if (val.length > 1) {
                  this.handleEndName(obj)
                }
                
              }
            } else {
              this.showName = false
              if (this.$props.data.contactName && this.$props.data.contactPhone) {
                this.nameInput = true
              } else {
                this.nameInput = false
              }
              
            }
          },
          onChangeContactPhone(val, subIndex) {
           
            let obj = {
              phone: val, 
            }
            if (val.length) {
              this.phoneInput = false
              this.inputBtn2 = '-1'
              if (val.length > 3) { 
                 this.inputBtn2 = subIndex
                //检索 有匹 配值时 显示
                if (JSON.stringify(this.tempCachePhone) == "{}") { // 初始化为空的时候
                  this.getMatchPhone(obj)
                } else {
                  if (this.tempCachePhone[val] == undefined) { // 不存在 发送请求
                    this.tempCachePhone[val] = []  // 添加属性
                    this.getMatchPhone(obj)
                  } else {
                    this.nameList = this.tempCachePhone[val]
                    if (this.nameList.length) {
                      this.showPhone = true
                    } else {
                      this.showPhone = false
                    }
                    
                  } 
                }
              } else {
                this.showPhone = false
              }   
            } else {
               this.inputBtn2 = subIndex
               if (this.$props.data.contactName && this.$props.data.contactPhone) {
                this.phoneInput = true
              } else {
                this.phoneInput = false
              }
            }
           
          },
          clientIndexFunc(index) {
            this.clientIndexFlag = 'clientIndex' + index
          },
          // 联系人姓名匹配
          brightenKeyword(val, keyword) {
            // console.log(165, val, keyword)
            val = val + '';
            if (val.indexOf(keyword) !== -1 && keyword !== '') {
              return val.replace(keyword, '<font color="#2E598C">' + keyword + '</font>')
            } else {
              return val 
              }
          },
          //匹配到结果后快速导入
          chooseName(name, suborderIndex, clientIndex) { 
            this.$props.data.suborders[suborderIndex].clients[clientIndex].name = name.name
            this.$props.data.suborders[suborderIndex].clients[clientIndex].phone = name.telephoneNum
            this.$props.data.suborders[suborderIndex].clients[clientIndex].identityType = name.identityType
            this.$props.data.suborders[suborderIndex].clients[clientIndex].identityNo = name.identityNo
            this.showName = false 
            this.showPhone = false 
            this.inputBtn1 = '-1'
            this.inputBtn2 = '-1'
          },
          // 号码匹配
          phoneKeyword(val, keyword) {
            val = val + '';
            if (val.indexOf(keyword) !== -1 && keyword !== '') {
              return val.replace(keyword, '<font color="#2E598C">' + keyword + '</font>')
            } else {
              return val 
              }
          },
            nameFocuse(subIndex, subItem, name, sort, index) {
              // 有多个clients，需要正确定位到对应index输入框
              this.clientIndexFunc(index)
              //根据电话号码读取身份信息
              let obj = {
                phone: this.$props.data.contactPhone
              }
              this.getMatchPhone(obj, true)
              // 这里的定时器为了保持发生在失焦之后
              setTimeout(() => {
                if (this.contactPerson && this.contactMobilePhone) {
                  if (sort == 'first') {
                    if (!subItem.name) {
                      this.inputBtn1 = subIndex
                      this.nameInput = true
                      this.phoneInput = false
                      
                    }
                  }
                  if (sort == 'second') {
                    if (!subItem.phone) {
                      this.inputBtn2 = subIndex
                      this.phoneInput = true
                      this.nameInput = false
                    }
                  }
                } else {
                  this.inputBtn1 = '-1'
                  this.inputBtn2 = '-1'
                }
              }, 200)
              
            },
             // 导入
            inputIt(subIndex, subItem, index) {
              this.inputBtn1 = '-1'
              this.inputBtn2 = '-1'
              for (let c = 0, len0 = this.$props.data.suborders; c < len0.length; c++ ) {
                if (c == index) {
                  for (let i = 0; i < this.$props.data.suborders[c].clients.length; i++) {
                    if(i == subIndex) {
                      this.$props.data.suborders[c].clients[i].name = this.$props.data.contactName
                      this.$props.data.suborders[c].clients[i].phone = this.$props.data.contactPhone
                      this.$props.data.suborders[c].clients[i].identityType = this.identityType
                      this.$props.data.suborders[c].clients[i].identityNo = this.identityNo
                    }
                  }
                }
              }
            },
            roomFindById (roomId) {
              return this.roomList.filter(item => item.roomId === roomId)
            },
            showMore (clientsLen, index) {
                const ref = 'suborderClientWrapper' + index
                const suborderClientWrapperEl = this.$refs[ref][0]
                let height = suborderClientWrapperEl.style.height.slice(0, -2)
                if (height == 43) {
                    this.$refs[ref][0].style.height = clientsLen * 43 + 'px'
                    suborderClientWrapperEl.className = 'suborder-client-wrapper open'
                } else {
                    this.$refs[ref][0].style.height = '43px'
                    suborderClientWrapperEl.className = 'suborder-client-wrapper'
                }
            },
            onBlurSuborderAmount (item) {
                let detailsLen = item.details.length
                let suborderAmountView = 0
                item.details.map(item => {
                    suborderAmountView += item.roomPrice
                })
                let Dvalue = item.suborderAmountView * 100 - suborderAmountView
                let remainder = toDecimal2(Dvalue % detailsLen) - 0 // 余数保留两个小数
                let integer = parseInt(Dvalue / detailsLen)
                item.details.map((item, index) => {
                    item.roomPrice = detailsLen - 1 === index ?
                    item.roomPrice - 0 + remainder + integer
                    : item.roomPrice + integer
                })
                this.reComputedFinance()
            },
            addRoom () {
                /* 添加房间 */
                let newSubordersItem = Object.assign({}, this.newSubordersItem)
                this.data.suborders.unshift(newSubordersItem)
            },
            removeRoom (index, item) {
                /* 删除房间 */
                this.data.suborders.splice(index, 1)
                this.reComputedSuborderAmount(item)
                this.clearAllRoomIdErrMsg()
            },
            addClient (item) {
                /* 添加客户 */
                item.clients.unshift(Object.assign({}, this.newClientItem))
            },
            removeClient (item, index) {
                /* 删除客户 */
                item.clients.splice(index, 1)
            },
            handlerNights (item) {
                item.checkOutDateView = +new Date(item.checkInDateView) + item.nights * 24 * 3600000
                this.checkRoomIsDisAble(item)
                this.changedCheckInDateIds.indexOf(item.id) < 0 &&
                    this.changedCheckInDateIds.push(item.id);

                this.changedRoomIds.indexOf(item.id) < 0 || !item.id ?
                    this.reComputedSuborderAmount(item)
                    : this.reComputedSuborderAmount(item)
            },
            switchChecked (item) {
                let allChecked = this.data.suborders.filter(item => item.checked)
                if (allChecked.length === 1 && item.checked)
                    return false
                item.checked = !item.checked
            },
            onChangeRoom (itemData) {
                /* 更改房型 */
                let {roomId, checkInDateView, checkOutDateView, nights, id} = itemData
                if (itemData.isHourRoom !== 1)
                    this.checkRoomIsDisAble(itemData)
                if (this.changedRoomIds.indexOf(id) < 0)
                    this.changedRoomIds.push(id)
                if (this.changedCheckInDateIds.indexOf(id) < 0 && itemData.id) {
                    itemData.details.map(item => {
                        item.roomId = itemData.roomId
                    })
                } else 
                    this.reComputedSuborderAmount(itemData)
            },
            checkRoomIsDisAble (itemData) {
                let {roomId, checkInDateView, checkOutDateView, id} = itemData
                let params = {
                    id,
                    checkInDate: +new Date(checkInDateView),
                    checkOutDate: +new Date(checkOutDateView),
                    roomId
                }
                hotelStatusApiSercers.checkRoomIsDisAble(params).then(res => {
                    if (res.code === '600001')
                        itemData.roomIdErrMsg = res.message
                    else {
                        itemData.roomIdErrMsg = ''
                        itemData.suborderAmountViewErrMsg = ''
                        this.clearAllRoomIdErrMsg()
                    }
                })
            },
            clearAllRoomIdErrMsg () {
                this.data.suborders.map(item => {
                    if (escape(item.roomIdErrMsg) !== escape('无可用房源'))
                        item.roomIdErrMsg = ''
                })
                validateRoomRepeat(this.data.suborders)
            },
            reComputedSuborderAmount (itemData, changedRoom = true) {
                /* 
                    changedRoom  是否要按照真是价格重新计算
                                false 会按照之前房间单价重新计算
                */
                let {roomId, checkInDateView, nights, id, isHourRoom} = itemData
                if (roomId && isHourRoom !== 1) {
                    let detailsBackups = deepCopy(itemData.details)
                    itemData.details = []
                    let suborderAmountView = 0
                    let roomTypeId = this.roomList.filter(item => item.roomId === roomId)[0].roomTypeId
                    let realPriceList = this.realpriceList.filter(item => item.roomTypeId === roomTypeId)[0].realPriceList
                    for (let i = 0, len = realPriceList.length; i < len; i++) {
                        let item = realPriceList[i]
                        let dateView = formatDate(item.currDate)
                        if (formatDate(checkInDateView) === dateView) {
                            for (let j = 0; j < nights; j++) {
                                item = realPriceList[i + j]
                                dateView = formatDate(item.currDate)
                                let subItem = detailsBackups.filter(sunItem => formatDate(sunItem.checkInDate) === dateView)
                                /* 生成details */
                                let newItem = subItem.length ?
                                    changedRoom ? {
                                        ...subItem[0],
                                        roomPrice: item.realPrice,
                                        checkInDate: item.currDate,
                                    }:
                                    subItem[0]
                                : {
                                    id: null,
                                    roomPrice: item.realPrice,
                                    checkInDate: item.currDate,
                                    roomId: roomId
                                }
                                itemData.details.push(newItem)
                                suborderAmountView = NP.plus(suborderAmountView, NP.divide(newItem.roomPrice, 100))
                            }
                            break;
                        }
                    }
                    itemData.suborderAmountView = suborderAmountView
                    this.reComputedFinance()
                }
            },
            validateSuborderAmount (item) {
                item.suborderAmountViewErrMsg = !item.suborderAmountView ? '订单金额不能为空': ''
            },
            validateIdCard (item) {
                let { identityType, identityNo } = item
                if (identityType === 0 && (identityNo || identityNo === '0')) {
                    if (validateRule.idCard.test(identityNo))
                        item.identityNoErrMsg = ''
                    else
                        item.identityNoErrMsg = '身份证格式不正确'
                } else
                    item.identityNoErrMsg = ''
            }
        }
    }
</script>
<style lang='scss'>
.suborder-item {
  .inputBtn {
    position: absolute;
    top: 37px;
    z-index: 22;
    font-size: 14px;
    font-family: 'PingFangSC-Regular';
    color: #1F5A8E;
    line-height: 30px;
    text-indent: 5px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid #cdcdcd;
    cursor: pointer;
  }
  .sug-ul{
    position: absolute;
    overflow-y: auto;
    padding: 0 12px 10px;
    z-index: 22;
    font-size: 12px;
    width:270px;
    height:136px;
    background:rgba(255,255,255,1);
    border-radius:6px;
    border:1px solid rgba(205,205,205,1);
    .sug-li{
      height: 50px;
      margin-top: 10px;
      color: #666666;
      font-size: 12px;
      width:233px;
      border-bottom:2px solid #eee;
      .t-over {
        white-space:nowrap; 
        text-overflow:ellipsis;
        overflow: hidden;
      }
      
      .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
      }
    }
    &::-webkit-scrollbar {
      width: 7px;
      /*height: 10px;*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #D8D8D8;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background: #fff;
    }
  }
}
</style>
<style lang="scss">
    @import './suborderItem';
</style>
