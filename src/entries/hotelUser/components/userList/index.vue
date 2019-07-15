<template>
  <div class='user-box'>

    <div class="dis-flex">
      <div class='user-top'>
        <!-- 最大30个字符 -->
        <Input v-model.trim="searchInput" @keyup.enter.native='searchBtn' placeholder="输入姓名、电话" clearable style="width: 200px" />
        <Button @click='searchBtn' class="search-btn" type="text">
          <Icon class="search-icon" type="md-search" />
        </Button>
        <!-- <div style="min-width: 200px;display: inline-block;">
          <Select  @on-change='changeHotel' v-model="selectVal" :class="{over5: selectVal.length >= 5, gdt: true}" 
            style="display:inline-block;min-width: 200px;" multiple>
            <Option v-for="item in hotelList" :value="item.innId" :key="item.innId">{{ item.innName }}</Option>
          </Select>
        </div> -->
        <div class='select-div'  >
          <Select  multiple @on-change="changeHotel"  v-model="selectVal" class='gdt' style="width:200px;position:relative" placeholder="全部客栈">
              <Option v-for="item in hotelList" :value="item.innId" :title='item.innName' :key="item.id">{{ item.innName }}</Option>
          </Select>
        </div>
      </div>
      <div @click='addUserBtn' class="add-user">
        添加客户
      </div>
    </div>
    <div class="table-box">
      <UserTable :cols="hotelHead" :dataContent="hotelData"></UserTable>
      <Page v-show='showPage' ref='child' :total="totals" :page-size="pageSize" :current.sync="current" @on-change="curPageNum" style="text-align: center;padding: 24px 0 21px;" />
      <!-- <TPage ref='child' :total="totals" :pageNum.sync="current"  @curPage="curPageNum" style="padding: 24px 0 21px;" ></TPage> -->
    </div>
    <AddUserModal ref='showAddUser'></AddUserModal>
    <LookDetail ref='showLookDetail'></LookDetail>
  </div>
</template>
<script>
import { formatStampYMD, changeMoney } from '../../libs/util.js'
import px from '../../assets/img/px.png'
import { hotelUserApiSercers } from '../../api/API'
import AddUserModal from './addUser'
import LookDetail from './lookDetail'

