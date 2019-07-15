/**
*table表格组件
**/
<template>
  <div class="tab-share">
    <Table :loading="loading" border :columns="cols" :data="dataContent" :border="false" style="border:0;background: #fff;" highlight-row :row-class-name="rowClassName" id="tableDom">
    </Table>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      loading: false,
    }
  },
  props: {
    //            width:{
    //                type:Number,
    //                default:1605 // 1643   15
    //            },
    height: {
      type: Number,
      default: 700 //每多一条数据 增加60px
    },
    url: {
      type: String,
      require: true
    },

    cols: {},
    dataContent: {
      type: Array,
      require: true,
      default: []
    },
    checkBox: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.dataContent.length == 0) {
      this.notData()
    }
  },
  watch: {
    dataContent: {
      handler(val, oldVal) {
        if (!val.length) {
          this.notData()
        }
      },
      deep: true
    }
  },
  methods: {
    notData() {
      let emptyBody = document.getElementById('tableDom').getElementsByClassName('ivu-table-tip')[0];
      emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据<br/> ...</div></div>'
    },
    rowClassName(row, index) {
      if (index >= 0) {
        return 'demo-table-info-row';
      }
      return '';
    },
    getPagingInfo(page) {
      const param = {
        current: page,
        pageSize: this.pageSize
      }
      return param
    },
    returnHeight() {
      return this.height
    }
  },


}
</script>

<style>
.tab-share .ivu-page-options-elevator input {
  text-align: center;
}

.tab-share .ivu-table:before,
.tab-share .ivu-table:after {
  background-color: transparent;
}

.tab-share .ivu-table-fixed-right::before,
.tab-share .ivu-table-fixed::before {
  background-color: transparent;
}

.tab-share .ivu-table td,
.ivu-table th {
  border-bottom: 0;
}

.tab-share .not-data {
  overflow: hidden;
  position: relative;
  text-align: center;
  height: 500px;
  width: 100%;
  color: #999;
  font-size: 14px;
  background: url("../../assets/img/noData.png") no-repeat center center;
}

.tab-share .nodata-text {
  /* position: absolute;
        left: 48%;
        bottom: 10px; */
  margin: 0 auto;
  margin-top: 335px;
}

.tab-share .ivu-table td,
.ivu-table th {
  border-top: 5px solid #fff;
}

.tab-share .ivu-table .demo-table-info-row td {
  background-color: #fafafa;
  line-height: 42px;
}

.tab-share .ivu-table th {
  background-color: #fff;
  text-align: center;
}

.tab-share .ivu-table-row {
  margin-bottom: 10px;
  line-height: 50px;
}



/*鼠标悬停样式*/

.tab-share .ivu-table-row-hover td {
  background-color: #DBE1ED!important;
}



/*选中某一行高亮*/

.tab-share .ivu-table-row-highlight td {
  background-color: #DBE1ED!important;
}

.tab-share .demo-table-info-row {
  margin-bottom: 10px;
}
</style>
