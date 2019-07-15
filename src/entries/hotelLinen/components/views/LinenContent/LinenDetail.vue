<template>
  <div>
    <Breadcrumb class="breadcrumb" separator="<span style='color: #000000;'> > </span>">
      <BreadcrumbItem to="/linenOrderList">订单列表</BreadcrumbItem>
      <BreadcrumbItem>
        <span style="color:#65B7D9">订单详情</span>
      </BreadcrumbItem>
    </Breadcrumb>
    <div class="DetailContainer">
      <div class="item-Wrap">
        <p class="item-title">订单详情</p>
        <div class="item-content">
          <p>
            <span>订单号：</span>
            <span>{{orderDetail.orderSn}}</span>
          </p>
        </div>

        <div class="item-content">
          <Spin size="large" fix v-if="detailLoading"></Spin>
          <div class="process-Ctr">
            <span>订单状态：</span>
            <span>
              {{statusName}}
            </span>
            <div v-if="orderDetail.status < 70" class="step-wrap">
              <div class="step-line">
                <p class="step-line-percent" :style="{ width: orderDetail.status === 60 ?'100%' : orderDetail.status + (orderDetail.status - 10) + '%',}"></p>
              </div>
              <p v-for="step in orderStatus" :key="step.status" v-if="step.status < 70" :class="{
                                                                              'step-cicle': true,
                                                                              'pass': step.status <= orderDetail.status,
                                                                              'active': step.status === orderDetail.status,
                                                                          }">
                <span class="step-name">{{step.type}}{{step.name}}</span>
                <i class="check-icon" v-if="step.status < orderDetail.status || orderDetail.status === 60"></i>
              </p>
            </div>
          </div>
          <!-- 订单状态记录 -->
          <template v-if="orderDetail.status < 70">
            <div class="log-Wrap" :style="logExtendHeight">
              <div class="log-PLH">
                <p v-for="(log, index) in logs" :key="index">
                  <span>{{formatStamp(log.linenOrderLogDate, "yyyy-MM-dd hh:mm")}}</span>
                  <span>{{log.linenOrderDetail}}</span>
                </p>
              </div>
            </div>
            <div class="extend-wrap">
              <p @click="extendLog = !extendLog">
                <span v-if="extendLog">收起更多状态
                  <Icon type="ios-arrow-up" />
                </span>
                <span v-else>展开更多状态
                  <Icon type="ios-arrow-down" />
                </span>
              </p>
            </div>
          </template>
        </div>

        <div class="item-content">
          <Spin size="large" fix v-if="detailLoading"></Spin>
          <div class="innInfo-Ctr">
            <p>订单信息：</p>
            <div class="imgWrap">
              <img :src="orderDetail.imgSrc" alt="">
              <p>{{ orderDetail.linenDetail !== null && orderDetail.linenNum ? orderDetail.linenNum : orderDetail.vagueNum }}件
              </p>
            </div>
            <div class="info-wrap">
              <h4>{{orderDetail.innName}}</h4>
              <Row type="flex" :gutter="4" justify="start" align="top" class="info-row">
                <Col span="2">上门地址：</Col>
                <Col span="11">
                <p>{{orderDetail.address}}</p>
                </Col>
                <Col span="2">取件时间：</Col>
                <Col span="9">
                <p>{{formatStamp(orderDetail.reserveTime)}}</p>
                </Col>
                <Col span="2">联系人：</Col>
                <Col span="11">
                <p>{{orderDetail.contactName}}</p>
                </Col>
                <Col span="2">支付方式：</Col>
                <Col span="9">
                <p>上门收取</p>
                </Col>
                <Col span="2">联系电话：</Col>
                <Col span="11">
                <p>{{orderDetail.contactPhone}}</p>
                </Col>
                <Col span="2">订单备注：</Col>
                <Col span="9">
                <p>{{orderDetail.remarks}}</p>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <div class="item-content" v-if="orderDetail.status > 20 && orderDetail.status < 70">
          <Spin size="large" fix v-if="detailLoading"></Spin>
          <div class="goods-Ctr">
            <p class="chang-cont">
              <span>商品信息：</span>
              <span v-show='showChangeRecord' @click='changeRecords(orderDetail.id)' style='cursor: pointer;'>布草变更信息
                <Icon type="ios-arrow-forward" />
              </span>
            </p>
            <Row :gutter="17" class="goods-wrap" :style="goodsExtendHeight">
              <div class="goods-PLH">
                <Col span="4" v-for="(item, index) in goodss" :key="index" class="goods-item">
                <div class="goods-img">
                  <img :src="item.imgSrc" alt="">
                </div>
                <p class="text-break-1">{{item.goodsName}} x{{item.num}}</p>
                <p class="text-break-1">￥
                  <span>{{toDecimal2((item.price*item.num) / 100)}}</span>
                </p>
                </Col>
              </div>
            </Row>
            <div class="extend-wrap">
              <p @click="extendGoods = !extendGoods">
                <span v-if="extendGoods">收起更多商品信息
                  <Icon type="ios-arrow-up" />
                </span>
                <span v-else>展开更多商品信息
                  <Icon type="ios-arrow-down" />
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="item-content">
          <Spin size="large" fix v-if="detailLoading"></Spin>
          <p>已选优惠券：</p>
          <div v-if="coupon === null" class="coupon-none">
            暂无已选优惠券
          </div>
          <div v-else class="coupon-Ctr">
            <div :class="{
                          'coupon-item': true,
                          ['coupon-type-' + (coupon.scenes || 1)]: true, // 优惠券类型
                      }">
              <div class="title-wrap">
                <div v-if="coupon.type === 1" class="title-num">
                  <span>{{coupon.content.num}}</span>
                  <span>{{coupon.content.unit}}</span>
                </div>
                <div class="title-des">
                  <p class="text-break-1">{{couponTypeCode[String(coupon.scenes || 1)]}}</p>
                  <p class="text-break-1">{{coupon.scenesDesc}}</p>
                </div>
              </div>
              <div class="detail-wrap">
                <p>有效期至 {{formatStamp(coupon.timeEnd)}}</p>
                <p class="text-break-2">{{parseComStr(coupon.content.data)}}</p>
              </div>
              <div class="check-coupon"></div>
            </div>
            <Row v-if="orderDetail.status > 20 && reduceList.length > 0" type="flex" justify="start" align="top" class="coupon-detail">
              <Col span="3">
              <p class="cut-icon">已减免</p>
              </Col>
              <Col span="21">
              <p v-for="item in reduceList" :key="item.linenGoodsId">
                {{item.goodsName}} x{{item.reduceNum}}
              </p>
              </Col>
            </Row>
          </div>
        </div>

        <div class="item-content extraContainer">
          <div v-if="orderDetail.status > 20" class="extraInfo">
            <p v-if="orderDetail.status !== 60">支付方式：
              <b>线下支付</b>
            </p>
            <p v-else class="confirmTime">
              签收时间：{{confirmTime}}
            </p>
            <p class="price"> 总计：￥
              <span>{{toDecimal2(orderDetail.finalPrice/100)}}</span>
              <span v-if="coupon && orderDetail.oldPrice && orderDetail.oldPrice != orderDetail.finalPrice ">
                ￥{{toDecimal2(orderDetail.oldPrice/100)}}
              </span>
            </p>
          </div>
          <Button v-if="orderDetail.status === 10" type="error" ghost @click="setLinenOrder('cancel')">取消订单</Button>
          <Button v-if="orderDetail.status === 30" type="info" @click="setLinenOrder('makesure')">确认订单</Button>
          <Button v-if="orderDetail.status === 50" type="info" @click="setLinenOrder('receive')">签 收</Button>
        </div>

      </div>
    </div>
    <ChangeRecordModal ref='changeRecordModal'></ChangeRecordModal>
  </div>
