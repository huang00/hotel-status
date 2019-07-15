<template>
    <div class="hotelAdd">
        <i-form ref="addForm" :model="addForm" :rules="ruleValidate" :label-width="80" class="form-err">
            <Form-item label="客栈名称" prop="name">
                <i-input  v-model="addForm.name" placeholder="请输入客栈名称" style="width:410px;"></i-input>
            </Form-item>
            <Form-item label="前台电话" prop="phone">
                <i-input v-model="addForm.phone" placeholder="用户联系座机或手机号" style="width:410px;" 
                    @on-keyup="validatePhoneNumber(addForm, 'phone')"
                    @on-blur="validatePhoneNumber(addForm, 'phone')"></i-input>
            </Form-item>
            <Form-item label="所属区域" class="area">
                <Select v-model="addForm.province" style="width:120px;margin-right:22px" placeholder="省份"  @on-change="changeProvince()">
                    <Option :value="item.id" v-for="item in praList" :key="item.id">{{item.areaname}}</Option>
                </Select>

                <Select v-model="addForm.city" style="width:120px;margin-right:22px" placeholder="城市" @on-change="changeCity()">
                    <Option :value="item.id" v-for="item in cityList" :key="item.id">{{item.areaname}}</Option>
                </Select>

                <Select v-model="addForm.region" style="width:120px;" placeholder="区县"  @on-change="changeRegion()">
                    <Option :value="item.id" v-for="item in regionList" :key="item.id">{{item.areaname}}</Option>
                </Select>
                <!-- <i-input :value.sync="addForm.name" placeholder="用户联系座机或手机号" style="width:410px;"></i-input> -->
            </Form-item>
            <Form-item label="详细地址" prop="address"  style="margin-bottom: 0">
                <i-input :maxlength="40" v-model="addForm.address" placeholder="请输入客栈详细地址，无需输入省市区" @on-change="errinfo = ''" @on-enter="searchLocation" style="width:462px;">
                    <Button class="searchButton" slot="append" icon="ios-search" @click="searchLocation"></Button>
                </i-input>
            </Form-item>
            <p style="color: #d67777;height:32px;text-indent: 80px;">{{errinfo}}</p>
            <div>
                <div id="addMap" ref="addMap">
                    <div class="loading" v-show="loading">
                        <Spin style="display:inline-block">
                            <!-- <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
                            <div>Loading</div> -->
                        </Spin>
                    </div>
                </div>
            </div>
        </i-form>
    </div>
</template>

<script>
import TabsNav from 'common_components/TabsNav'
import AppModal from 'common_components/AppModal'
import HotelPeople from 'hotelType/components/common/staffAccount/HotelPeople'
import AddStaff from 'hotelType/components/common/staffAccount/AddStaff'
import ModalHeader from 'hotelType/components/ModalHeader'
import { getCookie, trimAll } from 'common_libs/util.js'
import { hotelInforApiServers, innRoomTypeApiServers } from '../../../../api/API'

// import {
//     validateRule
// } from 'common_libs/util'

