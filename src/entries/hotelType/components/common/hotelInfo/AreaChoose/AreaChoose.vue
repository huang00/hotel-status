<template>
    <div class="areaChoose">
        <Select v-model="province" style="width:120px;margin-right:18px" placeholder="省份" @on-change="changeProvince()">
            <Option :value="item.id" v-for="item in data" :key="item.id">{{item.areaname}}</Option>
        </Select>

        <Select v-model="city" style="width:120px;margin-right:18px" placeholder="城市"  @on-change="changeCity()">
            <Option :value="item.id" v-for="item in cityList" :key="item.id">{{item.areaname}}</Option>
        </Select>

        <Select v-model="region" style="width:120px;" placeholder="区县"   @on-change="changeRegion()">
            <Option :value="item.id" v-for="item in regionList" :key="item.id">{{item.areaname}}</Option>
        </Select>
    </div>
</template>

<script>
// import TabsNav from 'common_components/TabsNav'
// import AppModal from 'common_components/AppModal'
// import HotelPeople from 'hotelType/components/common/staffAccount/HotelPeople'
// import AddStaff from 'hotelType/components/common/staffAccount/AddStaff'
// import ModalHeader from 'hotelType/components/ModalHeader'
// import { getCookie, trimAll } from 'common_libs/util.js'
import { hotelInforApiServers, innRoomTypeApiServers } from '../../../../api/API'

// import {
//     validateRule
// } from 'common_libs/util'

export default {
    name: 'areaChoose',
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        },
        loadData: {
            type: Function,
            default (data, callback) {
                callback()
            }
        },
        selectedDataFormParent: {
            type: Array,
            default () {
                return []
            }
        },
        addressInfo: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            province: '',
            city: '',
            region: '',
            cityList:[],
            regionList:[],
            selectData:[],
            loading:false
        }
    },
    components: {

    },
    methods: {
        // 修改省份
        changeProvince() {
            this.city = ''
            this.region = ''
            this.cityList = []
            this.regionList = []
            let selectData = []
            if(this.province){
                hotelInforApiServers.getAllCityAdresse({parentid: this.province}).then(result => {
                    if (result.code === '000000') {
                        for(let z = 0;z < result.content.length;z++){
                            result.content[z].value = result.content[z].id
                            result.content[z].label = result.content[z].areaname
                        }
                        this.cityList = result.content

                        for(let q = 0;q < this.data.length;q++){
                            if(this.province == this.data[q].id){
                                selectData.push(this.data[q])
                            }
                        }

                        this.selectData = selectData

                        let data = {
                            type: 1,
                            selectData: this.selectData
                        }
                        this.$emit('on-change', data)

                        // let lng = 0
                        // let lat = 0
                        // let list =  result.content
                        // for (let i = 0, len = list.length; i < len; i++) {
                        //     let item = list[i]
                        //     if (this.province === item.id) {
                        //         lng = item.lng
                        //         lat = item.lat
                        //     }
                        // }
                        // console.log(this.$parent)
                        // this.$parent.initMap(lng, lat)
                    }
                })
            }
        },

        // 修改城市
        changeCity() {
            this.region = ''
            this.regionList = []
            this.selectData = this.selectData.splice(0,1)
            if(this.city){
                hotelInforApiServers.getAllCityAdresse({parentid: this.city}).then(result => {
                    if (result.code === '000000') {
                        for(let z = 0;z < result.content.length;z++){
                            result.content[z].value = result.content[z].id
                            result.content[z].label = result.content[z].areaname
                        }
                        this.regionList = result.content

                        for(let q = 0;q < this.cityList.length;q++){
                            if(this.city == this.cityList[q].id){
                                // this.selectData[1] = this.cityList[q]
                                this.selectData.push(this.cityList[q])
                            }
                        }

                        let data = {
                            type: 2,
                            selectData: this.selectData
                        }
                        console.log(222222222222)
                        this.$emit('on-change', data)
                        // let lng = 0
                        // let lat = 0
                        // let list =  result.content
                        // for (let i = 0, len = list.length; i < len; i++) {
                        //     let item = list[i]
                        //     if (this.city === item.id) {
                        //         lng = item.lng
                        //         lat = item.lat
                        //     }
                        // }
                        // this.$parent.initMap(lng, lat)
                    }
                })
            }
        },

        // 修改区域
        changeRegion() {
            this.selectData = this.selectData.splice(0,2)
            for(let q = 0;q < this.regionList.length;q++){
                if(this.region == this.regionList[q].id){
                    // this.selectData[2] = this.regionList[q]
                    this.selectData.push(this.regionList[q])
                    let data = {
                        type: 3,
                        selectData: this.selectData
                    }
                    console.log(333333333333333)
                    this.$emit('on-change', data)
                    
                }
            }
            // this.selectData[2] = item
        },
    },
    created () {
        // 填充填入的信息
        this.province = this.addressInfo.province
        this.selectData = []
        if(this.province){
            this.selectData.push({ label: this.addressInfo.provinceName, value: this.addressInfo.province, lng: this.addressInfo.innLongitude, lat: this.addressInfo.innLatitude})
            hotelInforApiServers.getAllCityAdresse({parentid: this.province}).then(result => {
                if (result.code === '000000') {
                    for(let z = 0;z < result.content.length;z++){
                        result.content[z].value = result.content[z].id
                        result.content[z].label = result.content[z].areaname
                    }
                    this.cityList = result.content

                    // for(let q = 0;q < this.data.length;q++){
                    //     if(this.province == this.data[q].id){
                    //         this.selectData.push(this.data[q])
                    //     }
                    // }
                    this.city = this.addressInfo.city
                    if(this.city){
                        this.selectData.push({ label: this.addressInfo.cityName, value: this.addressInfo.city, lng: this.addressInfo.innLongitude, lat: this.addressInfo.innLatitude })
                        hotelInforApiServers.getAllCityAdresse({parentid: this.city}).then(result => {
                            if (result.code === '000000') {
                                for(let z = 0;z < result.content.length;z++){
                                    result.content[z].value = result.content[z].id
                                    result.content[z].label = result.content[z].areaname
                                }
                                this.regionList = result.content

                                // for(let q = 0;q < this.cityList.length;q++){
                                //     if(this.city == this.cityList[q].id){
                                //         this.selectData.push(this.cityList[q])
                                //     }
                                // }
                                this.region = this.addressInfo.region
                                if(this.region){
                                    this.selectData.push({ label: this.addressInfo.regionName, value: this.addressInfo.region, lng: this.addressInfo.innLongitude, lat: this.addressInfo.innLatitude })
                                }
                            }
                        })
                    }
                }
            })
        }
    },
    watch: {
        // selectData: {
        //     handler (val) {
        //         this.$emit('on-change', val)
        //     },
        //     deep:true
        // }
    },
}
</script>

<style lang="scss">
    .areaChoose {
        $base-color: #235F92;

    }
</style>
