<template>
    <div class="hotelForm">
        <div class="hotelFormCard">
            <Card style="border-radius: 10px; padding: 0 34px;">
                <ul class="hotel-info-list fontSizi14 textCent">
                    <template v-if="true">
                        <li class="hotel-info-list-head fontSizi16">
                            <div class="item-name" style="color:#205C91">信息</div>
                            <div class="item-name" style="text-align:left;text-indent:220px;color:#205C91">内容</div>
                            <div class="item-name" style="color:#205C91">操作</div>
                        </li>

                        <li class="hotel-item" :style="{'backgroundColor':!switchSave.innName?'#FAFAFA':'#E8EDF8'}">
                            <div class="item-name" style="color:#205C91FF">客栈名称</div>
                            <div class="item-name">
                                <Input v-if="switchSave.innName" v-model="hotelInfoForm.innName" :maxlength="40" placeholder="请输入客栈名称"></Input>
                                <p v-if="!switchSave.innName">{{hotelInfoForm.innName || '未填写'}}</p>
                            </div>
                            <div class="item-name">
                                <div class="buttons-wrapper margin_x_c">
                                    <span v-if="!switchSave.innName && $parent.hasHotelPermission" class="public-buttons edit" @click="changeEmit('innName')">修改</span>
                                    <span v-if="!$parent.hasHotelPermission" class="public-buttons disabled">修改</span>
                                    <span v-if="switchSave.innName" class="public-buttons save" @click="switchSaveMethod('innName')">保存</span>
                                    <span v-if="switchSave.innName" class="public-buttons cancle" @click="cancle('innName')">取消</span>
                                </div>
                            </div>
                        </li>
                        
                        <li class="hotel-item" :style="{'backgroundColor':!switchSave.telephone?'#FAFAFA':'#E8EDF8'}">
                            <div class="item-name" style="color:#205C91FF">前台电话</div>
                            <div class="item-name">
                                <Input v-if="switchSave.telephone" v-model="hotelInfoForm.telephone" placeholder="请输入前台电话"
                                    @on-keyup="validatePhoneNumber(hotelInfoForm, 'telephone')"
                                    @on-blur="validatePhoneNumber(hotelInfoForm, 'telephone')"></Input>
                                <p v-if="!switchSave.telephone">{{hotelInfoForm.telephone || '未填写'}}</p>
                            </div>
                            <div class="item-name">
                                <div class="buttons-wrapper margin_x_c">
                                    <span v-if="!switchSave.telephone && $parent.hasHotelPermission" class="public-buttons edit" @click="changeEmit('telephone')">修改</span>
                                    <span v-if="!$parent.hasHotelPermission" class="public-buttons disabled">修改</span>
                                    <span v-if="switchSave.telephone" class="public-buttons save" @click="switchSaveMethod('telephone')">保存</span>
                                    <span v-if="switchSave.telephone" class="public-buttons cancle" @click="cancle('telephone')">取消</span>
                                </div>
                            </div>
                        </li>
                        
                        <li class="hotel-item" :style="{'backgroundColor':!switchSave.roomNum?'#FAFAFA':'#E8EDF8'}">
                            <div class="item-name" style="color:#205C91FF">房间数量</div>
                            <div class="item-name">
                                <Input v-if="switchSave.roomNum" v-model="hotelInfoForm.roomNum" placeholder="请输入房间数量"
                                    @on-keyup="validateRoomNum(hotelInfoForm, 'roomNum')"
                                    @on-blur="validateRoomNum(hotelInfoForm, 'roomNum')"></Input>
                                <p v-if="!switchSave.roomNum">{{hotelInfoForm.roomNum || '未填写'}}</p>
                            </div>
                            <div class="item-name">
                                <div class="buttons-wrapper margin_x_c">
                                    <span v-if="!switchSave.roomNum && $parent.hasHotelPermission" class="public-buttons edit" @click="changeEmit('roomNum')">修改</span>
                                    <span v-if="!$parent.hasHotelPermission" class="public-buttons disabled">修改</span>
                                    <span v-if="switchSave.roomNum" class="public-buttons save" @click="switchSaveMethod('roomNum')">保存</span>
                                    <span v-if="switchSave.roomNum" class="public-buttons cancle" @click="cancle('roomNum')">取消</span>
                                </div>
                            </div>
                        </li>

                        <li class="hotel-item" :style="{'backgroundColor':!switchSave.openingDate?'#FAFAFA':'#E8EDF8'}">
                            <div class="item-name" style="color:#205C91FF">开业时间</div>
                            <div class="item-name">
                                <DatePicker confirm :clearable="false" v-if="switchSave.openingDate" type="date" placeholder="请选择开业时间" @on-change="onBusinessDate" format="yyyy-MM-dd" style="width: 400px" :editable="false" v-model="hotelInfoForm.openingDate"></DatePicker>
                                <p v-else>{{hotelInfoForm.openingDate || '未填写'}}</p>
                            </div>
                            <div class="item-name">
                                <div class="buttons-wrapper margin_x_c">
                                    <span v-if="!switchSave.openingDate && $parent.hasHotelPermission" class="public-buttons edit" @click="changeEmit('openingDate')">修改</span>
                                    <span v-if="!$parent.hasHotelPermission" class="public-buttons disabled">修改</span>
                                    <span v-if="switchSave.openingDate" class="public-buttons save" @click="switchSaveMethod('openingDate')">保存</span>
                                    <span v-if="switchSave.openingDate" class="public-buttons cancle" @click="cancle('openingDate')">取消</span>
                                </div>
                            </div>
                        </li>

                        <li class="hotel-item" :style="{'backgroundColor':!switchSave.decorationDate?'#FAFAFA':'#E8EDF8'}">
                            <div class="item-name" style="color:#205C91FF">最近装修时间</div>
                            <div class="item-name">
                                <DatePicker confirm :clearable="false" v-if="switchSave.decorationDate" v-model="hotelInfoForm.decorationDate" @on-change="onDecorationDate" style="width: 400px" :editable="false" format="yyyy-MM-dd" type="date" placeholder="请填写最近装修时间"></DatePicker>
                                <p v-else>{{hotelInfoForm.decorationDate || '未填写'}}</p>
                            </div>
                            <div class="item-name">
                                <div class="buttons-wrapper margin_x_c">
                                    <span v-if="!switchSave.decorationDate && $parent.hasHotelPermission" class="public-buttons edit" @click="changeEmit('decorationDate')">修改</span>
                                    <span v-if="!$parent.hasHotelPermission" class="public-buttons disabled">修改</span>
                                    <span v-if="switchSave.decorationDate" class="public-buttons save" @click="switchSaveMethod('decorationDate')">保存</span>
                                    <span v-if="switchSave.decorationDate" class="public-buttons cancle" @click="cancle('decorationDate')">取消</span>
                                </div>
                            </div>
                        </li>

                        <li class="hotel-item" :style="{'backgroundColor':!switchSave.hasHotelPermission?'#FAFAFA':'#E8EDF8'}">
                            <div class="item-name" style="line-height:360px;color:#205C91FF">客栈地址</div>
                            <div class="item-name">
                                <p style="line-height:1;margin-bottom:5px;margin-top: 13px;">{{hotelInfoForm.provinceName + hotelInfoForm.cityName + hotelInfoForm.regionName + hotelInfoForm.address}}</p>
                                <div id="showMap" ref="showMap"></div>
                            </div>
                            <div class="item-name" style="line-height:360px;">
                                <div class="buttons-wrapper margin_x_c">
                                    <span v-if="$parent.hasHotelPermission" class="public-buttons edit" @click="openAddressModel">修改</span>
                                    <span v-if="!$parent.hasHotelPermission" class="public-buttons disabled">修改</span>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </Card>
        </div>
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
import {mapState, mapGetters, mapActions} from "vuex"
import {
    publicHttpServer
} from '@/api/api'


