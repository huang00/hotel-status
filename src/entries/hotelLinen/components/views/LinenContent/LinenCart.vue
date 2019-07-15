<template>
  <div class="cartWrap">
    <div class="item-Wrap">
      <p class="item-title">上门地址</p>
      <div class="item-content">
        <p class="address-Ctr">
          <span>{{userInfo.innName}}</span>
          <span>{{ innAddress }}</span>
        </p>
      </div>
    </div>

    <div class="item-Wrap">
      <p class="item-title">联系人信息</p>
      <div class="item-content">
        <Spin v-if="contactorLoading" class="spinFix" size="large" fix></Spin>
        <Row class="contactor-Ctr" :style="contactorHeight">
          <div class="contactor-PLH">
            <Col span="6" v-for="(con, index) in contactorArr" :key="index">
            <div :class="{
                                                                                                            'contactor-item': true,
                                                                                                            'contactor-acticve': con.active,
                                                                                                        }" @click.capture="select('contactor', con, index)" v-if="!con.showEdit">
              <p class="con-name text-break-1">{{con.contactName}}</p>
              <p>
                {{String(con.phone).substring(0, 3)}} {{String(con.phone).substring(3, 7)}} {{String(con.phone).substring(7, 12)}}
              </p>
              <div @click.stop="" class="conBtn-wrap">
                <Poptip confirm transfer title="确认删除该联系人？" @on-ok="delContactor(con)">
                  <i class="delete-icon"></i>
                </Poptip>
                <i class="edit-icon" @click.stop="editContactor(con, true)"></i>
              </div>
              <span v-show="con.active" class="check-contactor"></span>
            </div>
            <div v-else class="contactor-item noBG editWrap">
              <Form :model="con" :rules="contactorRule" ref="contactorForm">
                <p>
                  <span @click="editContactor(con, false)">确认</span>
                  <span @click="cancleEditContactor(con)">取消</span>
                </p>
                <Input placeholder="请输入姓名" size="small" v-model="con.contactName" :maxlength="32" />
                <FormItem prop="phone">
                  <Input placeholder="请输入电话号码" size="small" v-model="con.phone" />
                </FormItem>
              </Form>
            </div>
            </Col>
            <Col span="6" v-show="canAddCon">
            <div class="contactor-item noBG">
              <div class="add-contactor" @click="newContactor">
                <div class="plus-bac">
                  <Icon size="20" type="md-add" class="plus-icon"></Icon>
                </div>
                <span class="blue-font">新增联系人</span>
              </div>
            </div>
            </Col>
          </div>
        </Row>
        <div class="extend-wrap">
          <p @click="extendContactor = !extendContactor">
            <span v-if="extendContactor">收起联系人
              <Icon type="ios-arrow-up" />
            </span>
            <span v-else>更多联系人
              <Icon type="ios-arrow-down" />
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="item-Wrap">
      <p class="item-title">清单</p>
      <div class="item-content quantity-Ctr">
        <p>请选择本订单待洗物品的大致数量以便我们安排合适的车辆取件</p>
        <Row class="quantity-wrap">
          <Col span="4" class="quantity-item" v-for="(item, index) in quantityArr" :key="index">
          <div @click.capture="select('quantity', item, index)">
            <div class="quantity-imgWrap"><img :src="item.img" alt=""></div>
            <p class="quantity-info" v-if="item.editable && item.active && !confirmQuantity">
              <InputNumber placeholder="请输入数量" style="width: 40%; margin: -1px auto;" size="small" :step="100" :min="0" v-model="item.vagueNum" @keyup.enter.native="enterQuantity(item, index)">
              </InputNumber>
              <Button slot="append" type="primary" size="small" class="blueBtn" @click="enterQuantity(item, index)">确认</Button>
            </p>
            <p class="quantity-info" v-else>{{item.quantityStr}}</p>
            <div :class="{
                'quantity-select': true,
                'quantity-active': item.editable ? (confirmQuantity && item.active) : item.active
            }"></div>
          </div>
          </Col>
        </Row>
        <div>
          取件时间：&nbsp;
          <DatePicker type="date" placeholder="请选择取件日期" style="width: 200px" format="yyyy-MM-dd" :options="dateOption" @on-change="setDate"></DatePicker>
        </div>
        <div style="margin-top: 30px;">
          订单备注：&nbsp;
          <Input type="textarea" placeholder="输入备注内容" style="width: 655px; margin-bottom: 35px;" v-model="orderParam.remarks" :autosize="{minRows: 2,maxRows: 5}" :maxlength="128" />
        </div>
      </div>
    </div>

    <div class="item-Wrap">
      <p class="item-title">优惠券</p>
      <div class="item-content">
        <Spin v-if="couponArr === null" class="spinFix" size="large" fix></Spin>
        <div v-if="couponArr !== null && couponArr.length === 0" class="coupon-none">
          暂无可用的优惠券
        </div>
        <Row v-else class="coupon-Ctr" :style="couponHeight">
          <div class="coupon-PLH">
          <Col span="6" v-for="(item, index) in couponArr" :key="index" :class="{
                  'coupon-item': true,
                  'coupon-off': item.used === 99,
                  ['coupon-type-' + (item.scenes || 1)]: true, // 优惠券类型
              }" @click.capture.native="select('coupon',item, index)">
            <div class="title-wrap">
              <div v-if="item.type === 1" class="title-num">
                <span>{{item.content.num}}</span>
                <span>{{item.content.unit}}</span>
              </div>
              <div class="title-des">
                <p class="text-break-1">{{couponTypeCode[String(item.scenes || 1)]}}</p>
                <p class="text-break-1">{{item.scenesDesc}}</p>
              </div>
            </div>
            <div class="detail-wrap">
              <p>有效期至 {{formatDate(item.timeEnd)}}</p>
              <p class="text-break-2">{{parseComStr(item.content.data)}}</p>
            </div>
            <div v-if="item.active" class="check-coupon"></div>
            <div v-if="item.used === 99" class="off-icon"></div>
            </Col>
          </div>
        </Row>
        <div class="extend-wrap">
          <p @click="extendCoupon = !extendCoupon">
            <span v-if="extendCoupon">收起优惠券
              <Icon type="ios-arrow-up" />
            </span>
            <span v-else>更多优惠券
              <Icon type="ios-arrow-down" />
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="item-Wrap">
      <p class="item-title">支付方式</p>
      <div class="item-content">
        <p class="address-Ctr">
          <span></span>
          <span>线下支付</span>
        </p>
      </div>
    </div>

    <div class="submitWrap">
      <p @click="submitOrder">
        <Spin fix v-if="submitLoading"></Spin>
        提交订单
      </p>
    </div>

  </div>
