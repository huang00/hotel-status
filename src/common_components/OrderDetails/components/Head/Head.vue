<template>
    <div class="order-header clearfix">
        <div class="edit clearfix" :key="1" v-if="edit">
            <div class="header-left">
                <p class="user-name-wrapper">
                    <!-- @compositionend.native="handleEndName" -->
                    <Input
                        v-model.trim="data.contactName"
                        placeholder="联系人"
                        style="width: 160px"
                        :maxlength="inputMaxLen"
                        @on-keyup="filterExpression(data, 'contactName')"
                        @on-blur="myBlur(),filterExpression(data, 'contactName')"
                        @on-change="onChangeContactName(data.contactName)"
                    /> 
                    <!-- 暂时屏蔽 等待测试 -->
                   <ul  v-show='showName' class='sug-ul' style=" top: 34px;left: 0;">
                     <li class='sug-li'  v-for=' (n,index) in nameList' @click='chooseName(n)' :key='index'>
                       <div style="line-height: 22px;" class='clearfix'>
                          <div  class='t-over'  v-html="brightenKeyword(n.name, data.contactName)"  style='float: left;  text-align: left; width: 108px;'></div>
                          <div  class='t-over'  style='float: right; text-align: right; width: 120px;'>{{n.telephoneNum}}</div>
                       </div>
                       <div class='clearfix' style="line-height: 22px;">
                         <span style='float:left;display:inline-block;text-align:left;'>历史入住{{n.checkInNum}}次，总房费</span>
                         <span style="float:left;display:inline-block;text-align:right;color:#D67777">￥{{n.roomAmount}}</span></div>
                     </li>
                   </ul>
                   
                    <Icon type="ios-medical" color="#D67777" />
                    <span class="wraning" v-if="errMsg">
                        <span style="font-size: 14px;">
                            <Icon type="md-alert" />
                            {{ errMsg }}
                        </span>
                    </span>
                    <Input
                        v-model.trim="data.contactPhone"
                        placeholder="电话"
                        :maxlength="16"
                        style="width: 160px; margin-left: 50px;"
                        @on-keyup="validatePhoneNumber(data, 'contactPhone')"
                        @on-blur="myBlur(),validatePhoneNumber(data, 'contactPhone')"
                        @on-change="onChangeContactPhone(data.contactPhone)"
                    /> 
                    <ul  v-show='showPhone' class='sug-ul' style=" top: 34px;left: 229px;">
                     <li class='sug-li'  v-for=' (n,index) in nameList' @click='chooseName(n)' :key='index'>
                       <div style="line-height: 22px;" class='clearfix'>
                          <div class="t-over" v-html="phoneKeyword(n.telephoneNum, data.contactPhone)"  style='float: left; text-align: left; width: 120px; '></div>
                          <div class="t-over" style='float: right; width: 108px; text-align: right'>{{n.name}}</div>
                       </div>
                       <div class='clearfix' style="line-height: 22px;">
                         <span style='float:left;display:inline-block;text-align:left;'>历史入住{{n.checkInNum}}次，总房费</span>
                         <span style="float:left;display:inline-block;text-align:right;color:#D67777">￥{{n.roomAmount}}</span></div>
                     </li>
                   </ul>
                </p>
            </div>
            <div class="header-right">
                <Select
                    v-model="data.orderFrom"
                    style="width:133px"
                    :disabled="!!data.otaOrderNo"
                    label-in-value
                    ref="orderFrom"
                >
                    <Option
                        v-for="item in orderFromList" :key="item.id"
                        :value="item.id"
                        @click.native="orderFromChange(item.channelName)"
                    > 
                        <span
                            :class="['channel-logo', getChannelFrom(item.channelCode).className]"
                            :style="{
                                color: item.channelColor
                            }"
                        >
                        <template v-if="!getChannelFrom(item.channelCode).className">
                            {{item.channelName.substring(0, 1)}}
                        </template>
                        </span>
                        {{item.channelName}}
                    </Option>
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
        hotelStatusApiSercers
    } from '../../../../entries/hotelStatus/api/API.js'
    import {
        getChannelFrom,
        trimAll,
        validateRule,
        changeMoney
    } from 'common_libs/util'
    import Base from '../Mixins/base'

    export default {
        name: 'Head',
        mixins: [Base],
        data () {
            return {
                getChannelFrom,
                errMsg: '',
                showName: false,
                showPhone: false,
                nameList: [],
                tempCacheName: {},
                tempCachePhone: {},
            }
        },
        created() {
            if (this.$root.Bus) {
                this.$root.Bus.$on('on-order-form-validate', (errObj) => {
                    this.errMsg = errObj.contactName && errObj.contactName.errMsg
                })
            }
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
            },
           
        },
        watch: {
          // showName(val) {
          //   if (val && this.showPhone )   {
          //     this.showPhone = false
          //   }
          // },
          // showPhone(val) {
          //   if (val && this.showPhone )   {
          //     this.showName = false
          //   }
          // }
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
            getMatchPhone (obj) {
              hotelStatusApiSercers.getMatchPhoneResult(obj).then(res => {
                  if (res.code === '000000' && res.content) {
                    if (res.content.length) {
                      for (let i = 0; i < res.content.length; i++) {
                        res.content[i].roomAmount = changeMoney(res.content[i].roomAmount) || '0.00'
                        res.content[i].checkInNum = res.content[i].checkInNum || '0'
                      }
                      this.nameList = res.content 
                      this.tempCachePhone[obj.phone] = res.content
                      this.showPhone = true
                    } else {
                      this.nameList = []
                      this.showPhone = false
                    }
                  } else {
                    this.nameList = []
                    this.showPhone = false
                  }
              })
            },
          //匹配到结果后快速导入
            chooseName(name) {
              this.$props.data.contactName = name.name
              this.$props.data.contactPhone = name.telephoneNum
              this.showName = false 
              this.showPhone = false 
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
            // 号码匹配
            phoneKeyword(val, keyword) {
              // console.log(165, val, keyword)
              val = val + '';
              if (val.indexOf(keyword) !== -1 && keyword !== '') {
                return val.replace(keyword, '<font color="#2E598C">' + keyword + '</font>')
              } else {
                return val 
                }
            },
            findOrderFromById (fromId) {
                return this.$store.getters.orderFromList.filter(item => item.id === fromId)
            },
            
            myBlur() {
              setTimeout(() => {
                this.showName = false
                this.showPhone = false
              }, 200)
            },
            handleEndName (obj) {
              if (JSON.stringify(this.tempCacheName) == "{}") { // 初始化为空的时候
                this.getMatchName(obj)
              } else {
                if(this.tempCacheName[obj.name] == undefined) {
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
            onChangeContactName (val) {
                this.errMsg = !trimAll(val)
                    ? '联系人姓名不能为空' : ''
                let availabelVal = trimAll(val) 

                let obj = {
                  name: val, 
                }
                if (availabelVal && availabelVal.length) { 
                  //检索 有匹 配值时 显示
                  if (validateRule.nation.test(val)) {
                    this.handleEndName(obj)
                  } else {
                    if (availabelVal.length > 1) {
                      this.handleEndName(obj)
                    } 
                  }
                } else {
                  this.showName = false
                }   
            },
            onChangeContactPhone(val) {
              let availabelPhone = trimAll(val)
              let obj = {
                phone: val, //this.$props.data.contactPhone
              }
              if (availabelPhone &&  availabelPhone.length > 3) { 
                //检索 有匹配值时 显示
                if (JSON.stringify(this.tempCachePhone) == "{}") { // 初始化为空的时候
                  this.getMatchPhone(obj)
                } else {
                  if (this.tempCachePhone[val] == undefined) {
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
            },
            orderFromChange (value) {
                this.$refs.orderFrom.$data.values[0].label = value
            },
        }
    }
</script>

<style lang="scss" scoped>
    .order-header {
        position: relative;
        .edit {
            height: 45px;
            padding-top: 6px;
            .header-left {
                padding-left: 14px;
                .user-name-wrapper {
                    position: relative;
                    display:inline-block;
                    .sug-ul{
                        position: absolute;
                        overflow-y: auto;
                        padding: 0 12px 10px;
                        z-index: 22;
                        width: 270px;
                        height:136px;
                        background:rgba(255,255,255,1);
                        border-radius:6px;
                        border:1px solid rgba(205,205,205,1);
                        .sug-li{
                          width: 233px;
                          height: 50px;
                          margin-top: 10px;
                          color: #666666;
                          font-size: 12px;
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
