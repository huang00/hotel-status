<template>
  <div>
    <div class="header-tab">
      <div class="tab-wrap">
        <p v-for="item in orderStatus" :key="item.status" @click="!item.active && switchTab(item)" :class="{ 'active': item.active }">{{item.name}} </p>
        <span @click='lookAccount' class="look-order">查看账单</span>
      </div>
    </div>
    <div class="linen-table-Ctr">
      <Table :columns="columns" :data="orderListObj.datas" :loading="listLoading"></Table>
    </div>
    <div class="pagination-wrap">
      <Page :page-size="orderListObj.pageSize" :total="orderListObj.total" @on-change="(page) => refreshOrderList(page)" />
    </div>
    <AccountModal ref='accountModal'></AccountModal>
  </div>
</template>

<script>
import { linenApiService } from "../../../api/API";
import { formatDate, formatStamp, toDecimal2 } from "common_libs/util.js";
import AccountModal from './accountModal.vue'

export default {
  name: 'LinenOrderList',
  data() {
    return {
      // view data
      listLoading: false,
      curStatus: null,
      orderStatus: [
        { name: '全部订单', status: null, active: true },
        { name: '待分配', status: 10, active: false },
        { name: '待上门', status: 20, active: false },
        { name: '待确认', status: 30, active: false },
        { name: '送洗中', status: 40, active: false },
        { name: '待签收', status: 50, active: false },
        { name: '已完成', status: 60, active: false },
        { name: '已取消', status: 70, active: false },
      ],
      columns: [
        {
          title: '订单信息', key: 'id', width: 340,
          render: (h, { row }) => {
            return <div class="orderInfo">
              <div class="img-wrap"><img src={row.imgSrc} /></div>
              <div class="info-wrap">
                <p class="orderTime">{formatStamp(row.createdTime, "yyyy-MM-dd hh:mm")}</p>
                <p>订单号： {row.orderSn}</p>
                {row.linenDetail === null && <p class="orderNum"></p>}
                <p class="orderNum">
                  {row.linenDetail !== null && row.linenNum ? `共${row.linenNum}件布草` : `${row.vagueNum}件`}
                </p>
                {
                  row.linenDetail !== null &&
                  <p class="orderPrice">
                    ￥{toDecimal2(row.finalPrice / 100)}
                    {row.finalPrice != row.oldPrice && <span class="oldPrice">￥{toDecimal2(row.oldPrice / 100)}</span>}
                  </p>
                }
              </div>
            </div>
          }
        },
        { title: '联系人', key: 'contactName', align: 'center', width: 130 },
        { title: '预约时间', key: 'reserveTime', align: 'center', render: (h, { row }) => (<span>{formatDate(row.reserveTime)}</span>) },
        {
          title: '状态', key: 'status', align: 'center', render: (h, { row }) => {
            const status = this.orderStatus.find(item => item.status === row.status);
            return <span>{status ? status.name : `未知状态${row.status}`}</span>;
          }
        },
        {
          title: '操作', key: 'id', align: 'center', width: 300,
          render: (h, { row }) => {
            return <div class="btn-wrap">
              {row.status === 10 && <i-button onClick={() => this.setLinenOrder(row.id, 'cancel')} type="error" ghost>取消订单</i-button>}
              {row.status === 30 && <i-button onClick={() => this.setLinenOrder(row.id, 'makesure')} type="info" ghost>确认订单</i-button>}
              {row.status === 50 && <i-button onClick={() => this.setLinenOrder(row.id, 'receive')} type="info" ghost>签收</i-button>}
              <i-button onClick={() => this.toDetail(row.id)}>查看详情</i-button>
            </div>
          }
        },
      ],
      // source data
      orderListObj: {
        datas: [],
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
    }
  },
  components: {
    AccountModal
  },
  methods: {
    // 查看订单
    lookAccount() {
      this.$refs.accountModal.showAccount = true
      this.$refs.accountModal.getAccountDetail()

    },
    toDecimal2(num) {
      return toDecimal2(num)
    },
    switchTab(tab) {
      this.orderStatus.forEach(item => {
        item.active = false;
      });
      tab.active = true;
      this.curStatus = tab.status;
      this.refreshOrderList(1, this.orderListObj.pageSize, tab.status);
    },
    toDetail(orderId) {
      this.$router.push({
        name: 'linenDetail',
        params: { orderId }
      })
    },

    // HTTP Request Methods
    refreshOrderList(page = 1, num = 5, status = this.curStatus) {
      this.listLoading = true;
      linenApiService.getLinenOrderList({
        page, num, linenStatus: status,
      }).then(res => {
        if (res && res.content) {
          let temp = res.content.datas
          for (let i = 0, len = temp.length; i < len; i++) {
            if (temp[i].finalPrice == 0) {
              temp[i].finalPrice = temp[i].oldPrice
            }
          }
          this.orderListObj = res.content;
        }
        this.listLoading = false;
      });
    },
    setLinenOrder(orderId, type) {
      let message = "确认该操作？";
      if (type === 'cancel') message = "是否取消该订单？";
      if (type === 'makesure') message = "是否确认该订单？";
      if (type === 'receive') message = "确认签收该订单？";
      this.$Modal.confirm({
        title: message,
        // content: '操作将不可逆',
        loading: true,
        onOk: () => {
          linenApiService.setLinenOrder({
            orderId, op: type,
          }).then(res => {
            this.$Modal.remove();
            if (res.code === '000000') {
              this.refreshOrderList(this.orderListObj.pageNum);
              this.$Message.success(res.message);
            } else {
              this.$Message.warning(res.message);
            }
          });
        }
      });
    }
  },
  created() {
    this.refreshOrderList();
  },
}
</script>

<style lang="scss">
.linen-table-Ctr {
  // start - 修改iView table样式
  .ivu-table-wrapper {
    border: none;
    .ivu-table {
      min-height: 657px;
      &::before {
        content: none;
      }
      &::after {
        content: none;
      }
      th {
        text-align: center;
        background-color: #F4FAFE;
        height: 48px;
        font-size: 14px;
        border: none;
      }
      td {
        border-bottom: 1px solid #65B7D9;
      }
      tr {
        font-size: 14px;
        &.ivu-table-row-hover td {
          background-color: #F4FAFE;
        }
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  } // end
  .orderInfo {
    position: relative;
    .img-wrap {
      width: 88px;
      height: 115px;
      position: relative;
      display: inline-block;
      img {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .info-wrap {
      display: inline-block;
      margin-left: 24px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      p {
        min-height: 15px;
        &.orderNum {
          color: #65B7D9;
          font-weight: bold;
        }
        &.orderPrice {
          color: #FC2B2B;
          .oldPrice {
            font-weight: normal;
            color: #C4C4C4;
            font-size: 12px;
            text-decoration: line-through;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .btn-wrap {
    display: inline-block;
    width: 122px;
    padding: 6px 0;
    button {
      display: block;
      width: 122px;
      height: 36px;
      margin-top: 14px;
      border-radius: 6px;
      &:first-child {
        margin-top: 0;
      }
      font-size:14px;
      &.ivu-btn-default {
        border-color: #BABABA;
        color: #000000;
      }
      &.ivu-btn-error {
        border-color: #BABABA;
      }
    }
  }
}
</style>

<style scoped lang="scss">
.header-tab {
  width: 100%;
  height: 46px;
  padding-top: 6px;
  background-color: #F4FAFE;
}

.tab-wrap {
  width: 1111px;
  margin: auto;
  display: flex;
  p+p {
    margin-left: 20px;
  }
  p {
    padding: 0 10px;
    width: 80px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    transition: all .2s;
    text-align: center;
    cursor: pointer;
    position: relative;
    &:hover {
      background-color: rgb(198, 232, 255);
    }
    &.active {
      background-color: #FFFFFF;
      color: #65B7D9;
      &::after {
        content: '';
        width: 100%;
        height: 3px;
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #65B7D9;
      }
    }
  }
  .look-order {
    font-size: 14px;
    line-height: 38px;
    text-decoration: underline;
    margin-left: 24%;
    cursor: pointer;
  }
}

.linen-table-Ctr,
.pagination-wrap {
  width: 1111px;
  margin: 30px auto;
}

.pagination-wrap {
  margin-bottom: 50px;
  text-align: center;
}
</style>