import UserTable from '../pubComponents/table'
import TPage from '../pubComponents/tPage'
export default {
  components: {
    UserTable,
    TPage,
    AddUserModal,
    LookDetail
  },
  data() {
    return {
      innIds: [],
      search: '',
      sort: false,
      sortOrd: false,
      totals: 0,
      pageNum: 1,
      pageSize: 20,
      current: 1,
      showPage: false,
      searchInput: '',
      selectVal: [],
      hotelList: [
        // {
        //   innId: '137',
        //   innName: '九九客栈',
        // },
      ],
      hotelHead: [
        {
          title: '客户名称',
          key: 'name',
          align: 'center',
          className: 'operate-time-color for-left-border',
          // ellipsis: true,
          width: 150,
          fixed: 'left',
          render: (h, params) => {
            if (params.row.name == '' || params.row.name == null) {
              return h('div', [
                h('span', {
                }, '-')
              ],
              )
            } else {
              let textDetail = params.row.name || ''
              return h('div', [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  },
                  attrs: {
                    class: 'kezhan-yc',
                  },
                  style: {
                    height: '40px',
                  }
                }, [//这个中括号表示是Tooltip标签的子标签
                    textDetail,//表格列显示文字
                    h('div', {
                      slot: 'content',
                      style: {
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                      }
                    }, textDetail)//params.row.hotel)
                  ])
              ])
            }
          }
        },
        {
          title: '联系电话',
          key: 'phone',
          align: 'center',
          width: 230,
          ellipsis: true,
          className: 'demo-table-info-column',
        },
        {
          title: '生日',
          key: 'birthday',
          align: 'center',
          width: 150,
          className: 'demo-table-info-column',
        }, {
          title: '性别',
          width: 150,
          key: 'gender',
          align: 'center',
          className: 'demo-table-info-column',
        },
        {
          title: '客栈',
          key: 'hotel',
          width: 170,
          align: 'center',
          className: 'demo-table-info-column',
          render: (h, params) => {
            if (params.row.innNames == [] || params.row.innNames == null) {
              return h('div', [
                h('span', {
                }, params.row.innNames)
              ],
              )
            } else {
              let textDetail = ''
              
              let str = '、'
              for (let i in params.row.innNames) {
                if (i == params.row.innNames.length - 1) {
                  str = ''
                }
                textDetail += params.row.innNames[i].innName + str
              }
              let strLen = this.bitChangeFunc(textDetail)
              return h('div', {
                attrs: {
                    class: 'hidd',
                  },
              }, [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  },
                  attrs: {
                    class: 'kezhan-yc',
                  },
                  style: {
                    whiteSpace: strLen > 12 ? 'break-all' : 'normal',
                    wordBreak: strLen > 12 ? 'break-all' : 'normal',
                    lineHeight: strLen > 12 ? '20px' : '40px',
                  }
                }, [//这个中括号表示是Tooltip标签的子标签
                    textDetail,//表格列显示文字
                    h('div', {
                      slot: 'content',
                      style: {
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                      }
                    }, textDetail)//params.row.hotel)
                  ])
              ])
            }
          }
        },
        {
          // title: '入住间夜',
          key: 'roomNight',
          align: 'center',
          width: 150,
          className: 'demo-table-info-column',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', '入住间夜'),
              h('img', {
                attrs: {
                  src: px,
                },
                style: {
                  display: 'inline-block',
                  width: '12px',
                  height: '13px',
                  verticalAlign: 'middle',
                  margin: '0 0 0 10px',
                  cursor: 'pointer',
                },
                on: {
                  click: () => {
                    this.sortNeight()
                  }
                }
              }),
            ])
          },
        },
        {
          title: '房费金额',
          key: 'roomAmount',
          align: 'center',
          width: 180,
          className: 'demo-table-info-column',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', '房费金额'),
              h('img', {
                attrs: {
                  src: px,
                },
                style: {
                  display: 'inline-block',
                  width: '12px',
                  height: '13px',
                  verticalAlign: 'middle',
                  margin: '0 0 0 10px',
                  cursor: 'pointer',
                },
                on: {
                  click: () => {
                    this.sortFf()
                    // console.log('房费金额')
                  }
                }
              }),

            ])
          },

        }, {
          // title: '最近入住',
          key: 'checkInDate',
          align: 'center',
          width: 180,
          className: 'demo-table-info-column',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', '最近入住'),
              h('img', {
                attrs: {
                  src: px,
                },
                style: {
                  display: 'inline-block',
                  width: '12px',
                  height: '13px',
                  verticalAlign: 'middle',
                  margin: '0 0 0 10px',
                  cursor: 'pointer',
                },
                on: {
                  click: () => {
                    this.sortCheckIn()
                    // console.log('最近入住')
                  }
                }
              }),

            ])
          },
        },
        {
          title: '备注',
          key: 'remarks',
          align: 'center',
          width: 160,
          className: 'demo-table-info-column',
          render: (h, params) => {
            if (params.row.remarks == '' || params.row.remarks == null) {
              return h('div', [
                h('span', {
                }, '-')
              ],
              )
            } else {
              let textDetail = params.row.remarks || ''
              let strLen = this.bitChangeFunc(textDetail)
              return h('div', {
                attrs: {
                  class: 'hidd',
                },
                style: {
                  padding: '0 12px',
                }
              }, [
                h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  },
                  attrs: {
                    class: 'kezhan-yc',
                  },
                  style: {
                    whiteSpace: strLen > 12 ? 'break-all' : 'normal',
                    wordBreak: strLen > 12 ? 'break-all' : 'normal',
                    height: '40px',
                    // height: strLen > 12 ? '20px' : '40px',
                  }
                }, [//这个中括号表示是Tooltip标签的子标签
                    textDetail,//表格列显示文字
                    h('div', {
                      slot: 'content',
                      style: {
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                      }
                    }, textDetail)//params.row.hotel)
                  ])
              ])
            }

          }
        },
        {
          title: '操作',
          key: '查看',
          fixed: 'right',
          align: 'center',
          width: 112,
          className: 'demo-table-info-column',
          render: (h, params) => {
            // 点击获取订单详情
            return this.clickOrderDetail(h, params, 'orderDetail')
          }
        }
      ],
      hotelData: [],
    }
  },
  created() {
    this.getAllHotelList()
    this.curPageNum(1)
  },
  methods: {
    // 中英文字节控制 是否换行
    bitChangeFunc (str) {
      let len = 0
      if (str.match(/[^ -~]/g) == null) { 
        len = str.length; 
      }  else  { 
        len = str.length + str.match(/[^ -~]/g).length; 
      } 
      return len; 
    },
    // 获取全部客栈
    getAllHotelList() {
      hotelUserApiSercers.getAllHotel({}).then((res) => {
        if (res.code == '000000' && res.content) {
          this.hotelList = res.content
        } 
      })
    },

    // 输入姓名 手机号
    searchBtn() {
      this.sort = false
      this.sortOrd = false
      if(this.searchInput.length > 30) {
        this.$Message.warning('输入字符长度不能超过30')
      } else {
        this.curPageNum(1)
      }
    },
    //切换客栈
    changeHotel(val) {
      // console.log(316, val)
      this.sort = false
      this.sortOrd = false
      this.curPageNum(1)
    },
    curPageNum(page, flag) {
      //被排序后 新增用户时 回到最初的默认排序
      if (flag) {
        this.sort = false
        this.sortOrd = false
        this.searchInput = ''
        this.selectVal = []
      }
      this.current = page
      let obj = {
        pageNum: page,
        pageSize: this.pageSize,
      }
      // 按客栈搜索
      if (this.selectVal.length) {
        obj.innIds = this.selectVal
      }
      // 搜索关键字
      if (this.searchInput.length) {
        obj.search = this.searchInput
      }
      if (this.sort && this.sortOrd) {
        obj.sort = this.sort
        obj.sortOrd = this.sortOrd
      }
      this.initClient(obj)
    },
    initClient(obj) {
      hotelUserApiSercers.getClinentList(obj).then((res) => {
        if (res.code == '000000' && res.content.datas) {
          let temp = res.content.datas
          this.totals = res.content.total
          for (let i = 0, len = temp.length; i < len; i++) {
            if (temp[i].gender) {
              temp[i].gender  = temp[i].gender == 'man' ? '男' : '女'
            } else {
              temp[i].gender = '-'
            }
            temp[i].birthday = formatStampYMD(Number(temp[i].birthday)) || '-'
            temp[i].checkInDate = formatStampYMD(Number(temp[i].checkInDate)) || '-'
            if (!temp[i].roomNight) {
              if (temp[i].roomNight !== 0) {
                temp[i].roomNight = '-'
              }
            }
            if (!temp[i].roomAmount) {
              if (temp[i].roomAmount !== 0) {
                temp[i].roomAmount = '-'
              }
            } else {
              temp[i].roomAmount  = temp[i].roomAmount ? '￥' + changeMoney(temp[i].roomAmount) : '-'
            }
            // temp[i].roomAmount =  temp[i].roomAmount ? '￥' + changeMoney(temp[i].roomAmount) : '-'
            let attr = temp[i].telephoneNumAttribution ? ' (' + temp[i].telephoneNumAttribution + ')' : ''
            temp[i].phone = temp[i].telephoneNum + attr
            temp[i].hotel = temp[i].innNames // 客栈需要调整
          }

          this.hotelData = temp
          this.showPage = true
        } else {
          this.hotelData = []
          this.showPage = false
        }
      })
    },
    // 添加用户
    addUserBtn() {
      // this.$refs.showAddUser.addUserModal = true
      this.$refs.showAddUser.addAndEidt('add', false)
    },
    // 编辑用户
    eidtUser(curRow) {
      this.$refs.showAddUser.addAndEidt('edit', true, curRow)
    },
    // 查看
    clickOrderDetail(h, params, cur) {
      var _this = this
      return h('div', [
        h('span', {
          style: {
            textDecoration: 'underline',
            color: '#1F5B8F',
            fontSize: '14px',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              // this.$refs.showLookDetail.lookDetailModal = true
              this.$refs.showLookDetail.getLookDetail(params.row)
              // this.modalType = 'look'
              // this.getOrderInfo(params)
            }
          }
        }, '查看')
      ])
    },
    //入住间夜
    sortNeight() {
      this.sort = 'room_night'
      this.upAndDown()
      this.curPageNum(1)
    },
    // 入住金额
    sortFf() {
      this.sort = 'room_amount'
      this.upAndDown()
      this.curPageNum(1)

    },
    // 最近入住
    sortCheckIn() {
      this.sort = 'check_in_date'
      this.upAndDown()
      this.curPageNum(1)
    },
    //升降序
    upAndDown() {
      if (!this.sortOrd) {
        this.sortOrd = 'desc'
      } else {
        this.sortOrd = this.sortOrd == 'desc' ? 'asc' : 'desc'
      }
    }
  }
}
</script>
<style lang='scss' >
.over5 {
  width: 550px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.user-box {
  /* padding: 0 46px 27px; */
  .user-top {
    padding: 37px 0 25px;
    position: relative; 
    /* outline: 1px solid red; */
   
    .ivu-select-selection {
        border:1px solid #4b7ba6;
        border-radius:4px;
        /* height: 30px; */
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .select-div {
       min-width: 200px;
       display: inline-block;
      .ivu-select-placeholder{
          color:#515a6e;
      }
      .ivu-select-dropdown-list li {
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .gdt .ivu-select-dropdown {
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.1);
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #fafafa;
      }
    }
  }
  .search-btn {
    display: inline-block;
    margin: 0 15px 0 4px;
    width: 30px;
    height: 30px;
    background: rgba(33, 93, 145, 1);
    border-radius: 4px;
    .search-icon {
      font-size: 24px;
      color: #fff;
      margin-left: -12px;
      margin-top: -2px;
    }
  }
  .add-user {
    width: 119px;
    margin-top: 37px;
    line-height: 36px;
    height: 36px;
    color: #9AA7C1;
    text-align: center;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    border: 1px solid rgba(35, 95, 146, 1);
    font-size: 14px;
    font-family: 'PingFangSC-Regular';
    cursor: pointer;
  }
  .table-box {
    width: 100%;
    padding: 5px 24px 0 20px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 15px 0px rgba(206, 206, 206, 0.05);
    border-radius: 10px;
    .ivu-table-cell {
      padding-left: 0;
      padding-right: 0;
    }
  }
  .hidd {
    line-height: 20px;
    vertical-align: middle;
  }
  .kezhan-yc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 40px;
    .ivu-tooltip-rel {
      display: block;
    }
  }

  .ivu-table-tbody .demo-table-info-column {
    color: #9AA7C1;
    font-size: 14px;
  }
  .ivu-table-tbody .operate-time-color {
    font-size: 14px;
    .kezhan-yc {
      .ivu-tooltip-rel {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  tr>td:first-child.for-left-border {
    border-left: 2px solid #215D91;
  }
  th.for-left-border {
    border-left: 2px solid #fff;
  }
  .operate-time-color {
    color: #215D91;
    font: 16px/30px 'PingFangSC-Regular'
  }
  .demo-table-info-column {
    color: #215D91;
    font: 16px/30px 'PingFangSC-Regular';
    /*STHeitiTC*/
  }
  .ivu-table-fixed{
      -webkit-box-shadow: 2px 3px 6px -2px rgba(0, 0, 0, 0.2);
      box-shadow: 2px 3px 6px -2px rgba(0,0,0,0.2);
  }
  .ivu-table-fixed-right {
      -webkit-box-shadow: -2px 3px 6px -2px rgba(0, 0, 0, 0.2);
      box-shadow: -2px 3px 6px -2px rgba(0,0,0,0.2);
  }
  /*滚动条样式*/
  .ivu-table-overflowX::-webkit-scrollbar {/*滚动条整体样式*/
      width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 10px;

  }
  .ivu-table-overflowX::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #fafafa;
  }
  .ivu-table-overflowX::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
    }
}
</style>

