<template>
  <div>
    <div class="textWrap">
      <p>
        <span>疯特布草洗涤</span>
        <span @click='goAgreement' class="agreement">
          <Icon type="ios-paper-outline" />服务协议</span>
      </p>
      <p>将舒适带到每一处</p>
      <p>
        <span>优惠券疯狂送</span>
        <span>特惠低至40元</span>
      </p>
    </div>
    <img class="linenBg" src="./img/LinenBg.png" alt="">
    <div class="listCtn">
      <p class="title">优惠价格：</p>
      <div :class="{
                    'listWrap': true,
                    'listWrap-extend': extendList
                }">
        <div class="productWrap">
          <div class="productItem" v-for="item in productList" :key="item.id">
            <img :src="item.imgSrc" :class="['productImg', 'productImg_' + item.id]">
            <p class="productName">
              {{item.name}}
            </p>
            <p class="productPrice">
              ￥
              <span style="color: #fc2b2b;">{{toDecimal2(item.price / 100)}}</span>
            </p>
          </div>
        </div>
        <div class="extend-wrap">
          <p @click="extendList = !extendList">
            <span v-if="extendList">收起更多优惠价格
              <Icon type="ios-arrow-up" />
            </span>
            <span v-else>查看更多优惠价格
              <Icon type="ios-arrow-down" />
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="btnWrap">
      <div class="confirmBtn" @click="toLinenCart">立即下单</div>
      <p class="listBtn" @click="toLinenOrderList">查看订单列表
        <Icon type="ios-arrow-forward" />
      </p>
    </div>
  </div>
</template>

<script>
import router from '../../../router';
import { linenApiService } from "../../../api/API";

import { toDecimal2 } from "common_libs/util.js";

export default {
  name: 'linenContent',
  data() {
    return {
      toDecimal2,
      extendList: false,
      // ifHadAgree: false,

      productList: []
    }
  },
  components: {

  },

  methods: {
    toLinenCart() {
      // 下单前查看 是否已经同意过协议
      let obj = {
        agreementId: 1, // 1 对应的是布草协议
      }
      linenApiService.ifHadAgreeAgreement(obj).then(res => {
        // 900816 用户未同意该协议
        if (res.code == '900816') {
          router.push({ path: 'agreement', query: { flag: false, from: 'order' } })
        } else if (res.code === '000000' && res.content) {
          if (res.content.agreementStatus == 1 && res.content.agreementId == '1') {
            router.push('linenCart')
          } else {
            router.push({ path: 'agreement', query: { flag: false, from: 'order' } })
          }
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    toLinenOrderList() {
      router.push('linenOrderList');
    },
    // 
    goAgreement() {
      let flag = false
      let obj = {
        agreementId: 1, // 1 对应的是布草协议
      }
      linenApiService.ifHadAgreeAgreement(obj).then(res => {
        if (res.code === '000000' && res.content) {
          if (res.content.agreementStatus == 1 && res.content.agreementId == '1') {
            flag = true
          } else {
            flag = false
          }
        }
      })
      router.push({ path: 'agreement', query: { flag, from: 'agree' } })
    }
  },
  created() {
    linenApiService.getLinenProduct({
      num: 10000,
      page: 1
    }).then(res => {
      if (res.code === '000000' && res.content)
        this.productList = res.content.datas
    })
  },
}
</script>

<style scoped lang="scss">
.textWrap {
  // outline: 1px solid red;
  text-align: center;
  margin: 50px auto 0;
  width: 100%;
  color: #65B7D9;
  letter-spacing: 2px;
  line-height: 70px;
  p:nth-child(1) {
    font-size: 48px;
    position: relative;
    .agreement {
      position: absolute;
      right: 20px;
      top: -15px;
      font-size: 14px;
      cursor: pointer;
      vertical-align: text-bottom;
    }
  }
  p:nth-child(2) {
    font-size: 24px;
  }
  p:nth-child(3) {
    font-size: 24px;
    span:last-child {
      display: inline-block;
      margin-left: 35px;
      width: 185px;
      height: 50px;
      line-height: 50px;
      color: #FFFFFF;
      background: rgba(101, 183, 217, 1);
    }
  }
}

.linenBg {
  display: block;
  margin: 40px auto 30px;
}

.btnWrap {
  margin: auto;
  position: relative;
  height: 120px;
  .confirmBtn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 141px;
    height: 45px;
    background: rgba(112, 189, 221, 1);
    border-radius: 10px;
    font-size: 24px;
    color: #FFFFFF;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
    transition: all .2s;
    &:hover {
      background-color: #148CED; //#148CED  rgb(134, 215, 250)
    }
  }
  .listBtn {
    font-size: 18px;
    color: #65B7D9;
    text-align: center;
    cursor: pointer;
    position: absolute;
    left: 57%;
    top: 50%;
    transform: translateY(-50%);
  }
}

.listCtn {
  width: 1062px;
  margin: auto;
  .title {
    font-size: 16px;
    padding-left: 5px;
  }
  .listWrap {
    height: 400px;
    overflow: hidden;
    margin: 5px 0;
    padding: 15px 0;
    border-top: 1px solid #7EC4E1;
    border-bottom: 1px solid #7EC4E1;
    position: relative;
    transition: all .5s;
    .productWrap {
      margin: auto;
      width: 1047px;
      .productItem {
        text-align: center;
        width: 16%;
        margin: 0 2px;
        display: inline-block;
        color: #000;
        padding: 10px 0;
        height: 168px;
        .productImg {
          &.productImg_3 {
            width: 116px;
            height: 84px;
          }
        }
        .productName {
          margin-top: 10px;
        }
        .productPrice {
          margin-top: 10px;
        }
      }
    }
    .extend-wrap {
      background-color: #FFFFFF;
      width: 1062px;
      text-align: right;
      position: absolute;
      bottom: 0;
      padding-top: 20px;
      padding-bottom: 5px;
      p {
        float: right;
        font-size: 14px;
        cursor: pointer;
      }
    }
    &.listWrap-extend {
      height: 1305px;
    }
  }
}
</style>
