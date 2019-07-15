<template>
  <div class="hotelInfo f_d">
    <div class="add-hotel">
      <span class="textCent cursPoint" @click="addHotel">添加客栈</span>
    </div>

    <div class="hotelInfoChange">
      <p class="title">门店信息</p>
      <div class="changeWrap">
        <div class="hotelTab">
          <tabs-nav :list="hotelList" :innId="getCookie('innId')" @on-change="onChange" ref="tabsNav"></tabs-nav>
        </div>
        <Hotel-form ref="hotelForm"  @on-open="openAddress"></Hotel-form>
      </div>

      <p class="title">客栈排序 <span>您可以拖动客栈进行排序，在房态页选择“客栈名”时，客栈将按以下顺序显示。</span></p>
      <div>
        <hotel-sort :hotelList="hotelList"  @on-change="changeSort"></hotel-sort>
      </div>
    </div>

    <!-- 修改客栈地址 -->
    <app-modal
      v-model="modal"
      :header-hide="true"
      :footer-hide="true"
      scrollable
      :width="665"
      :height="600"
      ok-text="保存"
    >
      <modal-header title="客栈地址" slot="header"></modal-header>
      <detail-address ref="detailAddress" @on-address="onAddress"></detail-address>

      <div slot="footer" class="modal-footer textCent">
          <button class="public-buttons save" @click="saveAddress" :disabled="addLoading">保存</button>
      </div>
    </app-modal>

    <!-- 添加客栈 -->
    <app-modal
      v-model="addModal"
      :header-hide="true"
      :footer-hide="true"
      scrollable
      :width="665"
      :height="675"
      ok-text="保存"
    >

      <modal-header title="添加客栈" slot="header"></modal-header>
      <Hotel-add ref="addHotel"></Hotel-add>

      <div slot="footer" class="modal-footer textCent">
          <button class="public-buttons save" @click="addHotelSub" :disabled="addLoading">
            <span>添加</span>  
          </button>
      </div>
    </app-modal>
    <!-- <app-modal v-model="selectAddressModal" :title="'详细地址'" :width="794" :height="644" @on-ok="ok">
      <detail-address @on-address="onAddress" :address-info="addressInfo"></detail-address>
    </app-modal> -->
  </div>
</template>

<script>
import { getCookie, trimAll } from 'common_libs/util.js'
// import AppModal from 'pms-modal'
import DetailAddress from '../../components/common/hotelInfo/detail-address/'
import { hotelInforApiServers, innRoomTypeApiServers } from '../../api/API'
import {
    publicHttpServer
} from '@/api/api'
import TabsNav from 'common_components/TabsNav'
import HotelForm from 'hotelType/components/common/hotelInfo/HotelForm/'
import HotelSort from 'hotelType/components/common/hotelInfo/HotelSort/'
import HotelAdd from 'hotelType/components/common/hotelInfo/HotelAdd/'
import AppModal from 'common_components/AppModal'
import ModalHeader from 'hotelType/components/ModalHeader'
import {mapState, mapGetters, mapActions} from "vuex"
 



