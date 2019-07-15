<template>
  <div class="confirmProtocolModal">
    <p>赫程直连开通后：</p>
    <ul>
      <li v-for="(item, index) in protocolList" :key="index">
        <span class="checkbox" @click="item.selected = !item.selected">
              <img v-if="item.selected" src="./img/checked.png" width="24" height="24">
              <img v-else src="./img/check.png" height="24" width="24">
          </span>{{ item.txt }}
        </li>
    </ul>
    <p class="operation">
      <button @click="goOn(false)" v-if="!agree">暂不直连</button>
      <button :class="agree ? '':'disabled'" @click="goOn(true)">我已知晓，确认继续直连</button>
    </p>
  </div>
</template>

<script>

export default {
  name: 'confirmProtocolModal',
  data () {
    return {
      agree: false,
      protocolList: [
        { selected: false, txt: '赫程eBooking的房价和房态页面会显示直连的标识。' },
        { selected: false, txt: '赫程eBooking的房价、房量、房态需要在赫程eBooking进行修改' },
        { selected: false, txt: '赫程订单会通过众荟客栈管家中的房量房态进行自动确认。' },
        { selected: false, txt: '赫程的直连订单在取消后，赫程eBooking将接受不到取消通知。' },
        { selected: false, txt: '赫程预留的保留房只能通过赫程的业务经理进行开关，赫程客服和eBooking均无法进行设置。' },
        { selected: false, txt: '疯特民宿管家的订单在办理入住、离店后、会将订单状态同步至赫程，自动进行入住审核和离店审核。' }
      ]
    }
  },
  methods: {
    goOn (boo) {
      if (boo && !this.agree) {
        return false
      }
      this.$emit('on-allselected', this.agree)
    }
  },
  watch: {
    protocolList: {
      handler (val) {
        let all = val.every(item => item.selected)
        this.agree = all
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .confirmProtocolModal {
    font-size: 15px;
    ul {
      li {
        line-height: 25px;
        margin-top: 10px;
        .checkbox {
          vertical-align: middle;
          padding-bottom: 3px;
          display: inline-block;
          img { display: block; }
          margin-right: 5px;
          cursor: pointer;
        }
      }
    }
    .operation {
      text-align: center;
      margin-top: 35px;
      button {
        border: 0;
        border-radius: 6px;
        margin: 0 5px;
        font-size: 16px;
        line-height: 32px;
        padding: 0 10px;
        border: 1px solid #dddee1;
        background: white;
      }
      button.disabled {
        background: #dddee1;
        color: #bbbec4;
      }
    }
  }
</style>