// import {
//     validateRule
// } from 'common_libs/util'

export default {
    name: 'hotelForm',
    data () {
        return {
            switchSave: {
                innName: false,
                telephone: false,
                roomNum: false,
                openingDate: false,
                decorationDate: false,
            },
            hotelInfoForm: {
                innName: '',
                telephone: '',
                roomNum: '',
                openingDate: '',
                decorationDate: '',
                address: ''
            },
            copyData:null,
            modal: false,
            showMap:null,
            hotelListData:[],
        }
    },
    components: {
        TabsNav,
        HotelPeople,
        AddStaff,
        AppModal,
        ModalHeader
    },
    methods: {
        ...mapActions([
            'getHotelList',
        ]),
        validatePhoneNumber (item, fieldName, callback) {
            item[fieldName] = item[fieldName].replace(/[^\d+$\-\s]/g, '')
            callback && callback(item)
        },
        validateRoomNum(item, fieldName, callback){
            item[fieldName] = item[fieldName].replace(/[^\d+$]/g, '')
            callback && callback(item)
        },
        // 获取门店信息
        getHotelInfo (data) {
            hotelInforApiServers.getHotelInfo(data).then(result => {
                if (result.code === '000000') {
                    result = result.content
                    this.hotelInfoForm = Object.assign(result, {
                        openingDate: this.dateFormat(result.openingDate),
                        decorationDate: this.dateFormat(result.decorationDate)
                    })
                    this.copyData = JSON.parse(JSON.stringify(this.hotelInfoForm))
                    this.$parent.addressInfo = this.copyData
                    if(this.copyData.innLongitude == 'undefined' || this.copyData.innLatitude == 'undefined' || !this.copyData.innLongitude || !this.copyData.innLatitude){
                        this.copyData.innLongitude = 116.397477
                        this.copyData.innLatitude = 39.908692
                    }
                    this.initShowMap(this.copyData.innLongitude,this.copyData.innLatitude)
                    // this.computedPercent()
                }
            })
        },
        // 保存门店信息
        switchSaveMethod (name) {
            if(name == 'innName'){
                if(this.hotelInfoForm.innName.length < 2){
                    this.$Message.error('客栈名不能小于2个字符！')
                    return
                }
                if(this.hotelInfoForm.innName.length > 40){
                    this.$Message.error('客栈名不能大于40个字符！')
                    return
                }
            }
            if(name == 'telephone'){
                let reg = /^[0-9]*[\s+]{0,}[-]{0,}[0-9]*$/;
                if(this.hotelInfoForm.telephone.length < 1){
                    this.$Message.error('请填写前台电话号码！')
                    return
                }
                if(this.hotelInfoForm.telephone.length > 16){
                    this.$Message.error('请填写正确的前台电话号码！')
                    return
                }
                if(!reg.test(this.hotelInfoForm.telephone)){
                    this.$Message.error('请填写正确的前台电话号码！')
                    return
                }
            }
            if(name == 'roomNum'){
                // if(this.hotelInfoForm.roomNum.length < 1){
                //     this.$Message.error('请填写房间数量！')
                //     return
                // }
                if(this.hotelInfoForm.roomNum.length > 8){
                    this.$Message.error('房间数量过大')
                    return
                }
                // if(this.hotelInfoForm.roomNum == ""){
                //     this.hotelInfoForm.roomNum = 0
                // }
            }
            if (this.switchSave[name]) {
                hotelInforApiServers.updateHotelInfo(this.hotelInfoForm).then(result => {
                    if (result.code === '000000') {
                        this.$Message.success('修改成功！')
                        this.switchSave[name] = false
                        // this.getHotelInfo()
                        if(name == 'innName'){
                            this.getHotelList()
                        }
                        if(name == 'openingDate'){
                            if(this.hotelInfoForm.openingDate){
                                if(JSON.stringify(this.hotelInfoForm.openingDate).length > 20){
                                    this.hotelInfoForm.openingDate = this.dateFormat(this.hotelInfoForm.openingDate)
                                }
                            }
                        }
                        if(name == 'decorationDate'){
                            if(this.hotelInfoForm.decorationDate){
                                if(JSON.stringify(this.hotelInfoForm.decorationDate).length > 20){
                                    this.hotelInfoForm.decorationDate = this.dateFormat(this.hotelInfoForm.decorationDate)
                                }
                            }
                        }                        
                    } else {
                        alert(result.message)
                    }
                })
            } else {
                this.switchSave[name] = true
            }
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
        onBusinessDate (date) {
            this.hotelInfoForm.openingDate = date
        },
        onDecorationDate (date) {
            this.hotelInfoForm.decorationDate = date
        },

        // 点击修改
        changeEmit(type) {
            this.switchSave[type] = true
        },

        // 返回
        cancle(type) {
            this.switchSave[type] = false
            // this.switchSave = {
            //     innName: false,
            //     telephone: false,
            //     roomNum: false,
            //     openingDate: false,
            //     decorationDate: false,
            // }
            this.hotelInfoForm = JSON.parse(JSON.stringify(this.copyData))
        },

        // 打开地址编辑
        openAddressModel() {
            this.$emit('on-open')

            // this.$parent.modal = true
            // console.log(this.$parent.addressInfo)
            // console.log(this.$parent.$refs.detailAddress)
            // this.$parent.$refs.detailAddress.addressInfo = this.$parent.addressInfo

        },

        // 初始化地图
        initShowMap(lng,lat) {
            const showMap = this.showMap = new AMap.Map('showMap',{
                resizeEnable: true,
                center: [lng, lat],//地图中心点
                zoom: 16, //地图显示的缩放级别
                scrollWheel: false,
                dragEnable: false,
                doubleClickZoom: false
            })
            

            var marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),
                // offset: new AMap.Pixel(-10, -10),
            });

            showMap.add(marker);
        },

        // 检车房间数量输入
        checkRoomNum(){
            var regPos = /^\d+$/;
            if(regPos.test(this.hotelInfoForm.roomNum)){
                return true;
            }else{
                this.hotelInfoForm.roomNum = 0
                return false;
            }
        }
    },
    created () {
        
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
        userPermissionList () {
            return this.$store.getters.userPermissionList
        },
        userInfo () {
            return this.$store.getters.userInfo
        }
    },
    mounted() {
        if(this.hotelList.length > 0){
            // 查看是否有门店信息权限
            let content = this.userPermissionList
            let data = {
                userId: getCookie('userId'),
                innId: this.$parent.$refs.tabsNav.activeId,
            }
            for(let z = 0;z < content.length;z++){
                if(content[z] === 'R_INN_MANAGER'){
                    this.$parent.hasHotelPermission = true
                }
            }
            this.getHotelInfo(data)
        }
    },
    watch : {
        hotelList : {
            handler (val) {
                if(val.length > 0){
                    // 查看是否有门店信息权限
                    let data = {
                        userId: getCookie('userId'),
                        innId: this.$parent.$refs.tabsNav.activeId,
                    }
                    let { innList } = this.userInfo
                    if(!innList){
                        setTimeout( () => {
                            let { innListNew } = this.$store.getters.userInfo
                            for (let i = 0, len = innListNew.length; i < len; i++) {
                                let item = innListNew[i]
                                if (this.$parent.$refs.tabsNav.activeId == item.innId) {
                                    let content = item.permissions
                                    for(let z = 0;z < content.length;z++){
                                        if(content[z] === 'R_INN_MANAGER'){
                                            this.$parent.hasHotelPermission = true
                                        }
                                    }
                                }
                            }
                        },1000)
                    }else{
                        for (let i = 0, len = innList.length; i < len; i++) {
                            let item = innList[i]
                            if (this.$parent.$refs.tabsNav.activeId == item.innId) {
                                let content = item.permissions
                                for(let z = 0;z < content.length;z++){
                                    if(content[z] === 'R_INN_MANAGER'){
                                        this.$parent.hasHotelPermission = true
                                    }
                                }
                            }
                        }
                    }
                    this.getHotelInfo(data)
                }
            }
        }
    },
}
</script>