</template>

<script>
import { linenApiService } from "../../../api/API";
import { formatStamp, $, toDecimal2 } from "common_libs/util.js";
import ChangeRecordModal from './changeRecordModal.vue'

export default {
  name: 'linenDetail',
  data() {
    return {
      // view data
      detailLoading: false,       // 详情loading
      extendGoods: false,         // 是否展开商品信息
      extendLog: false,           // 是否展开订单状态记录
      couponTypeCode: {           // 优惠券类型
        '1': '减免券'
      },
      showChangeRecord: false, // 是否显示变更记录
      records: {},  //变更记录内容
      orderStatus: [              // 订单状态
        { type: '待', name: '分配', status: 10 },
        { type: '待', name: '上门', status: 20 },
        { type: '待', name: '确认', status: 30 },
        { type: '', name: '送洗中', status: 40 },
        { type: '待', name: '签收', status: 50 },
        { type: '待', name: '完成', status: 60 },
        { type: '', name: '已取消', status: 70 },
      ],
      // source data
      orderDetail: {
        status: null
      },
      statusName: "...",
      logs: [],
      goodss: [],
      coupon: null,
    }
  },
  computed: {
    goodsExtendHeight: function() {
      if (!this.goodss || this.goodss.length === 0) return {}; // 防错  
      const defaultHeight = this.goodss.length > 6 ? 400 : 208;
      return {
        height: (this.extendGoods ? $('.goods-PLH').offsetHeight : defaultHeight) + 'px',
      }
    },
    logExtendHeight: function() {
      const defaultHeight = this.logs.length > 1 ? 50 : 25;
      return {
        height: (this.extendLog ? $('.log-PLH').offsetHeight : defaultHeight) + 'px',
      }
    },
    // 签收时间
    confirmTime: function() {
      const log = this.logs.find(log => log.status === 60);
      if (log) return formatStamp(log.linenOrderLogDate, "yyyy-MM-dd hh:mm");
      return '未找到相应记录';
    },
    // 已减免的商品
    reduceList: function() {

      if (this.goodss) {
        return this.goodss.filter(item => item.reduceNum > 0);
      }
      return [];
    },

  },
  components: {
    ChangeRecordModal
  },
  methods: {
    formatStamp(date, fmt) {
      return formatStamp(date, fmt);
    },
    toDecimal2(num) {
      return toDecimal2(num);
    },
    parseComStr(comArr = []) {
      let str = '';
      comArr.forEach((com, index) => {
        str += `
                        ${com.itemName}x${com.itemNum}
                        ${index === comArr.length - 1 ? '' : '、'}
                    `
      });
      return str;
    },

    // HTTP Request Methods
    refreshLinenDetail() {
      this.detailLoading = true;
      linenApiService.getLinenDetail({
        orderId: this.$route.params.orderId,
      }).then(res => {
        this.detailLoading = false;
        if (res.code === '000000' && res.content) {
          let status = this.orderStatus.find(item => item.status === res.content.order.status);
          let goodsList = res.content.order.linenDetail;
          let { coupon } = res.content;
          if (status) status = status.type + status.name;
          if (goodsList && typeof (goodsList) === 'string') {
            goodsList = JSON.parse(goodsList);
          }

          if (coupon && coupon.content && typeof (coupon.content) === 'string') {
            coupon.content = JSON.parse(coupon.content);
          }
          let temp = res.content.order
          // console.log(314, temp.status, temp.finalPrice, temp.oldPrice)
          if (temp.status == 30) {
            temp.finalPrice = temp.oldPrice
          }
          this.orderDetail = res.content.order;

          for (let i = 0, len = this.orderStatus.length; i < len; i++) {
            if (this.orderStatus[i].status < res.content.order.status && this.orderStatus[i].type == '待') {
              this.orderStatus[i].type = '已'
            }
            if (this.orderStatus[i].status < res.content.order.status && this.orderStatus[i].type == '') {
              this.orderStatus[i].name = '已送洗'
            }
            if (res.content.order.status == 60 && this.orderStatus[i].status == res.content.order.status) {
              this.orderStatus[i].type = '已'
              status = '已完成'
            }
          }
          this.statusName = status;
          /*判断是否是处于待处理之前，处于待处理之后才显示变更记录*/

          let orderId = this.$route.params.orderId
          this.getLinenRecord(orderId, res.content.order.status)
          this.logs = res.content.logs;
          this.goodss = goodsList;
          this.coupon = coupon;
        }
      })
    },
    setLinenOrder(type) {
      let message = "确认该操作？";
      if (type === 'cancel') message = "是否取消该订单？";
      if (type === 'makesure') message = "是否确认该订单？";
      if (type === 'receive') message = "确认签收该订单？";
      this.$Modal.confirm({
        title: message,
        loading: true,
        onOk: () => {
          linenApiService.setLinenOrder({
            orderId: this.$route.params.orderId,
            op: type,
          }).then(res => {
            this.$Modal.remove();
            if (res.code === '000000') {
              this.refreshLinenDetail();
              this.$Message.success(res.message);
            } else {
              this.$Message.warning(res.message);
            }
          });
        }
      });
    },
    //查看布草变更记录 接口调试的时候需要注意处理 没有记录的时候不需要显示相应字段
    changeRecords(orderId) {
      this.$refs.changeRecordModal.initRecords(this.records)
      this.$refs.changeRecordModal.showChangeRecords = true
    },
    // 获取布草变更记录
    getLinenRecord(orderId, status) {
      // orderId = '112'
      linenApiService.getLinenRecords({ orderId }).then((res) => {
        if (res.code == '000000' && res.content.length > 0) {
          if (status > 30) {
            this.showChangeRecord = true
            this.records = res.content
          }

        } else {
          this.showChangeRecord = false
        }
      })
    }
  },
  created() {
    this.refreshLinenDetail()
  },
}
</script>

