<template>
  <div class="roomAmount f_d">
    <template v-if="channelId && roomTypeList.length">
      <!-- 展示房型日历表 -->
      <div class="explain">
        <span>说明：格子中的数据为提供给渠道售卖的房量</span>
        <span style="margin-left: 30px;">操作：<span style="margin-left: 10px;"><i class="sircle">1</i> 单击格子可直接开关当天房间</span><span style="margin-left: 30px;"><i class="sircle">2</i> 点击日期可快速开启/关闭当日全部房量</span></span>
      </div>
      <div class="calendar">
        <div class="head">
          <ul class="clearfix">
            <li class="grid row0 column0 title">
              <span @click="persentHalfMonth"><Icon type="chevron-left" size="16"></Icon></span>
              &nbsp;&nbsp;
              <Date-picker :editable="false" :value="formatStamp(Number(currentDate.startDate))" type="date" @on-change="changeDatePicker" placeholder="选择日期" style="width: 106px"></Date-picker>
              <!-- <DatePicker type="date" :editable="false" v-model="currentDate.startDate" @on-change="changeDatePicker" class="datePicker" style="width: 80px;"></DatePicker> -->
              &nbsp;&nbsp;
              <span @click="nextHalfMonth"><Icon type="chevron-right" size="16"></Icon></span>
            </li>
            <li @click="batchOperation(item)" :class="['grid', 'row0', 'column' + (index+1), getWeek(item.date) === '日'?'Sunday':'']" v-for="(item, index) in dateList" :key="index">
              <p class="date">{{ dateFormat(item.date, '-', true) }}
                <span v-if="isEqual(item.date, today) || getFestival(item.date)" :class="['mark', isEqual(item.date, today)?'today':'festival']" >{{ isEqual(item.date, today)?'今天':getFestival(item.date) }}</span>
              </p>
              <p :class="['week', (getWeek(item.date) === '五' || getWeek(item.date) === '六')?'MayOrSat':'']">周{{ getWeek(item.date) }}</p>
              <p>剩{{ item.sum }}间</p>
            </li>
          </ul>
        </div>
        <div class="body">
          <ul class="clearfix" v-for="(item, index) in roomTypeList" :key="index" @mouseout="activeColumn = null">
            <li :class="['grid', 'column0', 'title', 'row' + (index+1)]" :title="item.roomTypeName">{{ item.roomTypeName }}</li>
            <li 
              @click="singleOperation(subItem, item.roomTypeId)" 
              :class="['grid', 'row' + (index+1), 'column' + (key+1), subItem.numOfRoomType?'':'remainNot',
              getWeek(subItem.date) === '日'?'Sunday':'']"
              :style="{backgroundColor: activeColumn === key+1?'#E4FAFF':''}"
              v-for="(subItem, key) in item.roomTypeDetailList"
              @mouseover="activeColumn = key+1"
              :key="key" >
              <span class="num" v-if="subItem.type === 'OPEN'" style="pointer-events:none;">{{ subItem.numOfRoomType }}</span>
              <span class="stop" v-if="subItem.type === 'CLOSE'" style="pointer-events:none;">停售</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template v-if="channelId && !roomTypeList.length">
      <!-- 没有关联房型 -->
      <div style="text-align: center;">
        <img src="./img/notConnect.png">
        <p style="font-size: 16px; margin-top: 15px;"><strong>没有关联房型</strong></p>
      </div>
    </template>
    <template v-if="!channelId && !roomTypeList.length">
      <div class="notChannelId">
        <img src="./img/notChannelId.png">
        <p>请先开通渠道直连</p>
        <span @click="goToLogin">开通直连</span>
      </div>
    </template>
    <input type="hidden" v-model="channelList">
  </div>
</template>

<script>
  import { getCookie, getThisWeekNum,formatStamp } from 'common_libs/util'
  import { innRoomTypeApiServers } from '../../api/API'
  import { mapActions } from 'vuex'