</template>

<script>
// import pmsModal from 'pms-modal';
import { formatDate, getCookie, $ } from "common_libs/util.js";
import { linenApiService, hotelOrderApiServers } from "../../../api/API";
import router from '../../../router';

export default {
  name: 'linenCart',
  data() {
    return {
      // view data
      extendContactor: false,   // 扩展联系人
      extendCoupon: false,      // 扩展优惠券
      contactorLoading: false,  // 联系人请求loading
      submitLoading: false,     // 提交请求loading
      canAddCon: true,          // 是否可以新增联系人
      confirmQuantity: false,   // 确认自定义清单数量
      couponTypeCode: {         // 优惠券类型
        '1': '减免券'
      },
      quantityArr: [
        {
          quantityStr: '10 ~ 30件',
          img: require('./img/quantity-1.png'),
          imgSrc: 'https://wefint.oss-cn-qingdao.aliyuncs.com/bucao/20181009154458.png',
          vagueNum: '10~30',
          active: false,
        }, {
          quantityStr: '30 ~ 60件',
          img: require('./img/quantity-1.png'),
          imgSrc: 'https://wefint.oss-cn-qingdao.aliyuncs.com/bucao/20181009154458.png',
          vagueNum: '30~60',
          active: false,
        }, {
          quantityStr: '60 ~ 100件',
          img: require('./img/quantity-2.png'),
          imgSrc: 'https://wefint.oss-cn-qingdao.aliyuncs.com/bucao/20181009154509.png',
          vagueNum: '60~100',
          active: false,
        }, {
          quantityStr: '100 ~ 200件',
          img: require('./img/quantity-2.png'),
          imgSrc: 'https://wefint.oss-cn-qingdao.aliyuncs.com/bucao/20181009154509.png',
          vagueNum: '100~200',
          active: false,
        }, {
          quantityStr: '200 ~ 300件',
          img: require('./img/quantity-3.png'),
          imgSrc: 'https://wefint.oss-cn-qingdao.aliyuncs.com/bucao/20181009154522.png',
          vagueNum: '200~300',
          active: false,
        }, {
          quantityStr: '自定义',
          img: require('./img/quantity-4.png'),
          imgSrc: 'https://wefint.oss-cn-qingdao.aliyuncs.com/bucao/20181009154522.png',
          vagueNum: 400,
          active: false,
          editable: true,
        }
      ],
      selectedIndex: {
        contactor: null,
        quantity: null,
        coupon: null
      },
      contactorRule: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'change' },
          { pattern: /^1\d{10}$/, message: '请输入正确的电话号码', trigger: 'change' }
        ]
      },
      dateOption: {
        disabledDate(date) {
          return date
            && date.valueOf() < Date.now()
            || date.valueOf() > Date.now() + (7 * 86400000)
        }
      },
      // source data
      contactorArr: [],
      couponArr: null,
      // param data
      orderParam: {
        address: null,
        contactName: null,
        contactPhone: null,
        reserveTime: null,
        remarks: null,
        vagueNum: null,
        imgSrc: null,
        innCouponId: null,
        couponName: null,
        payWay: 125,
      }
    }
  },
  computed: {
    contactorHeight: function() {
      return {
        height: (this.extendContactor ? $('.contactor-PLH').offsetHeight : 110) + 'px',
      };
    },
    // 优惠券Div高度，配合transition
    couponHeight: function() {
      return {
        height: (this.extendCoupon ? $('.coupon-PLH').offsetHeight : 155) + 'px',
      };
    },
    userInfo () {
      return this.$store.getters.userInfo
    },
    innAddress () {
      let { provinceName, cityName, regionName, address, innName } = this.userInfo
      if (address || cityName) {
        let innAddress = ''
        let start = address.indexOf(regionName) +  regionName.length
        if (address.indexOf(regionName) >= 0)
            address = address.substring(start)
        if (address.indexOf('/') === 0)
            address = address.substring(1)
            
        innAddress = `${provinceName} ${cityName} ${regionName} ${address}`
        this.orderParam.address = innAddress
        return innAddress
      }
    }
  },
  watch: {
    contactorArr(newData, oldData) {
      // 有新增项目正在操作时始终不显示添加按钮
      if (newData.length > 0 && newData[newData.length - 1].isNew) {
        this.canAddCon = false;
      } else {
        this.canAddCon = true;
      }
      // 初始化时（没有active项目）默认选中第一项
      if (newData.length > 0 && this.selectedIndex.contactor === null) {
        this.selectedIndex.contactor = 0;
        this.orderParam.contactName = newData[0].contactName;
        this.orderParam.contactPhone = newData[0].phone;
        newData[0].active = true;
      }
      // 没有选中项时置空orderParam
      if (newData.findIndex(item => item.active) === -1) {
        this.orderParam.contactName = null;
        this.orderParam.contactPhone = null;
      }
    },
    couponArr(newData, oldData) {
      // 初始化时（没有active项目）默认选中第一项
      if (
        newData.length > 0
        && this.selectedIndex.coupon === null
        && newData[0].used !== 99
      ) {
        this.selectedIndex.coupon = 0;
        this.orderParam.innCouponId = newData[0].id;
        this.orderParam.couponName = newData[0].couponName;
        newData[0].active = true;
      }
      // 没有选中项时置空orderParam
      if (newData.findIndex(item => item.active) === -1) {
        this.orderParam.innCouponId = null;
        this.orderParam.couponName = null;
      }
    }
  },
  methods: {
    setData(data, cb) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });
      if (cb) cb();
    },
    setDate(cbDate) {
      this.orderParam.reserveTime = cbDate;
    },
    formatDate(date) {
      return formatDate(date);
    },
    getCookie(key) {
      return getCookie(key);
    },

    select(type, item, index) {
      let arrKey = null;
      switch (type) {
        case 'contactor':
          this.orderParam.contactName = item.contactName;
          this.orderParam.contactPhone = item.phone;
          break;
        case 'quantity':
          if (item.editable && this.confirmQuantity) {
            this.confirmQuantity = !this.confirmQuantity;
          }
          this.orderParam.vagueNum = item.vagueNum;
          this.orderParam.imgSrc = item.imgSrc;
          break;
        case 'coupon':
          if (item.used === 99) return;
          this.orderParam.innCouponId = item.id;
          this.orderParam.couponName = item.couponName;
          break;
        default:
          break;
      };
      arrKey = type + 'Arr';
      this[arrKey].forEach(i => i.active = false);
      item.active = true;
      this.selectedIndex[type] = index;
    },

    newContactor() {
      this.contactorArr.forEach(con => {
        con.showEdit = false;
      });
      this.contactorArr.push({
        contactName: '',
        phone: '',
        active: false,
        showEdit: true,
        isNew: true,
      });
      this.canAddCon = false;
    },
    editContactor(item, status) {
      if (!status) { // 点击确认按钮
        this.$refs.contactorForm[0].validate((valid) => {
          if (valid) {
            if (item.isNew) { //是否新增
              this.addContactor(item);
            } else { // 修改
              this.updateContactor(item);
              item.showEdit = status;
            }
          } else {
            this.$Message.error('请检查输入项目!');
          }
        });
      } else {
        if (item.id && this.contactorArr[this.contactorArr.length - 1].isNew) {
          // 避免用户在新增时点击其他项目的编辑按钮
          this.contactorArr.pop();
        }
        this.cacheEditCon = Object.assign({}, item); // 便于取消后还原内容
        this.contactorArr.forEach(con => {
          con.showEdit = false;
        });
        item.showEdit = status;
      }
    },
    cancleEditContactor(item) {
      if (item.isNew) { // 如果是新增项目
        this.contactorArr.pop();
      } else {
        Object.keys(this.cacheEditCon).forEach(key => {
          item[key] = this.cacheEditCon[key];
        });
      }
    },

    enterQuantity(item, index) {
      this.orderParam.vagueNum = item.vagueNum;
      item.quantityStr = item.vagueNum + '件';
      this.confirmQuantity = true;
    },
    parseComStr(comArr) {
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
    addContactor(param) {
      linenApiService.addContactor({
        phone: param.phone,
        contactName: param.contactName
      }).then(res => {
        if (res.code === "000000") {
          this.$Message.success(res.message);
          this.refreshContactor();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    updateContactor(param) {
      linenApiService.updateContactor({
        id: param.id,
        phone: param.phone,
        contactName: param.contactName
      }).then(res => {
        if (res.code === "000000") {
          this.$Message.success(res.message);
          this.refreshContactor();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    delContactor(item) {
      linenApiService.delContactor({
        id: item.id
      }).then(res => {
        if (res.code === "000000") {
          this.$Message.success(res.message);
          this.refreshContactor();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    submitOrder() {
      // 效验
      if (this.orderParam.contactPhone === null) {
        this.$Modal.warning({
          title: '请选择联系人！'
        });
      } else if (
        this.orderParam.vagueNum === null
        ||
        // 当选择自定义且未点击确定时
        (!this.confirmQuantity && this.selectedIndex.quantity === 5)
      ) {
        this.$Modal.warning({
          title: '请选择清单数量！'
        });
      } else if (this.orderParam.reserveTime === null) {
        this.$Modal.warning({
          title: '请选择取件时间！'
        });
      } else {
        this.submitLoading = true;
        linenApiService.submitOrder(this.orderParam).then(res => {
          this.submitLoading = false;
          if (res && res.code === '000000') {
            this.$Message.success(res.message);
            router.push({
              name: 'linenSubmitSuccess',
              params: { orderId: res.content.id }
            });
          } else {
            // this.$Message.error(res.message + ' 错误码：' + res.code);
            this.$Message.error('部分信息出错，请检查');
          }
        });
      }
    },
    refreshContactor() {
      this.contactorLoading = true;
      linenApiService.getContactor({
        num: 1000
      }).then(res => {
        if (res && res.content) {
          const contactorArr = res.content.datas;
          contactorArr.forEach(item => {
            item.active = false;
            item.showEdit = false;
          })
          this.contactorArr = contactorArr;
        }
        this.contactorLoading = false;
      });
    },
    refreshCoupon() {
      linenApiService.getCoupon({
        num: 1000,
        used: '0,99' // 0未用,1已用 99过期
      }).then(res => {
        if (res && res.content && res.code === '000000') {
          //未使用的优惠券展示优先展示，未使用优惠劵里面按照过期的时间，有效期最短的优先排列
          let inorderCoupon = res.content.datas.sort(this.couponInorder('timeEnd', 'used'))
          const couponArr = inorderCoupon.map(item => {
            item.active = false;
            if (item.content && typeof (item.content) === 'string') {
              item.content = JSON.parse(item.content);
            }
            return item;
          })
          this.couponArr = couponArr;
        }
      })
    },
    // 优惠券排序
    couponInorder(property, used) {
      return function(a, b) {
        if (a[used] == 99 && b[used] == 99) {
          return b[property] - a[property]
        } else if (a[used] == 0 && b[used] == 0) {
          return a[property] - b[property]
        } else {
          if (b[property] - a[property] > 0) {
            return 1
          } else {
            return -1
          }
        }
      }
    },
  },
  created() {
    // 初始化数据
    // --联系人
    this.refreshContactor();
    // --优惠券
    this.refreshCoupon();
    // --默认本地值（请求数据的默认值在watch中进行）
    this.quantityArr[0].active = true;
    this.orderParam.vagueNum = this.quantityArr[0].vagueNum;
    this.orderParam.imgSrc = this.quantityArr[0].imgSrc;
  },
}
</script>

<style scoped lang="scss">
.cartWrap {
  margin: auto;
  width: 1090px;
  font-size: 14px;
  .item-Wrap {
    margin-top: 40px;
    .item-title {
      padding-left: 8px;
      margin-bottom: 20px;
      border-left: 6px solid #7EC4E1;
      height: 24px;
      font-size: 16px;
      color: #000000;
      font-weight: bold;
    }
    .item-content {
      margin-left: 14px;
      padding-bottom: 8px;
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
    } // ---独立内容样式---
    // 地址
    .address-Ctr {
      font-size: 15px;
      letter-spacing: 1px;
      color: #000000;
      span:nth-child(1) {
        font-weight: bold;
        margin-right: 20px;
      }
    } // 联系人
    .contactor-Ctr {
      overflow: hidden;
      transition: all .8s;
      position: relative;
      padding: 10px 0;
      margin: -10px 0 0 -3px;
      .contactor-PLH {
        overflow: hidden;
        padding: 3px;
      }
      .contactor-item {
        width: 180px;
        height: 74px;
        margin-bottom: 50px;
        line-height: 30px;
        padding: 7px 27px;
        font-size: 14px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 2px 0px 6px rgba(218, 218, 218, 1);
        position: relative;
        cursor: pointer;
        transition: all .2s;
        &.contactor-acticve {
          border: 1px solid rgba(126, 196, 225, 1);
        }
        .con-name {
          font-weight: bold;
          width: 75%;
        }
        .check-contactor {
          display: inline-block;
          position: absolute;
          height: 21px;
          width: 30px;
          background-image: url(./img/check-contactor.png);
          bottom: 0;
          right: 0;
        }
        &:hover .conBtn-wrap {
          visibility: visible;
          opacity: 1;
        }
        .conBtn-wrap {
          position: absolute;
          top: 4px;
          right: 10px;
          transition: all .2s;
          opacity: 0;
          visibility: hidden;
          .edit-icon,
          .delete-icon {
            display: inline-block;
            width: 13px;
            height: 13px;
            background-size: contain;
            background-repeat: no-repeat;
          }
          .edit-icon {
            background-image: url(./img/edit-icon.png);
          }
          .delete-icon {
            margin-right: 10px;
            background-image: url(./img/delete-icon.png);
          }
        }
        &.noBG {
          box-shadow: none;
          padding: 0;
        }
        &.editWrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          p {
            text-align: right;
            width: 100%;
            font-size: 10px;
            color: #7EC4E1;
            margin: -10px 0;
            span:last-child {
              margin-left: 10px;
            }
          }
        }
      }
      .add-contactor {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .blue-font {
          color: rgba(126, 196, 225, 1);
          margin-left: 10px;
        }
        .plus-bac {
          display: inline-block;
          background: #65B6D8;
          height: 36px;
          width: 36px;
          position: relative;
          .plus-icon {
            color: #FFFFFF;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &:hover {
          outline: 1px solid #65B5D7;
        }
      }
    } // 清单
    .quantity-Ctr {
      .quantity-wrap {
        margin-bottom: 30px;
      }
      .quantity-item {
        width: 175px;
        height: 253px;
        text-align: center;
        padding-top: 23px;
        margin-top: 8px;
        cursor: pointer;
        transition: all .2s;
        &:hover {
          background-color: #E1F3FA;
        }
        .quantity-imgWrap {
          height: 146px;
          position: relative;
          img {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .quantity-info {
          font-size: 15px;
          margin: 10px 0;
          .blueBtn {
            background-color: #65B6D8;
            border: 1px solid #65B6D8;
            color: #FFFFFF;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
        .quantity-select {
          display: inline-block;
          width: 44px;
          height: 29px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(126, 196, 225, 1);
          border-radius: 10px;
          &.quantity-active {
            background: url(./img/check-quantity.png);
            border: none;
          }
        }
      }
    }
  } // 优惠券
  .coupon-none {
    height: 155px;
    line-height: 155px;
    text-align: center;
    font-size: 18px;
  }
  .coupon-Ctr {
    min-height: 155px; // max-height: 155px;
    overflow: hidden;
    transition: all .8s;
    position: relative;
    right: -7px;
    padding: 10px 0;
    margin-top: -10px;
    .coupon-PLH {
      overflow: hidden;
    }
    .coupon-item {
      width: 250px;
      height: 130px;
      margin-bottom: 35px;
      margin-left: 19px;
      position: relative;
      cursor: pointer;
      background-image: url(./img/coupon-on.png);
      background-size: cover;
      background-repeat: no-repeat;
      color: #FFFFFF;
      &.coupon-off {
        background-image: url(./img/coupon-off.png);
        .off-icon {
          width: 42px;
          height: 42px;
          background-image: url(./img/coupon-off-icon.png);
          position: absolute;
          right: 12px;
          bottom: 6px;
          z-index: 3;
        }
      }
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
        p:nth-child(1) {
          font-size: 12px;
          transform: scale(0.98);
          -webkit-transform-origin-x: 0;
          padding-top: 6px;
          padding-bottom: 2px;
        }
        p:nth-child(2) {
          font-size: 12px;
          transform: scale(0.833333);
          -webkit-transform-origin-x: 0;
          line-height: 15px;
        }
      }
    }
  }
  .submitWrap {
    height: 155px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #65B6D8;
    p {
      width: 141px;
      height: 46px;
      line-height: 46px;
      font-size: 23px;
      margin: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #FFFFFF;
      border-radius: 10px;
      background-color: #70BDDD;
      cursor: pointer;
      transition: all .2s;
      &:hover {
        background-color: rgb(134, 215, 250);
      }
    }
  }
}
</style>
