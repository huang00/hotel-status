<!-- 服务协议 -->
<template>
  <div class="agreement-contant">
    <div class="heads">
      <div>成都疯特科技有限公司</div>
      <div>（布草洗涤协议）</div>
    </div>
    <div class="agents">甲方：</div>
    <div class="agents">乙方：成都疯特科技有限公司</div>

    <div class="first-title">
      根据《中华人民共和国合同法》及其他有关法律、法规的规定，甲乙双方在平等自愿，协商一致的基础上就布草洗涤服务达成如下协议：
    </div>
    <div class="first-title">
      （一）甲方必须将所需洗涤的布草物品集中并清点数量，乙方当天派人到接送点收取。乙方工作人员和甲方工作人员交接布草数目要核对清楚。
    </div>
    <div class="first-title">
      （二）甲方应提供免费停车位予乙方收送布草等洗涤物品的运输车辆停放。
    </div>
    <div class="first-title">
      （三）乙方在布草收接过程中，如发现甲方送洗物因使用不当而造成非正常的严重污损，损坏以及染色、褪色、缩水等现象，乙方有权提出拒收，待甲方确认后，乙方方可收洗这部分物件，并且洗涤质量不佳和破损的后果应由甲方负责，送洗物的品种、数量核对以后则需甲方在线上确定，每月结算则以线上数据为准。
    </div>
    <div class="first-title">
      （四）乙方收洗甲方的布草原则上24小时内送回甲方（因道路交通情况，或其它不可预知的突发事件影响或推迟1~3小时送回应视为正常)。甲方节假日或大型接待，因布草不够周转而要求乙方加急洗涤并提前送还的，乙方可根据自身生产情况，尽可能满足。
    </div>
    <div class="first-title">
      （五）洗涤费结算以每月1日至月底为一个结算月，每月5日由乙方制表交甲方核对确认上月全月洗涤品种、数量，金额后，由甲方有关人员在乙方洗涤对账表上签名确认并交回一份给乙方。 对账后甲方每月10 日-15日将上月洗涤款项支付给乙方，如甲方回避对账超过一个月或在洗涤对账表上签名确认后超过一月以上仍未付清乙方洗涤费用，乙方有权停止对甲方提供洗济服务且乙方可将承接的所有洗涤物品留置，双方协商解决后返还。
    </div>
    <div class="first-title">
      （六）甲方新投入的布草，由乙方在新布草上盖上投放日期，以便跟踪布草的使用寿命。
    </div>
    <div class="first-title">
      （七）布草赔偿事项：
      <div class="second-title">
        1、因布草质量新旧程度不一，污渍的轻重不同，经过一段时间的洗涤，布草出现不同程度的破损，甲方应及时以更换超出保质期的产品，不在乙方赔偿范围内。
      </div>
      <div class="second-title">
        2、保质期内，由乙方原因造成布草的破报，遗失，换错，染色等情况，根据物品的使用周期长短，新旧布科质量等按酒店布草原始进货价格进行赔赔偿。
        <div class="third-title">
          1>床单类布草：1-4个月按100%赔偿，5-8个月按60%赔，9-12个月按40%赔偿，12个月后不再承担破损赔偿。
        </div>
        <div class="third-title">
          2>毛巾类布草：1-4个月按100%赔偿。5-8个月按60%赔偿，9-12个月按40%赔偿，。12个月后不再承担耗损赔偿。
        </div>
        <div class="third-title">
          3>甲方每次投入新布草应事先通知乙方，并由双方协商做好标记以便双方确认区分，否则出现任何差错乙方不付责任。双方合作之后，有旧布草乙方接受手后洗涤过程中洗涤的布草褪色均不属于赔偿范围。
        </div>
        <div class="third-title">
          4>由于有色布草的特殊性，经过一段时间的正常洗涤后，所出现的整体褪色属于正常现象，乙方不承担赔偿。甲方交由乙方进行特殊处理的有色布草如有褪色的情况，乙方不承担赔偿责任。
        </div>
        <div class="third-title">
          5>因甲方原因造成的布草重污染而不能正常洗涤需特殊处理的，处理时造成布草破损的，乙方不负责赔偿。
        </div>

      </div>
    </div>
    <div class="first-title">
      （八）如甲方单位更改名称时，应告知乙方并结清洗涤款。
    </div>
    <div v-if='hadRead' class="had-read-agreement">已阅读并同意本协议</div>
    <div v-else @click='agreeBtn' class="read-agreement">阅读并同意本协议</div>
    <div @click='goBack' class="re-back">返回
      <Icon type="ios-arrow-forward" />
    </div>

  </div>
</template>
<script>
import router from '../../../router';
import { linenApiService } from "../../../api/API";
export default {
  data() {
    return {
      hadRead: false,
      routerFrom: {
        flag: null,
        from: null,
      },
    }
  },
  mounted() {
    // 下单前查看 是否已经同意过协议
    this.findAgreementStatus()
    this.routerFrom.flag = this.$route.query.flag
    this.routerFrom.from = this.$route.query.from
  },
  methods: {
    //同意协议
    agreeBtn() {
      //GET 
      let obj = {
        agreementId: 1, // 1 对应的是布草协议
        agreementStatus: 1
      }
      linenApiService.agreeLinenAgreement(obj).then(res => {
        if (res.code === '000000') {
          if (this.routerFrom.from == 'agree') {
            router.push('/')
          }
          if (this.routerFrom.from == 'order') {
            router.push('linenCart')
          }
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    //返回
    goBack() {
      router.push('/');
    },

    findAgreementStatus() {
      let obj = {
        agreementId: 1, // 1 对应的是布草协议
      }
      linenApiService.ifHadAgreeAgreement(obj).then(res => {
        if (res.code === '000000' && res.content) {
          if (res.content.agreementStatus == 1 && res.content.agreementId == '1') {
            this.hadRead = true
          } else {
            this.hadRead = false
          }
        }
      })
    }
  }
}
</script>
<style lang='scss'>
.agreement-contant {
  padding: 20px 120px;
  .heads {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .agents {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .first-title {
    // text-indent: 38px;
    word-wrap: break-word;
    word-break: normal;
    font-size: 18px;
    margin-bottom: 20px;
    line-height: 20px;
    line-height: 34px;
    .second-title {
      text-indent: 20px;
      word-wrap: break-word;
      word-break: normal;
      font-size: 16px;
      .third-title {
        text-indent: 30px;
        word-wrap: break-word;
        word-break: normal;
        font-size: 16px;
      }
    }
  }
  .read-agreement {
    margin: 20px auto 10px;
    width: 160px;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    font-family: MicrosoftYaHei;
    background: linear-gradient(270deg, rgba(138, 173, 197, 1) 0%, rgba(75, 136, 188, 1) 100%);
    box-shadow: 2px 2px 8px 0px rgba(56, 120, 178, 0.33);
    border-radius: 17px;
    cursor: pointer;
  }
  .had-read-agreement {
    margin: 20px auto 10px;
    text-align: center;
    width: 160px;
    font-size: 14px;
    line-height: 36px;
    color: rgba(153, 153, 153, 1);
    font-family: MicrosoftYaHei;
    background: linear-gradient(270deg, rgba(243, 243, 243, 1) 0%, rgba(224, 224, 224, 1) 100%);
    box-shadow: 2px 2px 8px 0px rgba(183, 183, 183, 0.34);
    border-radius: 17px;
  }
  .re-back {
    margin: 0 auto 5px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(23, 86, 140, 1);
    line-height: 19px;
    text-align: center;
    cursor: pointer;
  }
}
</style>