export default {
  name: 'roomAmount',
  data () {
    return {
      formatStamp,
      color: '#ccc',
      today: new Date(),
      currentDate: {  // 当前请求开始时间，结束时间
        startDate: +new Date() + '',
        endDate: +new Date() + (13 * 86400000)
      },
      nextHalfDate: { // 下个半月请求时间
        startDate: +new Date() + (14 * 86400000),
        endDate: +new Date() + (27 * 86400000)
      },
      perHalfDate: { // 上个半月请求时间
        startDate: +new Date() - (14 * 86400000),
        endDate: +new Date() - (1 * 86400000)
      },
      channelId: '',
      dateList: [], //时间和房总量列表
      roomTypeList: [], // 房型列表
      getWeek: getThisWeekNum,
      activeColumn: null,
      channelNameObj: {
          '1': '/channelManage',
          '2': ''
      }
    }
  },
  computed: {
    festivalList () {
      return this.$store.state.hotelStatus.festivalList
    },
    channelList () {
      let list = this.$store.state.hotelStatus.channelList
      if (!this.channelId) {
        for (let i = 0, len = list.length; i < len; i++) {
          if (list[i].otaId === '1') {
            this.channelId = list[i].channelId
            this.getData()
          }
        }
      }
    },
    userPermissionList () {
      return this.$store.getters.userPermissionList
    }
  },
  methods: {
    ...mapActions(['dispatchChannelList']),
    batchOperation (item) {
      /* 批量操作 */
      let list = this.roomTypeList
      let operationList = []
      let details = []
      for (let i = 0, len = list.length; i < len; i++) {
        let subList = list[i].roomTypeDetailList
        for (let j = 0, l = subList.length; j < l; j++) {
          if (this.dateFormat(item.date) === this.dateFormat(subList[j].date)) {
            details.push({
              roomTypeId: list[i].roomTypeId,
              startTime: subList[j].date,
              endTime: subList[j].date
            })
            operationList.push(subList[j])
          }
        }
      }
      let all = operationList.every((item) => {
        return item.type === 'CLOSE'
      })
      let type = all ? 'OPEN':'CLOSE'
      this.sendRequestToggle(type, details).then(() => {
        operationList.map((item) => {
          return item.type = type
        })
      })
    },
    singleOperation (item, id) {
      /* 单个操作 */
      let type = item.type === 'OPEN' ? 'CLOSE' : 'OPEN'
      let details = [
        {
          endTime: item.date,
          startTime: item.date,
          roomTypeId: id
        }
      ]
      this.sendRequestToggle(type, details).then(() => {
        item.type = type
      })
    },
    sendRequestToggle (type, details) {
      /* 发送开关房请求 */
      let param = {
        userId: getCookie('userId'),
        innId: getCookie('innId'),
        channelId: this.channelId,
        type,
        details
      }
      return new Promise((resolve, reject) => {
        innRoomTypeApiServers.toggleSellType(param).then(result => {
          if (result.code === '000000') {
            resolve(result)
          } else {
            reject(result)
          }
        })
      })
    },
    persentHalfMonth () {
      /* 上半个月 */
      this.currentDate = this.perHalfDate
      this.changeDate()
      this.getData()
    },
    nextHalfMonth () {
      /* 下半个月 */
      this.currentDate = this.nextHalfDate
      this.changeDate()
      this.getData()
    },
    changeDatePicker (date) {
      /* 监听时间选择器的变化 */
      this.currentDate = {
        startDate: +new Date(date),
        endDate: +new Date(date) + (13 * 86400000)
      }
      this.changeDate()
      this.getData()
    },
    changeDate () {
      this.perHalfDate = {
        startDate: this.currentDate.startDate - (14 * 86400000),
        endDate: this.currentDate.startDate - (1 * 86400000)
      }
      this.nextHalfDate = {
        startDate: this.currentDate.endDate + (1 * 86400000),
        endDate: this.currentDate.endDate + (14 * 86400000)
      }
    },
    getFestival (date, festivalName) {
      /* 获取节日名称 */
      let timeStamp = +new Date(this.dateFormat(date))
      let list = this.festivalList
      let startDate = 0
      let endDate = 0
      let festivalDate = 0
      for (let i = 0, len = list.length; i < len; i++) {
        startDate = +new Date(this.dateFormat(list[i].startDate))
        endDate = +new Date(this.dateFormat(list[i].endDate))
        festivalDate = +new Date(this.dateFormat(list[i].festivalDate))
        if (startDate <= timeStamp && timeStamp <= endDate) {
          return festivalDate === timeStamp ? list[i].name.slice(0, -1) : '休'
        }
      }
      return null
    },
    dateFormat (date, symbol = '-', year) {
      /* 格式化时间 */
      date = parseFloat(date) ? parseFloat(date) : date
      if (date) {
        date = new Date(date)
        if (year) {
          return `${date.getMonth() + 1}${symbol}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
        }
        return `${date.getFullYear()}${symbol}${date.getMonth() + 1}${symbol}${date.getDate()}`
      }
    },
    isEqual (date01, date02) {
      /* 判断两个时间是否相等 */
      date01 = this.dateFormat(date01)
      date02 = this.dateFormat(date02)
      return date01 === date02
    },
    getData () {
      let datelist = []
      let param = {
        userId: getCookie('userId'),
        innId: getCookie('innId'),
        startTime: this.currentDate.startDate,
        endTime: this.currentDate.endDate,
        channelId: this.channelId
      }
      innRoomTypeApiServers.getSumOfType(param).then(result => {
        if (result.code === '000000') {
          this.dateList = result.content.sumOfRoomTypeList
        }
      })
      /* let today = +new Date()
      for (let i = 0; i < 14; i++) {
        let date = today + (i * 86400000)
        this.dateList.push({
          date,
          sum: 6
        })
      } */
      innRoomTypeApiServers.getNumOfType(param).then(result => {
        if (result.code === '000000') {
          this.roomTypeList = result.content
        }
      })
      /* for (let j = 0; j < 5; j++) {
        let roomTypeList = {
          innId: j,
          roomTypeId: j,
          roomTypeName: "房型名称"+ j,
          otaRoomTypeId: "45dsfsfdws"+ j,
          otaRoomTypeName: "ota房型名称"+ j,
          roomTypeDetailList: []
        }
        for (let i = 0; i < 14; i++) {
          let date = today + (i * 86400000)
          roomTypeList.roomTypeDetailList.push({
            numOfRoomType: 2,
            date,
            type: "OPEN",
            typeName: "开售"
          })
        }
        this.roomTypeList.push(roomTypeList)
      } */
    },
    goToLogin () {
      /* 跳转到直连登录页面 */
      let err = true
      this.userPermissionList.map(item => {
        if (item === 'R_CONNECT_APPLY') {
          this.$router.push({
            name: 'channelManage'
          })
          err = false
        }
      })
      if (err)
        this.$Message.warning('暂无直连管理权限！')
    },
    getChannelList () {
      /* 获取渠道列表 */
      let params = {
          innId: getCookie('innId'),
          userId: getCookie('userId'),
          pmsCode: 'FTPMS'
      }
      innRoomTypeApiServers.getChannelList(params).then(result => {
          let channelList = []
          if (result && result.code === '000000') {
              result = result.content
              for (let i = 0, len = result.length; i < len; i++) {
                  let item = result[i]
                  item = Object.assign(item, {
                      path: this.channelNameObj[item.otaId],
                      menuName: item.channelName
                  })
                  channelList.push(item)
              }
          }
          this.dispatchChannelList(channelList)
      })
    }
  },
  created () {
    this.getChannelList()
  },
  watch: {
      channelList: {
          handler (data) {
              let list = this.$store.state.hotelStatus.channelList
              if (!this.channelId) {
                for (let i = 0, len = list.length; i < len; i++) {
                  if (list[i].otaId === '1') {
                    this.channelId = list[i].channelId
                    this.getData()
                  }
                }
              }
          },
          deep: true
      },
  }
}
</script>

<style lang="scss" scoped>
@import './roomAmount'
</style>
