
<!-- 查看详情 -->

<template>
  <Modal v-model="lookDetailModal" width='665' class-name="look-modal" footer-hide>
    <div class="look-detail-modal">
      <div class="table-nav">
        <span @click="changeShow(0)" :class="active0Class" class="nav-pub" style="margin-right: 74px;">基本信息</span>
        <span @click="changeShow(1)" :class="active1Class" class="nav-pub">订单记录</span>
      </div>
      <!-- 基本信息 -->
      <div v-show="showBaseInfo" class="base-box clearfix1" style="height: 568px;">
        <div style="overflow-y: auto; margin-left: 115px;height: 510px;">
          <div class='label-div clearfix1'>
            <span class="label-name">姓名：</span>
            <span class='detail-text'>{{clientDetail.name}}</span>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name">电话：</span>
            <span class='detail-text'>{{clientDetail.telephoneNum}} {{clientDetail.telephoneNumAttribution}}</span>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name">证件：</span>
            
            <span class='detail-text'>
              {{clientDetail.identityNo}} {{clientDetail.identityType}}
            </span>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name">性别：</span>
            <span class='detail-text'>{{clientDetail.gender}}</span>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name">生日：</span>
            <span class='detail-text'>{{clientDetail.birthday}} </span>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name">民族：</span>
            <span class='detail-text'>{{clientDetail.nation}}</span>
          </div>
          <div class='label-div clearfix1'>
            <div class="label-name">地址：</div>
            <div class='detail-text'>{{clientDetail.address}}</div>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name">微信：</span>
            <span class='detail-text'>{{clientDetail.weChatId}}</span>
          </div>
          <div class='label-div clearfix1'>
            <span class="label-name ">备注：</span>
            <span class='detail-text wrap-word' v-if='clientDetail.remarks'>{{clientDetail.remarks}}</span>
            <span class='detail-text' v-else=''>未填</span>
          </div>
        </div>
        <div style="padding: 60px auto 20px;">
            <div class='edit-btn' @click='editBtn'>
              编辑
            </div>
        </div>
      </div>
      <!-- 订单详情 -->
      <div v-show="showOrderDetail" class='order-records' style="height: 568px;"> 
        <div id='recordDom' v-show='lookNoData' style='height:570px;'></div>
        <div v-show='lookHaveData'>
          <ul class='record-ul'>
            <li class='record-li' v-for='key in clientRcords' :key='key.innId' >
              <div class='dis-flex'>
                <div  style="width: 50%;">
                  <div style="float: left; width: 80px; ">
                    <img :src='personSrc' class='record-icon' />
                    <span class='record-person-name'>入住人</span>
                  </div>
                  <div class='record-hotel-name' :title='key.innName'>
                    {{key.innName}}
                  </div>
                </div>
                <div class='record-nights'>
                  {{key.checkInDate}} —— {{key.checkOutDate}} ({{key.roomNight}}晚)
                </div>
              </div>
              <div class='dis-flex' style='margin-top: 5px;' >
                <div class='record-room-type' :title="key.roomName + ' ' + key.roomNum" >
                  {{key.roomName}} {{key.roomNum}}
                </div>
                <div class='record-room-sum'>￥{{key.roomAmount}}</div>
              </div>
            </li>

          </ul>
          <div class='record-footer'>
            <span class='r-footer-lable'>入住房费：</span>
            <span class='r-footer-sum'>￥{{totalRoomAmount}}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import person from '../../assets/img/person.png'
