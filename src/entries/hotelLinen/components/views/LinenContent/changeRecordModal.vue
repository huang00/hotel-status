<!-- 布草变更记录 -->
<template>
  <div>
    <Modal v-model="showChangeRecords" class-name="linen-change-records" width='512' :closable='false'>
      <div class="records-modal">
        <div class="records-title">布草变更记录</div>
        <ul class='ul-content'>
          <li v-for='item in recordsList' class="a-change">
            <span class="left-line"></span>
            <div class="content-reason">
              <span class="left left-margin">变更内容：{{item.changeDetial}}</span>
              <span class="right">{{item.changeTime}}</span>
            </div>
            <div class="content-reason">
              <span class="left">修改原因： {{item.modifyReason}}</span>
              <span class="right">操作人：{{item.userName}}</span>
            </div>
          </li>
        </ul>
        <div class="bottom-btn">
          <button @click='sureBtn' class='btn'>确定</button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showChangeRecords: false,
      recordsList: []
    }
  },
  mounted() {

  },
  methods: {
    initRecords(data) {
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].changeTime = this.formatStampYMD(Number(data[i].date), 'min')
        let temp = ''
        let str = '，'
        for (let j = 0, len2 = data[i].changes.length; j < len2; j++) {
          if (data[i].changes[j].num < 0) {
            if (j == len2 - 1) {
              str = ''
            }
            temp += data[i].changes[j].goodsName + data[i].changes[j].num + str
          } else {
            if (j == len2 - 1) {
              str = ''
            }
            temp += data[i].changes[j].goodsName + '+' + data[i].changes[j].num + str
          }

        }
        console.log(60, temp)
        data[i].changeDetial = temp
      }
      this.recordsList = data
    },
    sureBtn() {
      this.showChangeRecords = false
    },
    // 时间格式化
    formatStampYMD(timestamp, type) {
      if (timestamp) {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let h = date.getHours() < 10 ? '0' + date.getHours() + ": " : date.getHours() + ": ";
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        if (type == 'hour') {
          return Y + M + D + ' ' + h
        } else if (type == 'min') {
          return Y + M + D + ' ' + h + m
        } else if (type == 'second') {
          return Y + M + D + ' ' + h + m + " : " + s
        } else {
          return Y + M + D
        }
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang='scss'>
.linen-change-records {
  padding: 16px;
  .records-modal {
    .records-title {
      font-size: 16px;
      color: rgba(33, 93, 145, 1);
      margin-bottom: 20px;
      padding-left: 10px;
    }
    .a-change {
      // outline: 1px solid red;
      position: relative;
      margin-bottom: 30px;
      padding: 0 10px;
      .left-line {
        position: absolute;
        top: 3px;
        display: inline-block;
        width: 5px;
        height: 17px;
        background: rgba(33, 93, 145, 1);
      }
      .content-reason {
        .left-margin {
          margin-bottom: 6px;
        }
        .left {
          padding-left: 15px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(102, 102, 102, 1);
          width: 60%;
          display: inline-block;
        }
        .right {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba(153, 153, 153, 1);
          line-height: 16px;
          width: 35%;
          display: inline-block;
          text-align: right;
        }
        display: flex;
        justify-content: space-between;
      }
    }
    .bottom-btn {
      margin: 0 auto 10px;
      text-align: center;
      .btn {
        width: 110px;
        font-size: 14px;
        line-height: 36px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        background: linear-gradient(270deg, rgba(138, 173, 197, 1) 0%, rgba(75, 136, 188, 1) 100%);
        box-shadow: 2px 2px 8px 0px rgba(56, 120, 178, 0.33);
        border-radius: 17px;
        cursor: pointer;
      }
    }
    .ul-content {
      overflow-y: auto;
      height: 300px;
    }
  }
  .ivu-modal-footer {
    display: none;
  }
  /*滚动条样式*/
  .ul-content::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    /*height: 10px;*/
  }
  .ul-content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #fafafa;
  }
  .ul-content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>