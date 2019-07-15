<template>
  <menu class="sider-menu">
    <div class='slider-custom'>
      <div @click='contactCustom' class="kefu">
        <span class="icon-bg"></span>
        联系客服
      </div>
    </div>

    <div class="logo">
      <img src="./image/logo.png" class="position_c" alt="logo">
    </div>
    <div class="hotel-name" :title="userInfo.innName" @click.stop="searchOpen = !searchOpen">
      <span class="text-break-1 cursPoint">
        {{userInfo.innName}}
      </span>
      <span :class="{
                'more-hotel': true,
                open: searchOpen
            }">
        <Icon type="ios-arrow-down" color="#2F6CA3" v-if="showHotelList"/>
      </span>
      <template v-if="showHotelList">
          <hotel-list v-if="searchOpen" @on-change="switchHotel"></hotel-list>
      </template>
    </div>
    <ul class="menu-main">
      <li
        v-for="(item, index) in menuList"
        :key="index"
        :class="[item.page === page? 'active': '', item.page]"
        @click="jumpToPage(item.path)"
    >
        <span class="icon"></span> {{item.name}}
      </li>
    </ul>
    <CustomModal ref='showC'></CustomModal>
  </menu>
</template>

<script>
    import {
        getCookie,
        deleteCookie,
        setCookie
    } from 'common_libs/util';
    import {
        publicHttpServer
    } from '@/api/api'
    import HotelList from './components/HotelList/HotelList'
    import CustomModal from './customModal'

    export default {
        name: 'SiderMenu',
        props: {
            page: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                menuMap: {
                    R_ROOMSTATE: {
                        name: '房态', path: '/hotelStatus/hotelStatus.html', page: 'hotelStatus'
                    },
                    R_FINANCE: {
                        name: '财务', path: '/hotelStatus/hotelFinance.html', page: 'hotelFinance'
                    },
                    R_ORDER: {
                        name: '订单', path: '/hotelStatus/hotelOrder.html', page: 'hotelOrder'
                    },
                    R_MANAGER: {
                        name: '管理', path: '/hotelStatus/hotelType.html', page: 'hotelType'
                    },
                    R_LINEN: {
                        name: '布草', path: '/hotelStatus/hotelLinen.html', page: 'hotelLinen'
                    },
                    R_CLIENT: { //R_CLIENT
                      name: '客户', path: '/hotelStatus/hotelUser.html', page: 'hotelUser' 
                    }, 
                },
                secendMenuMap:{
                    R_ROOM_MANAGER: {
                        name: '房型房号', path: '/hotelStatus/hotelType.html#/', page: 'hotelType',type: 1
                    },
                    R_INN_MANAGER: {
                        name: '门店信息', path: '/hotelStatus/hotelType.html#/hotelInfo', page: 'hotelInfo',type: 1
                    },
                    R_CHANNEL_MANAGER: {
                        name: '渠道设置', path: '/hotelStatus/hotelType.html#/ownChannel', page: 'ownChannel',type: 1
                    },
                    R_CONNECT_APPLY: {
                        name: '直连申请', path: '/hotelStatus/hotelType.html#/channelManage', page: 'ownChannel',type: 1
                    },
                    R_CONNECT_ROOM: {
                        name: '直连房量', path: '/hotelStatus/hotelType.html#/roomAmount', page: 'roomAmount',type: 1
                    },
                    R_EMPLOYEE: {
                        name: '员工账号', path: '/hotelStatus/hotelType.html#/staffAccount', page: 'staffAccount',type: 1
                    },
                    R_FINANCE_RECORD: {
                        name: '收支流水表', path: '/hotelStatus/hotelFinance.html#/', page: 'hotelFinance',type: 2
                    },
                    R_FINANCE_BALANCE: {
                        name: '渠道对账表', path: '/hotelStatus/hotelFinance.html#/hotelChannel', page: 'hotelChannel',type: 2
                    },
                },
                searchOpen: false
            }
        },
        components: {
            HotelList,
            CustomModal
        },
        computed: {
            showHotelList () {
                return this.$store.getters.hotelList.length >= 2
            },
            userInfo () {
                return this.$store.getters.userInfo
            },
            permissionValueList () {
                let res = []
                let allPermissionList = this.$store.getters.allPermissionList
                for (let i = 0, len = allPermissionList.length; i < len; i++) {
                    let item = allPermissionList[i]
                    if (item.level === 1)
                        res.push(item.value)
                }
                return res
            },
            menuList () {
                let curInnId = this.userInfo.innId
                let innList = this.userInfo.innList
                let menuList = []
                let userPermissionList = this.$store.getters.userPermissionList
                let userPermissionValueList = []
                let userPermissionP = new Promise(res => {
                    if (userPermissionList && userPermissionList.length)
                        res(true)
                })
                let permissionValueP = new Promise(res => {
                    if (this.permissionValueList && this.permissionValueList.length)
                        res(true)
                })
                let userInfoP = new Promise(res => {
                    if (this.userInfo)
                        res(true)
                })
                if (innList && innList.length) {
                    userPermissionList.map(item => {
                        let menuItem = this.menuMap[item]
                        if (menuItem) {
                            userPermissionValueList.push(item)
                        } 
                    })
                    for (let i = 0, len = this.permissionValueList.length; i < len; i++) {
                        let item = this.permissionValueList[i]
                        let index = userPermissionValueList.indexOf(item) >= 0
                        if (item === 'R_MANAGER' && !index)
                            menuList.push(this.menuMap.R_MANAGER)
                        else if (index)
                            menuList.push(this.menuMap[item])
                    }
                    for (let i = 0, len = innList.length; i < len; i++) {
                        let { innId, master } = innList[i]
                        if (curInnId === innId) {
                            if (master === 1) {
                                menuList.push(
                                    { name: '金融', path: '/wefintFinance/wefintFinance.html', page: 'wefintFinance'}
                                )
                                continue
                            }
                        }
                    }
                    // Promise.all([userPermissionP, permissionValueP, userInfoP]).then(res => {
                    //     this.reDirection(menuList)
                    // })
                    return menuList
                }
            }
        },
        methods: {
            jumpToPage (path) {
                if(path == '/wefintFinance/wefintFinance.html'){
                    window.open(path,'_blank') 
                }else{
                    window.location.href=`${path}`
                }
            },
            handlerOpen (event) {
                event = event || window.event
                this.searchOpen = false
                event.stopPropagation()
                return false
            },
            switchHotel (data) {
                if (data.innId === getCookie('innId')) {
                    this.searchOpen = false
                    return false
                }
                if(window.location.pathname == '/hotelStatus/hotelLog.html'){
                    publicHttpServer.switchHotel({
                        innId: data.innId
                    }).then(res => {
                        if (res.code === '000000' && res.content) {
                            let { token, innId, userId } = res.content
                            setCookie('token', token)
                            setCookie('innId', innId)
                            setCookie('userId', userId)
                            window.location.reload()
                        }
                    })
                }else{
                    publicHttpServer.switchHotel({
                        innId: data.innId
                    }).then(res => {
                        if (res.code === '000000' && res.content) {
                            let { token, innId, userId } = res.content
                            let { innList } = this.userInfo
                            setCookie('token', token)
                            setCookie('innId', innId)
                            setCookie('userId', userId)

                            for (let i = 0, len = innList.length; i < len; i++) {
                                let item = innList[i]
                                if (item.innId == innId) {
                                    let content = item.permissions
                                    let secendMenuFlag = ''
                                    let turnFlag = false
                                    let secendMenutype = 1
                                    for (var n in  this.secendMenuMap){
                                        if (this.secendMenuMap[n].path == (window.location.pathname + window.location.hash)){
                                            secendMenuFlag = n
                                            secendMenutype = this.secendMenuMap[n].type
                                        }
                                    }
                                    if(secendMenuFlag){
                                        content.map((item, index) => {
                                            if (item == secendMenuFlag){
                                                turnFlag = true
                                                window.location.reload()
                                            }
                                        })
                                        if(!turnFlag){
                                            let flag = false
                                            if(secendMenutype == 1){
                                                for(let q = 0;q < content.length;q++){
                                                    if(content[q] == 'R_ROOM_MANAGER'){
                                                        window.location.href = '/hotelStatus/hotelType.html#/'
                                                        flag = true
                                                        window.location.reload()
                                                    }
                                                }
                                                if(!flag){
                                                    window.location.href = '/hotelStatus/hotelType.html#/hotelInfo'
                                                    window.location.reload()
                                                }
                                            }else{
                                                for(let q = 0;q < content.length;q++){
                                                    if(content[q] == 'R_FINANCE_RECORD'){
                                                        window.location.href = '/hotelStatus/hotelFinance.html#/'
                                                        flag = true
                                                        window.location.reload()
                                                    }
                                                }
                                                for(let q = 0;q < content.length;q++){
                                                    if(content[q] == 'R_FINANCE_BALANCE'){
                                                        window.location.href = '/hotelStatus/hotelFinance.html#/hotelChannel'
                                                        flag = true
                                                        window.location.reload()
                                                    }
                                                }
                                                if(!flag){
                                                    content.map((item, index) => {
                                                        if (this.menuMap[item] && index === 0)
                                                            window.location.href = this.menuMap[item].path
                                                    })
                                                }
                                            }
                                            
                                        }
                                    }else{
                                        let jump = true
                                        let key = ''
                                        for (key in this.menuMap) {
                                            content.map((item, index) => {
                                                if (key === item && jump) {
                                                    jump = false
                                                    window.location.href = this.menuMap[item].path
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
                this.searchOpen = false
            },
            contactCustom() {
              this.$refs.showC.showCustomModal = true
            },
            reDirection (menuList) {
                let exist = menuList.some(item => item.page === this.page)
                if(!exist && this.page && this.page !== 'hotelLog') {
                    window.location.href = menuList[0].path
                }
            }
        },
        watch: {
            searchOpen (val) {
                val ?
                    document.addEventListener('click', this.handlerOpen)
                    : document.removeEventListener('click', this.handlerOpen)
            }
        }
    }
</script>

<style lang="scss">
.sider-menu {
  height: 100%;
  position: absolute;
  width: 150px;
  left: 0;
  top: 0;
  background: url('./image/menu-bg.png') no-repeat center 120px;
  .slider-custom {
    .kefu{
      width: 82px;
      line-height: 30px;
      background: rgba(106,112,118,0.9);
      box-shadow: 0px 0px 6px 0px rgba(38,48,55,0.25);
      border-radius: 4px;
      margin: auto;
      color: #fff;
    }
    position: absolute;
    bottom: 12px;
    width: 100%;
    color: #9AA7C1;
    font-size: 12px;
    text-align: center;
    .icon-bg {
      display: inline-block;
      width: 12px;
      height: 14px;
      margin-right: 4px;
      background: url('../../common_assets/imgs/custom.png') no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
    }
  }
  .logo {
    height: 120px;
    position: relative;
    background: url('./image/logo-bg.png') no-repeat center;
    background-color: white;
  }
  .hotel-name {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55px;
    color: #515a6e;
    font-size: 14px; // text-align: center;
    font-family: '微软雅黑';
    font-weight: 600;
    padding: 0 5px 0 10px;
    position: relative;
    .more-hotel {
    //   position: absolute;
      right: 3px;
      transition: all .3s;
      margin-left: 3px;
    }
    .more-hotel.open {
      transform: rotate(180deg);
      transform-origin: 7px 11px;
    }
  }
  .menu-main {
    text-align: center;
    color: #9AA7C1;
    font-size: 14px;
    li {
      margin: 5px 0;
      padding: 15px 0;
      cursor: pointer;
      border-left: 3px solid transparent;
      .icon {
        display: inline-block;
        height: 23px;
        width: 19px;
        margin-right: 25px;
        background: url('./image/menu-item-icon.png') no-repeat;
        vertical-align: bottom;
      }
      &.active {
        border-left-color: #17568C;
        color: #235F92;
      }
      &:hover {
        color: #235F92;
        border-left-color: #17568C;
      }
    }
    li.hotelStatus:hover .icon,
    li.hotelStatus.active .icon {
      background-position: -0px 3px;
    }
    li.hotelFinance:hover .icon,
    li.hotelFinance.active .icon {
      background-position: -2px -28px;
    }
    li.hotelOrder:hover .icon,
    li.hotelOrder.active .icon {
      background-position: 0 -56px;
    }
    li.hotelType:hover .icon,
    li.hotelType.active .icon {
      background-position: 0 -85px;
    }
    li.hotelLinen:hover .icon,
    li.hotelLinen.active .icon {
      background-position: 0 -115px;
    }
    li.wefintFinance:hover .icon,
    li.wefintFinance.active .icon {
      background-position: 0 -145px;
    }
    li.hotelUser:hover .icon,
    li.hotelUser.active .icon {
      background-position: -1px -177px;
    }
    li.hotelStatus .icon {
      background-position: -30px 3px;
    }
    li.hotelFinance .icon {
      background-position: -32px -28px;
    }
    li.hotelOrder .icon {
      background-position: -30px -56px;
    }
    li.hotelType .icon {
      background-position: -30px -85px;
    }
    li.hotelLinen .icon {
      background-position: -30px -115px;
    }
    li.wefintFinance .icon {
      background-position: -30px -145px;
    }
    li.hotelUser .icon {
      background-position: -31px -177px;
    }
  }
}
</style>