export default {
  name: 'hotelInfo',
  components: {
    AppModal,
    DetailAddress,
    TabsNav,
    HotelForm,
    HotelSort,
    ModalHeader,
    HotelAdd
  },
  computed: {
    hotelList () {
      let data = this.$store.getters.hotelList
      for(let z = 0;z < data.length;z++){
        data[z].label = data[z].innName
        data[z].value = data[z].innId
      }
      return data
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  data () {
    return {
      getCookie,
      editMode: true,
      selectAddressModal: false,
      fromMapAddress: {},
      phoneNumber: '',
      percent: 0,
      hotelInfoForm: {
        innName: '',
        telephone: '',
        roomNum: '',
        openingDate: '',
        decorationDate: '',
        address: ''
      },
      switchSave: {
        innName: false,
        telephone: false,
        roomNum: false,
        openingDate: false,
        decorationDate: false,
        address: true
      },
      addressInfo: {},

      // hotelList: [
      //   // {value: 1, label: '丽江背包十年-成都店'},
      //   // {value: 2, label: '丽江背包十年-昆明店'},
      //   // {value: 3, label: '丽江背包十年-丽江总店'},
      //   // {value: 4, label: '丽江背包十年-大研店'}
      // ],
      modal:false,
      addModal:false,
      checkedHotel:null,
      addLoading:false,
      hasHotelPermission:false
    }
  },
  methods: {
    
     ...mapActions([
        'getHotelList',
        'getUserInfo'
    ]),
    switchSaveMethod (name) {
      if (this.switchSave[name]) {
        hotelInforApiServers.updateHotelInfo(this.hotelInfoForm).then(result => {
          if (result.code === '000000') {
            this.switchSave[name] = false
            this.computedPercent()
            this.getHotelInfo()
          } else {
            alert(result.message)
          }
        })
      } else {
        this.switchSave[name] = true
      }
    },
    computedPercent () {
      let empty = 0
      let copyObj = {
        innName: this.hotelInfoForm.innName,
        telephone: this.hotelInfoForm.telephone,
        roomNum: this.hotelInfoForm.roomNum,
        openingDate: this.hotelInfoForm.openingDate,
        decorationDate: this.hotelInfoForm.decorationDate,
        address: this.hotelInfoForm.address
      }
      for (let key in copyObj) {
        if (!copyObj[key]) {
          empty++
        }
      }
      this.percent = parseInt((6 - empty) / 6 * 100)
    },
    onBusinessDate (date) {
      this.hotelInfoForm.openingDate = date
    },
    onDecorationDate (date) {
      this.hotelInfoForm.decorationDate = date
    },
    onAddress (data) {
      /* 地图选择返回的结果 */
      this.fromMapAddress = data
    },
    ok () {
      if (!trimAll(this.fromMapAddress.address)) {
        alert('详细地址不能为空！')
        return false
      }
      this.hotelInfoForm.address = this.fromMapAddress.address
      this.hotelInfoForm.province = this.fromMapAddress.cascaderData[0].value
      this.hotelInfoForm.city = this.fromMapAddress.cascaderData[1].value
      this.hotelInfoForm.region = this.fromMapAddress.cascaderData[2].value
      this.hotelInfoForm.innLatitude = this.fromMapAddress.point.lat
      this.hotelInfoForm.innLongitude = this.fromMapAddress.point.lng
      this.switchSaveMethod('address')
      this.selectAddressModal = false
    },
    dateFormat (date, symbol = '-', year) {
      /* 格式化时间 */
      date = parseFloat(date) ? parseFloat(date) : date
      if (date) {
        date = new Date(date)
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let moth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        if (year) {
          return `${moth}${symbol}${day}`
        }
        return `${date.getFullYear()}${symbol}${moth}${symbol}${day}`
      }
    },
    getHotelInfo (data) {
      hotelInforApiServers.getHotelInfo(data).then(result => {
        if (result.code === '000000') {
          result = result.content
          this.addressInfo = this.hotelInfoForm = Object.assign(result, {
            openingDate: this.dateFormat(result.openingDate),
            decorationDate: this.dateFormat(result.decorationDate)
          })
          console.log(this.addressInfo)        
          this.computedPercent()
        }
      })
    },
    getBaseInfo () {
      innRoomTypeApiServers.getBaseInfo({token: getCookie('token')}).then(result => {
        if (result.code === '000000') {
          this.phoneNumber = result.content.phoneNumber
        }
      })
    },
    onChange (item,type) {
      // console.log(this.$refs.tabsNav.activeId)
      // return
      this.hasHotelPermission = false
      this.checkedHotel = item
      let data = {
        userId: getCookie('userId'),
        innId: item.innId
      }
      let { innList } = this.userInfo
      // 查看是否有门店信息权限
      if(!innList){
        setTimeout( () => {
          let innListNew = this.$store.getters.userInfo
          // 查看是否有门店信息权限
          for (let i = 0, len = innListNew.length; i < len; i++) {
              let subItem = innListNew[i]
              if (item.innId == subItem.innId) {
                  let content = subItem.permissions
                  for(let z = 0;z < content.length;z++){
                      if(content[z] === 'R_INN_MANAGER'){
                          this.hasHotelPermission = true
                      }
                  }
              }
          }
        },1000)
      }else{
        for (let i = 0, len = innList.length; i < len; i++) {
            let subItem = innList[i]
            if (item.innId == subItem.innId) {
                let content = subItem.permissions
                for(let z = 0;z < content.length;z++){
                    if(content[z] === 'R_INN_MANAGER'){
                        this.hasHotelPermission = true
                    }
                }
            }
        }
      }
      if(type == 'new'){
        this.hasHotelPermission = true
      }
      this.$refs.hotelForm.getHotelInfo(data)
    },
    saveAddress() {
      this.addLoading = true
      let hotelInfoForm = JSON.parse(JSON.stringify(this.$refs.hotelForm.hotelInfoForm))
      let detailAddress = this.$refs.detailAddress
      let areaChoose = this.$refs.detailAddress.$refs.areaChoose
      let setPointFlag = this.$refs.detailAddress.setPointFlag

      hotelInfoForm.address = detailAddress.searchValue
      hotelInfoForm.province = areaChoose.province
      if(areaChoose.selectData[0]){
        hotelInfoForm.provinceName = areaChoose.selectData[0].areaname
      }
      // hotelInfoForm.provinceName = areaChoose.selectData[0].areaname
      hotelInfoForm.city = areaChoose.city
      if(areaChoose.selectData[1]){
        hotelInfoForm.cityName = areaChoose.selectData[1].areaname
      }
      // hotelInfoForm.cityName = areaChoose.selectData[1].areaname
      hotelInfoForm.region = areaChoose.region
      if(areaChoose.selectData.length > 2){
        hotelInfoForm.regionName = areaChoose.selectData[2].areaname
      }
      hotelInfoForm.innLatitude = detailAddress.pointPut.lat
      hotelInfoForm.innLongitude = detailAddress.pointPut.lng
      
      if(!hotelInfoForm.address){
        this.$Message.error('客栈地址不能为空');
        this.addLoading = false
        return
      }
      // 澳门只有区县
      if(Number(hotelInfoForm.province) == 820000){
        if(!hotelInfoForm.province || !hotelInfoForm.city){
          this.$Message.error('请完善客栈省市选择！')
          this.addLoading = false
          return
        }
      }else{
        if(!hotelInfoForm.province || !hotelInfoForm.city || !hotelInfoForm.region){
          this.$Message.error('请完善客栈省市区选择！')
          this.addLoading = false
          return
        }
      }

      // 用户是否手动搜索定位或者拖动地图坐标
      if(!setPointFlag){
        this.$Message.error('请搜索详细地址定位或者拖动地图坐标定位！')
        this.addLoading = false
        return
      }
      
      if(!this.checkedHotel){
        this.checkedHotel = {
          innId: getCookie('innId')
        }
      }

      hotelInforApiServers.updateHotelInfo(hotelInfoForm).then(result => {
        this.addLoading = false
        if (result.code === '000000') {
          this.modal = false
          let data = {
            userId: getCookie('userId'),
            innId: this.checkedHotel.innId
          }
          this.$refs.hotelForm.getHotelInfo(data)
        } else {
          alert(result.message)
        }
      })
    },

    addHotel() {
      console.log('add')
      this.addModal = true
    },
    addHotelSub() {
      let addForm = this.$refs.addHotel.addForm
      let selectData = this.$refs.addHotel.selectData
      let pointPut = this.$refs.addHotel.pointPut
      let setPointFlag = this.$refs.addHotel.setPointFlag
      this.$refs.addHotel.$refs['addForm'].validate((valid) => {
        if (valid) {
          let dataSub = {
            innName: addForm.name,
            telephone: addForm.phone,
            province: addForm.province,
            city: addForm.city,
            region: addForm.region,
            address: addForm.address,
            innLongitude: pointPut.lng + '',
            innLatitude: pointPut.lat + '',
          }
          this.addLoading = true

          // 澳门只有区县
          if(Number(dataSub.province) == 820000){
            if(!dataSub.province || !dataSub.city){
              this.$Message.error('请完善客栈省市选择！')
              this.addLoading = false
              return
            }
          }else{
            if(!dataSub.province || !dataSub.city || !dataSub.region){
              this.$Message.error('请完善客栈省市区选择！')
              this.addLoading = false
              return
            }
          }

          // 用户是否手动搜索定位或者拖动地图坐标
          if(!setPointFlag){
            this.$Message.error('请搜索详细地址定位或者拖动地图坐标定位！')
            this.addLoading = false
            return
          }
          innRoomTypeApiServers.addInn(dataSub).then(result => {
            this.addLoading = false
            if (result.code === '000000') {
              this.$Message.success('添加成功！')
              this.getHotelList()
              this.getUserInfo()
              setTimeout( () => {
                this.$refs.tabsNav.activeId = this.hotelList[0].innId
                this.onChange(this.hotelList[0],'new')
              },1000)
              this.addModal = false
            }else{
              alert(result.message)
            }
          })
        } else {
          // this.$Message.error('表单验证失败!');
          console.log('表单验证失败')
        }
      })
    },

    // 获取门店列表
    getInnList() {
      innRoomTypeApiServers.getInnList({}).then(result => {
        if (result.code === '000000') {
          for(let z = 0;z < result.content.length;z++){
            result.content[z].label = result.content[z].innName
            result.content[z].value = result.content[z].innId
          }
          this.hotelList = result.content
          let data = {
            userId: getCookie('userId'),
            innId: this.hotelList[0]['innId']
          }
          this.$refs.hotelForm.getHotelInfo(data)
          this.checkedHotel = this.hotelList[0]
        }else{
          alert(result.message)
        }
      })
    },

    openAddress() {
      this.modal = true
      // console.log(this.$refs)
      // this.$refs.detailAddress.addressInfo = this.addressInfo
    },

    changeSort() {
      // this.$refs.tabsNav.activeIndex = 0
    }
  },
  created () {
    // this.getInnList()
    this.getBaseInfo()
  }
}
</script>

<style lang="scss">
@import './hotelInfo'
</style>