<style lang="scss">
    .hotelForm {
        $base-color: #235F92;
        .hotelFormCard{
            .ivu-card-bordered{
                border-top: none !important;
                border: none !important;
            }
            .ivu-card:hover{
                box-shadow: none !important;
            }
        }
        .hotel-info-list {
            .hotel-info-list-head{
                color: #205C91;
                font-family:"PingFangSC-Regular";
                font-weight:400;
            }
            .hotel-item {
                color: #999999;
                background-color: #FAFAFA;
                border-left: 4px solid $base-color;
                margin-bottom: 20px;
                cursor: pointer;
                .buttons-wrapper {
                    width: 230px;
                    .disabled{
                        background: linear-gradient(270deg,#ebebeb,#e0e0e0);
                    }
                }
                #showMap{
                    height: 314px;
                    max-width: 600px;
                }
            }
            .hotel-item:hover{
                background-color: #E8EDF8 !important;
            }
        }
        li {
            display: flex;
            .item-name {
                color: #9AA7C1;
                line-height: 46px;
                p{
                    text-align: left;
                }
            }
            .item-name:nth-child(1){
                flex: 1;
            }
            .item-name:nth-child(2){
                flex: 2;
            }
            .item-name:nth-child(3){
                flex: 1;
            }
        }
    }
</style>