import { hotelUserApiSercers } from '../../api/API'
import { formatStampYMD, changeMoney } from '../../libs/util.js'
export default {
  data() {
    return {
      lookDetailModal: false,
      lookNoData: true, // 是否显示暂无数据
      lookHaveData: false, // 是否显示暂无数据
      personSrc: person,
      showBaseInfo: true,
      showOrderDetail: false,
      active0Class: 'pay-active',
      active1Class: 'pay-status',

      clientDetail: {},
      clientRcords: [],
      totalRoomAmount: null,
      curRow: {}
    }
  },
  mounted() {
    this.showNoData()
  },
  watch: {
    lookDetailModal (val) {
      if (!val) {
         setTimeout(() => {
            this.active0Class =  'pay-active'
            this.active1Class = 'pay-status'
            this.showOrderDetail = false
            this.showBaseInfo = true
         },100);
      }
    }
  },
  methods: {
    getLookDetail(row) {
      this.curRow = row
      hotelUserApiSercers.lookForClinent({ id: row.id }).then((res) => {
        if (res.code == '000000' && res.content) {
          if (res.content.telephoneNumAttribution) {
            res.content.telephoneNumAttribution = `（${res.content.telephoneNumAttribution}）`
          } 
          res.content.birthday = formatStampYMD(Number(res.content.birthday))
          if (res.content.gender) {
            res.content.gender = res.content.gender == 'man' ? '男' : '女'
          }
          if (res.content.identityType && res.content.identityNo) {
            if (res.content.identityType == 'identity') {
              res.content.identityType = '（身份证）';
            } 
            if (res.content.identityType == 'passport') {
              res.content.identityType = '（护照）';
            }
            if (res.content.identityType == 'officers') {
              res.content.identityType = '（军官证）';
            }
            if (res.content.identityType == 'other') {
              res.content.identityType = '（其他）';
            }
          } else {
            this.clientDetail.identityType = ''
            res.content.identityType = '';
          }
          this.clientDetail = res.content
          
        } else {
          this.$Message.error(res.message)
        }
      })
      hotelUserApiSercers.getOrderRemark({ id: row.id }).then((res) => {
       
        if (res.code == '000000' && res.content.clientOrderRecordDTOS ) {
          let temp = res.content.clientOrderRecordDTOS
          if(temp.length) {
            for (let i = 0, len = temp.length; i < len; i++) {
              temp[i].checkInDate = formatStampYMD(Number(temp[i].checkInDate))
              temp[i].checkOutDate = formatStampYMD(Number(temp[i].checkOutDate))
              temp[i].roomAmount = changeMoney(temp[i].roomAmount)
            }
           
            this.clientRcords = temp
            this.totalRoomAmount = changeMoney(res.content.totalRoomAmount)
            this.lookNoData = false
            this.lookHaveData = true
          } else {
            this.lookNoData = true
            this.lookHaveData = false
          }
        } else {
          this.lookNoData = true
          this.lookHaveData = false
          //  this.$Message.error(res.message)
        }
      })
      this.lookDetailModal = true 
    },

    // 切换组件显示
    changeShow(index) {
      if (index == 0) {
        this.showBaseInfo = true
        this.showOrderDetail = false
        this.active0Class = 'pay-active'
        this.active1Class = 'pay-status'
      } else {
        this.showBaseInfo = false
        this.showOrderDetail = true
        this.active0Class = 'pay-status'
        this.active1Class = 'pay-active '
      }
    },
    // 基本信息
    editBtn() {
      this.lookDetailModal = false
      this.$parent.eidtUser(this.curRow)
    },
    // 订单详情
    //订单无数据
    showNoData() {
      let emptyBody = document.getElementById('recordDom')
      emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据 <br/> ...</div></div></div>'
    },
  }
}
</script>
<style lang="scss">
.look-modal {
  /* font-family: 'PingFangSC-Regular';
  height: 673px; */
  .ivu-modal-body {
    padding: 0;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
  .look-detail-modal {
    .clearfix1 {
      &:after{
        content:'';
        display:block;
        clear:both;
        height: 0;
        visibility: hidden;
      } 
    }
    .wrap-word {
      word-wrap: break-word;
    word-break: normal;
    }
    .table-nav {
      width: 100%;
      margin: 0 auto 0;
      text-align: center;
      .nav-pub {
        font-size: 16px;
        width: 68px;
        cursor: pointer;
        line-height: 42px;
        display: inline-block;
      }
      .pay-active {
        height: 22px;
        font-size: 16px;
        font-family: 'PingFangSC-Regular';
        font-weight: 400;
        color: rgba(33, 93, 145, 1);
        border-top: 4px solid #215D91;
        background: #fff;
      }
    } 
    /* 基本信息 */
    .base-box {
      /* margin: 45px 115px 0; */
      margin-top: 25px;
      /* padding-bottom: 20px; */
      .label-div {
        margin-bottom: 25px;
        min-height: 20px;
        .label-name {
          display: block;
          float: left;
          width: 46px;
          /* height: 20px; */
          display: inline-block;
          font-size: 14px;
          font-family: 'PingFangSC-Medium';
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
        }
        .detail-text {
          float:left;
          display: block;
          width: 345px;
          /* height: 20px; */
          font-size: 14px;
          display: inline-block;
          font-family: 'PingFangSC-Regular';
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
        }
      }
      .edit-btn {
        width: 110px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        background: linear-gradient(270deg, rgba(138, 173, 197, 1) 0%, rgba(75, 136, 188, 1) 100%);
        box-shadow: 2px 2px 8px 0px rgba(56, 120, 178, 0.33);
        border-radius: 17px;
        margin: 0 auto;
        cursor: pointer;
      }
    }
    /* 订单详情 */
    .order-records {
      #recordDom {
        margin-top: 25px;
        height: 570px;
        // position: relative;
      }
      .record-ul {
        // width: 628px;
        height: 488px;
        overflow-y: auto;
        padding: 0 20px;
        margin-top: 25px;
        /*滚动条样式*/
        &::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 7px;
          /*高宽分别对应横竖滚动条的尺寸*/
          /*height: 10px;*/
        }
        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 4px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #D8D8D8;
        }
        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          background: #fff;
        }


        .record-li {
          span {
            display: inline-block;
          }
          background: #F5F9FA;
          padding: 0 10px;
          height:64px;
          margin-bottom: 17px;
          border-left: 2px solid #1F5A8E;
          border-radius: 0 6px 6px 0;
          .record-icon {
            width: 16px;
            height: 20px;
            vertical-align: middle;
            margin-right: 6px;
            margin-bottom: 5px;
          }
          .record-person-name {
            margin-right: 10px;
            font-size: 14px;
            font-family: 'MicrosoftYaHei';
            color: rgba(31, 90, 142, 1);
            line-height: 34px;
          }
          .record-hotel-name {
            float: left;
            width: 70%;
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 18px;
            font-family: 'MicrosoftYaHei';
            color: rgba(31, 90, 142, 1);
            /* line-height: 34px; */
          }
          .record-nights {
            width: 50%;
            text-align: right;
            // height: 20px;
            font-size: 14px;
            font-family: 'PingFangSC-Regular';
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 34px;
          }
          .record-room-type {
            width: 50%;
            font-size: 14px;
            font-family: 'PingFangSC-Regular';
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .record-room-sum {
            width: 50%;
            // height: 20px;
            font-size: 14px;
            font-family: ' PingFangSC-Regular';
            font-weight: 400;
            color: rgba(214, 119, 119, 1);
            line-height: 16px;
            text-align: right;
          }
        }
      }
      .record-footer {
        text-align: right;
        padding: 20px 20px 6px;
        .r-footer-lable {
          font-size: 14px;
          font-family: 'MicrosoftYaHei';
          color: rgba(31, 90, 142, 1);
          line-height: 19px;
        }
        .r-footer-sum {
          font-size: 14px;
          font-family: 'PingFangSC-Regular';
          font-weight: 400;
          color: rgba(214, 119, 119, 1);
          line-height: 20px;
        }
      }
      .not-data {
        height: 593px;
        position: relative;
        text-align: center;
        width: 100%;
        color: #999;
        font-size: 14px;
        background: url("../../assets/img/noData.png") no-repeat center center;
      }
      .nodata-text {
        position: absolute;
        left: 46%;
        bottom: 170px;
      }
    }
  }
}
</style>