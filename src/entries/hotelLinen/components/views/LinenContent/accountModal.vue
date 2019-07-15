<!-- 查看账单 -->
<template>
  <div>
    <Modal v-model="showAccount" class-name="account-vertical-center-modal" width='830'>
      <div class="account-modal">
        <!-- 默认今日起近30天  可选180天-->
        <div style="text-align: left; margin-bottom: 10px">
          <DatePicker @on-change='startEndChange(startTime, endTime)' v-model="startTime" :options="options" type="date" placeholder="开始日期" style="width: 216px;" :clearable='false' :editable='false'></DatePicker>
          <span style="color: rgba(154,167,193,1)"> 至 </span>
          <DatePicker @on-change='startEndChange(startTime, endTime)' v-model="endTime" :options="options" type="date" placeholder="结束日期" style="width: 216px;" :clearable='false' :editable='false'></DatePicker>
        </div>
        <Table :columns="accountColumns" :data="accountList" id='tableDom' height='270'></Table>
        <div class="wrap">
        </div>
      </div>
      <div class="all" v-show="accountList.length > 0">
        <Row>
          <Col span="6" class="all-title">总计</Col>
          <Col span="6" class="all-order">{{total.totalNum}}</Col>
          <Col span="6" class="all-room-night">￥ {{total.totalPrice}}</Col>
          <Col span="6" class="all-room-mon">￥ {{total.finalPrice}}</Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>
<script>
import { formatDate, changeMoney } from 'common_libs/util.js'
import { linenApiService } from '../../../api/API.js'
export default {
  data() {
    return {
      showAccount: false,
      startTime: this.defaultStartTime(),
      endTime: this.timestampToTime(new Date()),
      total: {},
      accountColumns: [
        {
          title: '布草',
          key: 'name',
          align: 'center',
          ellipsis: true,
          className: 'demo-table-info-column for-left-border',
          render: (h, params) => {
            return h('div', [
              h('div', {
                style: {
                  color: 'rgba(154,167,193,1)',
                  width: '100%',
                  borderLeft: '2px solid #215D91'
                }
              }, params.row.name),
            ])
          },
        },
        {
          title: '件数',
          key: 'num',
          align: 'right',
          className: 'demo-table-info-column',
        },
        {
          title: '折前金额',
          key: 'totalPrice',
          align: 'right',
          className: 'demo-table-info-column',
        },
        {
          title: '实付金额',
          key: 'finalPrice',
          align: 'right',
          className: 'demo-table-info-column',
        }
      ],
      accountList: [],
      options: {
        disabledDate(date) {
          // false 为符合条件 86400000  只能选择过去180天
          let beforeThirty = 180 * 24 * 60 * 60 * 1000
          return date && date.valueOf() > Date.now()
        }
      },
    }
  },
  watch: {
    showAccount(val) {
      if (!val) {
        this.startTime = this.defaultStartTime()
        this.endTime = this.timestampToTime(new Date())
      }
    },
  },
  mounted() {
    // this.getAccountDetail()
  },
  methods: {
    // 起止早迟判断
    startEndChange(start, end) {
      console.log(777, this.startTime, this.defaultStartTime(), this.endTime, this.timestampToTime(new Date()))
      let temp = 86400000 * 180
      if (start > start) {
        this.$Message.warning('所选日期的结束时间不能早于开始时间！')
      } else if (end - start > temp) {
        this.$Message.warning('所选日期的时间跨度不能超过180天！')
        this.startTime = this.defaultStartTime()
        this.endTime = this.timestampToTime(new Date())
        console.log(888, this.startTime, this.endTime)
        this.getAccountDetail()
      } else {
        this.getAccountDetail()
      }
    },
    // 获取账单详情
    getAccountDetail() {
      let obj = {
        startDate: formatDate(this.startTime),
        endDate: formatDate(this.endTime),
      }
      linenApiService.lookForAccount(obj).then((res) => {
        if (res.code == '000000' && res.content.linenGoods) {
          for (let i = 0, len = res.content.linenGoods.length; i < len; i++) {
            res.content.linenGoods[i].finalPrice = changeMoney(res.content.linenGoods[i].finalPrice)
            res.content.linenGoods[i].totalPrice = changeMoney(res.content.linenGoods[i].totalPrice)
          }
          res.content.finalPrice = changeMoney(res.content.finalPrice)
          res.content.totalPrice = changeMoney(res.content.totalPrice)
          this.total = res.content
          this.accountList = res.content.linenGoods
        } else {
          this.total = {}
          this.accountList = []
          this.notData()
        }
      })

    },
    defaultStartTime() {
      let time = new Date() - 86400000 * 30
      return this.timestampToTime(time)
    },
    // 格式化为页面显示时间     
    timestampToTime(date) {
      var now = new Date(date);
      var yy = now.getFullYear();      //年
      var mm = now.getMonth() + 1;     //月
      var dd = now.getDate();          //日
      var clock = yy + "/";
      if (mm < 10) clock += "0";
      clock += mm + "/";
      if (dd < 10) clock += "0";
      clock += dd + "";
      return clock
    },
    notData() {
      let emptyBody = document.getElementById('tableDom').getElementsByClassName('ivu-table-tip')[0];
      emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据<br/> ...</div></div>'
    },

  }
}
</script>
<style lang='scss'>
.account-vertical-center-modal {
  .ivu-modal-body {
    padding: 16px 0 16px;
  }
}

