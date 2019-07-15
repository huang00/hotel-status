<template>
  <Modal class-name='custom-m' class="custom-modal" width='402' v-model="showCustomModal" footer-hide>
    <div class='title'>联系我们</div>
    <div>
      <div style=" margin-bottom: 18px;">
        <span class='icon-pub icon-phone'></span>
        <span class='icon-tex'>客服电话： 400-100-5555</span>
      </div>
      <div>
        <span class="icon-pub icon-qq "></span>
        <span class='icon-tex'>线上客服：
          <a class="qq-talk " href="tencent://message/?uin=1701571186&Site=疯特&Menu=yes" title="客服QQ:1701571186 ">
            QQ交谈
          </a>
        </span>
      </div>
      <div class="work-time ">工作时间：9:00 - 18:00</div>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      showCustomModal: false
    }
  },
  methods: {

  }
}
</script>

<style lang='scss'>
.custom-modal {
  // height: 200px;
  .title {
    color: #215D91;
    font-size: 16px;
    padding: 10px 24px 39px;
  }
  .icon-pub {
    display: inline-block;
    margin: auto 13px auto 73px;
    background-size: 100%;
    vertical-align: middle;
  }
  .icon-phone {
    width: 19px;
    height: 22px;
    background: url('./image/phone.png') no-repeat;
  }
  .icon-qq {
    width: 18px;
    height: 21px;
    background: url('./image/qq.png') no-repeat;
  }
  .icon-tex {
    color: #666;
    font-size: 14px;
  }
  .qq-talk {
    display: inline-block;
    font-size: 12px;
    color: #fff;
    text-align: center;
    width: 68px;
    cursor: pointer;
    line-height: 26px;
    background: linear-gradient(270deg, rgba(138, 173, 197, 1) 0%, rgba(75, 136, 188, 1) 100%);
    box-shadow: 0px 2px 9px 0px rgba(76, 136, 152, 0.15);
    border-radius: 13px;
  }
  .work-time {
    font-size: 12px;
    color: #999;
    margin: 3px auto auto 105px;
  }
  .ivu-modal-body {
    padding: 0 0 47px 0;
  }
}

.custom-m {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>