export default {
    name: 'hotelAdd',
    data () {
        return {
            addForm: {
                name: '',
                phone:'',
                area:'',
                province:'',
                city:'',
                region:'',
                address:''
            },
            ruleValidate: {
                name: [
                    { required: true, message: '客栈名称不能为空', trigger: 'blur' },
                    { type: 'string', min: 2, max:40, message: '客栈名称长度限制2-40位字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '电话号码不能为空', trigger: 'blur' },
                    { type: 'string', min: 1, max:16,pattern:/^[0-9]*[\s+]{0,}[-]{0,}[0-9]*$/, message: '请输入正确的电话号码', trigger: 'blur' },
                ],
                region: [
                    { required: true, message: '省市区不能为空', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '详细地址不能为空', trigger: 'blur' },
                    { type: 'string', max:40, message: '详细地址最多40位字符', trigger: 'blur' }
                ],
                mail: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                interest: [
                    { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
                    { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
                ],
                date: [
                    { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                ],
                time: [
                    { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请输入个人介绍', trigger: 'blur' },
                    { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                ]
            },

            praList:[],
            cityList:[],
            regionList:[],
            province:'',
            city:'',
            region:'',
            addMap:null,
            selectData:[],
            loading:false,
            polygons:[],
            selectData:[],
            errinfo:'',
            pointPut:[],
            setPointFlag:false
        }
    },
    components: {

    },
    methods: {
        validatePhoneNumber (item, fieldName, callback) {
            item[fieldName] = item[fieldName].replace(/[^0-9\-\s]/g, '')
            callback && callback(item)
        },
        getAllProvinceAdresse () {
            hotelInforApiServers.getAllProvinceAdresse().then(result => {
                if (result.code === '000000') {
                    let list = result.content
                    let emptyList = []
                    for (let i = 0, len = list.length; i < len; i++) {
                        let item = list[i]
                        emptyList.push({
                            ...item,
                            value: item.id,
                            label: item.areaname,
                            children: [],
                            loading: true
                        })
                    }
                    this.praList = emptyList
                }
            })
        },
        initMap (lng, lat) {
            let _this = this
            const addMap = this.addMap = new AMap.Map('addMap',{
                resizeEnable: true,
                zoom: 16 //地图显示的缩放级别
            })
        },
        // 修改省份
        changeProvince() {
            this.addForm.city = ''
            this.addForm.region = ''
            this.cityList = []
            this.regionList = []
            let selectData = []
            if(this.addForm.province){
                hotelInforApiServers.getAllCityAdresse({parentid: this.addForm.province}).then(result => {
                    if (result.code === '000000') {
                        for(let z = 0;z < result.content.length;z++){
                            result.content[z].value = result.content[z].id
                            result.content[z].label = result.content[z].areaname
                        }
                        this.cityList = result.content

                        for(let q = 0;q < this.praList.length;q++){
                            if(this.addForm.province == this.praList[q].id){
                                selectData.push(this.praList[q])
                            }
                        }

                        this.selectData = selectData

                        let data = {
                            type: 1,
                            selectData: this.selectData
                        }
                        this.onChangeAddress(data)
                    }
                })
            }
        },

        // 修改城市
        changeCity() {
            this.addForm.region = ''
            this.regionList = []
            this.selectData = this.selectData.splice(0,1)
            if(this.addForm.city){
                hotelInforApiServers.getAllCityAdresse({parentid: this.addForm.city}).then(result => {
                    if (result.code === '000000') {
                        for(let z = 0;z < result.content.length;z++){
                            result.content[z].value = result.content[z].id
                            result.content[z].label = result.content[z].areaname
                        }
                        this.regionList = result.content

                        for(let q = 0;q < this.cityList.length;q++){
                            if(this.addForm.city == this.cityList[q].id){
                                // this.selectData[1] = this.cityList[q]
                                this.selectData.push(this.cityList[q])
                            }
                        }
                        let data = {
                            type: 2,
                            selectData: this.selectData
                        }
                        this.onChangeAddress(data)
                    }
                })
            }
        },

        // 修改区域
        changeRegion() {
            this.selectData = this.selectData.splice(0,2)
            for(let q = 0;q < this.regionList.length;q++){
                if(this.addForm.region == this.regionList[q].id){
                    // this.selectData[2] = this.regionList[q]
                    this.selectData.push(this.regionList[q])
                    let data = {
                        type: 3,
                        selectData: this.selectData
                    }
                    this.onChangeAddress(data)
                    // this.$emit('on-change', data)
                    
                }
            }
            // this.selectData[2] = item
        },

        // 地图切换
        onChangeAddress(data) {
            let _this = this
            this.loading = true
            let selectData = data.selectData
            this.addMap.clearMap();
            this.addMap.remove(this.polygons)
            this.polygons=[];

            AMap.plugin('AMap.DistrictSearch', () => {
                let district = null
                this.polygons=[];
                if(!district){
                    //实例化DistrictSearch
                    var opts = {
                        subdistrict: 1,   //获取边界不需要返回下级行政区
                        extensions: 'all',  //返回行政区边界坐标组等具体信息
                        level: 'district',  //查询行政级别为 市
                    };
                    district = new AMap.DistrictSearch(opts);
                }
                //行政区查询
                let search = ''
                let zoom = 6
                if(data.type == 1){
                    district.setLevel('province')
                    search = selectData[0].label
                    zoom = 6
                }else if(data.type == 2){
                    district.setLevel('city')
                    search = selectData[1].label
                    zoom = 8
                }else{
                    district.setLevel('district')
                    search = selectData[2].label
                    zoom = 12
                }
                district.search(search, (status, result) => {
                    if(result.info == 'OK'){
                        this.addMap.remove(this.polygons)//清除上次结果
                        this.polygons = [];
                        var bounds = result.districtList[0].boundaries;
                        if (bounds) {
                            for (var i = 0, l = bounds.length; i < l; i++) {
                                //生成行政区划polygon
                                var polygon = new AMap.Polygon({
                                    strokeWeight: 0.5,
                                    path: bounds[i],
                                    fillOpacity: 0,
                                    fillColor: '#80d8ff',
                                    strokeColor: '#0091ea'
                                });
                                this.polygons.push(polygon);
                            }
                        }
                        this.addMap.add(this.polygons)
                        this.addMap.setFitView(this.polygons);//视口自适应
                        this.addMap.setZoom(zoom);

                        var lng = result.districtList[0].center.lng;
                        var lat = result.districtList[0].center.lat;
                        this.pointPut.lng = lng
                        this.pointPut.lat = lat
                        var marker = new AMap.Marker({
                            position: new AMap.LngLat(lng, lat),
                            draggable: true
                        });
                        this.addMap.setCenter([lng,lat]);
                        this.addMap.add(marker);

                        AMap.event.addListener(marker,'dragend',(e) => {
                            let lng = e.lnglat.lng
                            let lat = e.lnglat.lat
                            this.pointPut.lng = lng
                            this.pointPut.lat = lat
                            this.errinfo = ''
                            this.setPointFlag = true
                            // AMap.plugin('AMap.Geocoder', () => {
                            //     let geocoder = new AMap.Geocoder();
                            //     geocoder.getAddress([lng,lat], (status, result) => {
                            //         if (status === 'complete'&&result.regeocode) {
                            //             this.addForm.address = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
                            //         }else{alert(JSON.stringify(result))}
                            //     });
                            // })
                        });
                    }else{
                        console.log('搜索不到该区域')
                        // 澳门特殊处理
                        if(selectData[0].id == 820000 || selectData[0].value == 820000){
                            if(selectData[1].id == 820100){
                                let data = {
                                    type: 1,
                                    selectData: selectData
                                }
                                this.onChangeAddress(data)
                            }
                        }else{
                            let data = {
                                type: 2,
                                selectData: selectData
                            }
                            this.onChangeAddress(data)
                        }
                    }
                    this.loading = false
                })
            })
        },

        // 地址搜索
        searchLocation() {
            /* 搜索本地 */
            let _this = this
            if(!this.addForm.address){
                this.$Message.error('请输入详细地址！')
                return
            }
            this.addMap.clearMap();
            if(this.selectData.length < 2){
                this.$Message.error('请先完善省市区！')
                return
            }
            let selectDataLength = this.selectData.length;
            let searchRange = this.selectData[selectDataLength-1].label

            AMap.plugin('AMap.PlaceSearch', () => {
                var autoOptions = {
                    city: searchRange,
                    citylimit: true,
                }
                var placeSearch = new AMap.PlaceSearch(autoOptions);
                placeSearch.search(this.addForm.address, (status, result) => {
                    if(result.info == 'OK'){
                        if(result.poiList.count > 0){
                            let searchResult = result.poiList.pois[0]
                            let lng = searchResult.location.lng
                            let lat = searchResult.location.lat
                            this.pointPut.lng = lng
                            this.pointPut.lat = lat
                            var marker = new AMap.Marker({
                                position: new AMap.LngLat(lng, lat),
                                draggable: true
                            });
                            this.setPointFlag = true
                            AMap.event.addListener(marker,'dragend',(e) => {
                                let lng = e.lnglat.lng
                                let lat = e.lnglat.lat
                                this.pointPut.lng = lng
                                this.pointPut.lat = lat
                                this.setPointFlag = true
                                // AMap.plugin('AMap.Geocoder', () => {
                                //     let geocoder = new AMap.Geocoder();
                                //     geocoder.getAddress([lng,lat], (status, result) => {
                                //         if (status === 'complete'&&result.regeocode) {
                                //             // _this.searchValue = result.regeocode.formattedAddress
                                //             this.addForm.address = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
                                //         }else{alert(JSON.stringify(result))}
                                //     });
                                // })
                            });
                            this.addMap.setCenter([lng,lat]);
                            this.addMap.add(marker);
                            this.addMap.setZoom(16);
                        }
                    }else{
                        this.errinfo = '*  未查询到该地址，请尝试手动标注！'
                        let len = this.selectData.length;
                        this.addMap.clearMap();
                        if(this.selectData[len-1].lng){
                            let lng = this.selectData[len-1].lng
                            let lat = this.selectData[len-1].lat
                            var marker = new AMap.Marker({
                                position: new AMap.LngLat(lng, lat),
                                draggable: true
                            });
                            this.addMap.add(marker);
                        }
                        this.addMap.setZoom(12);
                        AMap.event.addListener(marker,'dragend',(e) => {
                            let lng = e.lnglat.lng
                            let lat = e.lnglat.lat
                            this.pointPut.lng = lng
                            this.pointPut.lat = lat
                            this.errinfo = ''
                            this.setPointFlag = true
                            // AMap.plugin('AMap.Geocoder', () => {
                            //     let geocoder = new AMap.Geocoder();
                            //     geocoder.getAddress([lng,lat], (status, result) => {
                            //         if (status === 'complete'&&result.regeocode) {
                            //             // _this.searchValue = result.regeocode.formattedAddress
                            //             this.addForm.address = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
                            //         }else{alert(JSON.stringify(result))}
                            //     });
                            // })
                        });
                    }
                // 搜索成功时，result即是对应的匹配数据
                // var node = new PrettyJSON.view.Node({
                //     el: document.querySelector("#input-info"),
                //     data: result
                // });
                })
            })
        },
        
    },
    created () {
        this.getAllProvinceAdresse()
    },
    mounted() {
        this.initMap(104.079809,30.50528)
    }
}
</script>

<style lang="scss">
    .hotelAdd {
        $base-color: #235F92;
        padding: 0 65px;
        height: 535px;
        .ivu-form{
            .ivu-form-item{
                label::after{
                    content: '*';
                    display: inline-block;
                    margin-left: 4px;
                    margin-right: 8px;
                    line-height: 1;
                    font-family: "SimSun";
                    font-size: 12px;
                    color: #ed4014;
                }
                label::before{
                    display: none
                }
            }
        }
        .area{
            label{
                padding-right: 12px !important; 
            }
            label::after{
                content: '*';
                display: inline-block;
                margin-left: 4px;
                line-height: 1;
                font-family: SimSun;
                font-size: 12px;
                color: #ed4014;
            }
        }
        .ivu-input-group-append{
            border: none
        }
        .searchButton {
            background-color: #215D91FF;
            color: white;
            font-size: 18px;
            padding: 0 6px;
            margin-left: 10px;
        }
        #addMap{
            height: 314px;
            width: 545px;
            margin: 0 auto;
            .loading{
                position: absolute;
                width: 545px;
                height: 314px;
                background: #fff;
                opacity: 0.9;
                text-align: center;
                line-height: 314px;
                z-index: 99;
            }
        }
    }
</style>