.account-modal {
  background: #fff;
  padding: 0 16px;
  .not-data {
    overflow: hidden;
    position: relative;
    text-align: center;
    height: 230px;
    width: 100%;
    color: #999;
    font-size: 14px;
    background: url("../assets/noData.png") no-repeat 50% 14%;
  }
  .nodata-text {
    position: absolute;
    left: 47%;
    bottom: 38px;
    margin: 0 auto;
    margin-top: 335px;
  }
  .for-left-border .ivu-table-cell {
    padding-left: 0;
    padding-right: 0;
  }

  .ivu-table-wrapper {
    border: none;
  }
  .ivu-table-cell {
    padding-right: 90px;
  }
  .ivu-table-body {
    .for-left-border {
      font: 14px/30px 'STHeitiTC';
      /*STHeitiTC*/
    }
    .demo-table-info-column {
      // color: rgba(33,92,145,1);
      font: 14px 'STHeitiTC';
      /*STHeitiTC*/
      line-height: 42px;
    }
  }
  .ivu-table th {
    background: #fff;
    color: rgba(33, 92, 145, 1);
  }
  .ivu-table-body .ivu-table-cell {
    background: #fafafa;
    color: rgba(154, 167, 193, 1);
  }
  .ivu-table td,
  .ivu-table th {
    border-bottom: none;
  }
  .ivu-table-row {
    line-height: 30px;
    background-color: #fafafa; // outline: 1px solid red;
    margin-bottom: 10px;
    font-size: 16px;
    font-family: 'MicrosoftYaHei';
    border-radius: 8px;
  }
  tr.ivu-table-row-hover td .ivu-table-cell,
  .ivu-table-row-highlight td,
  {
    background-color: rgba(232, 237, 248, 1);
  }
  .ivu-table:after,
  .ivu-table:before,
  .ivu-table-row,
  tr.ivu-table-row-hover td {
    background-color: transparent;
  }
  .ivu-input-icon {
    display: none;
  }
  .ivu-input {
    text-align: center; // line-height:24px;
    color: rgba(154, 167, 193, 1);
    background: rgba(255, 255, 255, 1);
    border-radius: 12px;
    border: 1px solid rgba(154, 167, 193, 1);
    display: inline-block;
    width: 100%;
    font-size: 12px;
    border: 1px solid #dcdee2;
    position: relative;
    cursor: text;
    outline: none;
    height: 24px;
  }
  .ivu-input-icon-normal+.ivu-input {
    padding-right: 0;
  }
}

.all {
  margin-top: 5px;
  text-align: center;
  height: 42px;
  line-height: 42px;
  background: #FF9AA7C1;
  color: #fff;
  background: rgba(154, 167, 193, 1);
  border-radius: 6px;
  padding: 0 18px;
  .all-title,
  .all-order,
  .all-room-night,
  {
    font: 14px/42px 'STHeitiTC';
    /*STHeitiTC*/
    color: #FFFFFFFF;
  }
  .all-order,
  .all-room-night,
  .all-room-mon {
    text-align: right;
    padding-right: 90px;
  }
  .all-room-mon {
    font: 14px/42px 'STHeitiTC';
    /*STHeitiTC*/
    color: #FFFFFFFF
  }
}



.account-vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
  .ivu-modal-footer {
    display: none;
  }
}
</style>