<style scoped lang="scss">
.breadcrumb {
  width: 1240px;
  margin: 10px auto 0;
  font-size: 14px;
}

.DetailContainer {
  margin: auto;
  width: 1160px;
  font-size: 14px;
  color: #000000;
  .item-Wrap {
    margin-top: 40px;
    .item-title {
      padding-left: 8px;
      margin-bottom: 35px;
      border-left: 6px solid #7EC4E1;
      height: 24px;
      line-height: 24px;
      font-size: 20px;
      color: #000000;
      font-weight: bold;
    }
    .item-content {
      margin: auto;
      width: 1060px;
      padding: 5px 0 8px 5px;
      border-bottom: 1px solid #7EC4E1;
      position: relative;
    }
    .extend-wrap {
      overflow: hidden;
      p {
        float: right;
        cursor: pointer;
        color: #000000;
      }
    }
    .extendHeight {
      // 使用max-height触发transition
      max-height: 3000px!important;
    } // ---独立内容样式---
    .process-Ctr {
      margin-top: 15px;
      padding-bottom: 15px;
      .step-wrap {
        width: 860px;
        height: 32px;
        margin: 20px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        .step-line {
          width: 98%;
          height: 6px;
          border: 1px solid #65B7D9;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }
        .step-line-percent {
          position: absolute;
          left: 0;
          height: 100%;
          background-color: #65B7D9;
        }
        .step-cicle {
          display: inline-block;
          width: 21px;
          height: 21px;
          line-height: 21px;
          text-align: center;
          background: #FFFFFF;
          border: 2px solid #65B7D9;
          border-radius: 50%;
          position: relative;
          z-index: 2;
          &.pass {
            background: #65B7D9;
          }
          &.active {
            box-shadow: 0px 0px 0px 5px rgba(101, 182, 217, 0.5);
          }
          .step-name {
            display: inline-block;
            width: 60px;
            position: absolute;
            bottom: -33px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: #6E6E6E;
          }
          .check-icon {
            display: inline-block;
            width: 11px;
            height: 11px;
            background-image: url('./img/check-white.png');
            background-size: cover;
            z-index: 3;
          }
        }
      }
    }
    .log-Wrap {
      overflow: hidden;
      transition: all .8s;
      margin-top: 15px;
      .log-PLH {
        overflow: hidden;
        line-height: 28px;
        span {
          margin-right: 15px;
        }
        p:nth-child(1) {
          color: #65B7D9;
        }
      }
    }
    .innInfo-Ctr {
      position: relative;
      min-height: 180px;
      .imgWrap {
        width: 120px;
        height: 100%;
        position: absolute;
        bottom: 0;
        text-align: center;
        img {
          position: absolute;
          width: 100%;
          bottom: 30px;
          left: 0px;
        }
        p {
          position: absolute;
          width: 100%;
          bottom: 0;
          font-weight: 600;
          color: rgba(101, 183, 217, 1);
        }
      }
      .info-wrap {
        padding-left: 150px;
        h4 {
          height: 50px;
          line-height: 50px;
          color: #65B7D9;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .info-row {
          color: #8F8E8E;
          p {
            color: #000000;
            word-break: break-all;
            margin-bottom: 10px;
          }
        }
      }
    }
    .goods-Ctr {
      .chang-cont {
        display: flex;
        justify-content: space-between;
      }
      .goods-wrap {
        margin-top: 20px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: all .8s;
        .goods-PLH {
          overflow: hidden;
        }
        .goods-item {
          text-align: center;
          margin-bottom: 20px;
          .goods-img {
            width: 100%;
            height: 120px;
            position: relative;
            margin-bottom: 10px;
            img {
              max-height: 100%;
              max-width: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          p {
            margin-bottom: 8px;
            span {
              color: #FC2B2B;
            }
          }
        }
      }
    }
    .coupon-none {
      height: 155px;
      line-height: 155px;
      text-align: center;
      font-size: 18px;
    }
    .coupon-Ctr {
      min-height: 165px;
      position: relative;
      right: -7px;
      padding: 10px 0;
      .coupon-item {
        width: 250px;
        height: 130px;
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%); // cursor: pointer;
        background-image: url(./img/coupon-on.png);
        background-size: cover;
        background-repeat: no-repeat;
        color: #FFFFFF;
        .check-coupon {
          width: 43px;
          height: 41px;
          background-image: url(./img/check-coupon.png);
          background-size: cover;
          background-repeat: no-repeat;
          position: absolute;
          right: 15px;
          bottom: 17px;
        }
        .title-wrap {
          height: 70px;
          width: 100%;
          position: relative;
          .title-num {
            position: absolute;
            height: 70px;
            span:nth-child(1) {
              line-height: 80px;
              font-size: 65px;
              font-weight: bold;
              padding-left: 37px;
            }
            span:nth-child(2) {
              font-size: 16px;
            }
          }
          .title-des {
            position: absolute;
            top: 55%;
            transform: translateY(-50%);
            padding-left: 120px;
            width: 210px;
            display: inline-block;
            p:nth-child(1) {
              font-size: 16px;
            }
            p:nth-child(2) {
              padding-top: 3px;
              font-size: 12px;
            }
          }
        }
        .detail-wrap {
          width: 150px;
          height: 50px;
          position: absolute;
          left: 26px;
          font-size: 12px;
          p:nth-child(1) {
            transform: scale(0.98);
            -webkit-transform-origin-x: 0;
            padding-top: 6px;
            padding-bottom: 2px;
          }
          p:nth-child(2) {
            transform: scale(0.833333);
            -webkit-transform-origin-x: 0;
            line-height: 15px;
          }
        }
      }
      .coupon-detail {
        padding-left: 350px;
        .cut-icon {
          width: 64px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: rgba(101, 183, 217, 1);
          border-radius: 6px;
          color: #FFFFFF;
        }
      }
    }
  }
  .extraContainer {
    border-bottom: none !important;
    min-height: 100px;
    text-align: right;
    button {
      margin: 20px 0;
      width: 114px;
      height: 34px;
      font-size: 14px;
    }
    .extraInfo {
      display: block;
      margin-top: 30px;
      .price {
        margin-top: 5px;
        span:nth-child(1) {
          color: #EB1313;
        }
        span:nth-child(2) {
          color: #C4C4C4;
          font-size: 13px;
          text-decoration: line-through;
        }
      }
      .confirmTime {
        float: left;
      }
    }
  }
}
</style>
