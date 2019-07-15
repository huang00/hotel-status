<template>
    <div class="eBookingMain f_d">
        <div class="connected">
            <!-- 已直联 -->
            <p class="sectionTile" style="margin-top: 0; ">{{ statusName }}</p>
            <div class="connectedMain clearfix" v-if="connectedRoomTypeList.length">
                <div :class="['roomTypeItem', index%5 === 0?'m_l_c':'', index%5 === 4?'m_r_c':'',]" v-for="(item, index) in connectedRoomTypeList" :key="index">
                    <div class="itemGroup">
                        <custom-select :data="item.details" :groupName="item.groupName"></custom-select>
                        <img src="./img/edit.png" width="16" height="16" @click="editConnect(item)">
                    </div>
                </div>
            </div>
            <div class="notData" v-else>暂无数据</div>
        </div>
        <hr style="border: 1px solid #7E7E7E;">
        <div class="connect">
            <!-- 待关联 -->
            <p class="sectionTile">待关联</p>
            <div class="connectMain clearfix" v-if="connectRoomTypeList.length">
                <div :class="['roomTypeItem', index%5 === 0?'m_l_c':'', index%5 === 4?'m_r_c':'',]" v-for="(item, index) in connectRoomTypeList" :key="index">
                    <div class="itemGroup">
                        <custom-select :data="item.details" :groupName="item.groupName"></custom-select>
                        <img src="./img/connect.png" width="16" height="16" @click="openConnect(item.groupName, item.groupId)">
                    </div>
                </div>
            </div>
            <div class="notData" v-else>暂无数据</div>
            <p class="getUptodateHotelType">
                <span @click="getUptodateHotelType"> <img src="./img/refresh.png"> 获取携程最新房型</span>
            </p>
        </div>
        <!-- 佣金设置，暂时不用 -->
        <!-- <hr style="border: 1px solid #7E7E7E;"> -->
        <!-- <div class="brokerage">
            佣金设置
            <p class="sectionTile">佣金设置</p>
            <div class="brand">
                <div :class="['brandItem', item.className]" v-for="(item ,index) in brokerageList" :key="index">
                    <p v-if="'ratio' === item.brokerageMethod">{{item.value}} %</p>
                    <p v-if="'fixed' === item.brokerageMethod">￥&nbsp;{{item.value}}</p>
                    <p @click="setBrokerage(item.channelName)">佣金设置 <Icon type="ios-arrow-right" size=14></Icon><Icon size=14 type="ios-arrow-right"></Icon></p>
                </div>
            </div>
        </div> -->
        <!-- 佣金设置模态框 -->
        <app-modal v-model="brokerageModal" title="佣金设置" :width=414 :height=244 @on-ok="brokerageOk" @on-cancel="cancel('brokerage')">
            <set-brokerage :brokerageValue="brokerageValue" :brokerageMethod="brokerageMethod" @no-selected="noSelected"></set-brokerage>
        </app-modal>

        <!-- 直联 -->
        <app-modal v-model="openConnectModal" :showHeader="false" @on-ok="connectOk" @on-cancel="cancel('connect')">
            <correlation-room :roomTypeId="correlationObj.roomTypeId" :groupId="connectGrouId" :roomTypeName="correlationObj.roomTypeName" :roomTypeNum="correlationObj.roomTypeNum" :groupName="correlationObj.groupName"  @on-selected="onConnectId" @on-remove="onRemove"></correlation-room>
        </app-modal>

        <!-- 确定绑定房型关系 -->
        <app-modal v-model="confirmBindMappingModal" :showHeader="false" :shwoClose="false" :borderRadius=12 :showCancel="true" :width=350 :height=156 @on-ok="confirmBindMapping" @on-cancel="confirmBindMappingModal = false"><div class="confirmText">确认关联该关联房型？</div></app-modal>

        <!-- 加载中 -->
        <Loading :show="showLoading" :success="loadSuccess" @on-success="onSuccess"></Loading>

        <!-- 加载遮罩 -->
        <Spin fix v-if="spinShow">
            <Icon type="load-a" size=36 class="spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>

<script>
import { getCookie } from 'common_libs/util'
import { innRoomTypeApiServers } from '../../../api/API'
import AppModal from 'pms-modal'
import customSelect from '../../../components/common/channelManage/customSelect'
import setBrokerage from '../../../components/common/channelManage/setBrokerage'
import correlationRoom from '../../../components/common/channelManage/correlationRoom'
import Loading from '../../../components/common/channelManage/Loading'

export default {
    name: 'eBookingMain',
    props: ['channelId'],
    components: {
        AppModal,
        customSelect,
        setBrokerage,
        correlationRoom,
        Loading
    },
    data () {
        return {
            brokerageModal: false, // 佣金设置模态框
            brokerageMethod: '', // 佣金收费方式
            brokerageValue: '', // 佣金值
            brokerageObj: {}, // 佣金组件返回对象
            openConnectModal: false, // 关联房型模态框
            confirmBindMappingModal: false, // 确定绑定房型
            channelName: '',    // 渠道名称
            showLoading: false, // 是否显示下拉加载组件
            loadSuccess: false, // 加载成功标记
            brokerageList: [
                {
                    channelName: 'qunar',
                    value: '50',
                    className: 'qunar',
                    brokerageMethod: 'ratio'
                },
                {
                    channelName: 'ctrip',
                    value: '20',
                    className: 'ctrip',
                    brokerageMethod: 'ratio'
                },
                {
                    channelName: 'elong',
                    value: '90',
                    className: 'elong',
                    brokerageMethod: 'fixed'
                }
            ], // 底部佣金设置列表
            connectRoomTypeList: [], // 待关联
            connectedRoomTypeList: [], // 已关联
            connectSelectedId: null, // 房型id
            connectGrouId: null, // groupId
            correlationObj: {  // 建立关联传入到子组件对象
                roomTypeId: null,
                groupName: '',
                roomTypeName: '',
                roomTypeNum: 0
            },
            spinShow: false,
            statusName: '待审核'
        }
    },
    methods: {
        setBrokerage (channelName) {
            /* 打开设置佣金模态框 */
            this.brokerageModal = true
            this.channelName = channelName
            for (let i = 0, len = this.brokerageList.length; i < len; i++) {
                if (this.channelName === this.brokerageList[i].channelName) {
                    this.brokerageMethod = this.brokerageList[i].brokerageMethod
                    this.brokerageValue = this.brokerageList[i].value
                }
            }
        },
        brokerageOk () {
            /* 设置佣金确认 */
            this.brokerageModal = false
            for (let i = 0, len = this.brokerageList.length; i < len; i++) {
                if (this.channelName === this.brokerageList[i].channelName) {
                    this.brokerageList[i].value = this.brokerageObj.value
                    this.brokerageList[i].brokerageMethod = this.brokerageObj.method
                }
            }
        },
        noSelected (obj) {
            /* 监听模态框返回来的值 */
            this.brokerageObj = obj
        },
        openConnect (name, id) {
            /* 建立关联 */
            this.openConnectModal = true
            this.connectGrouId = id
            this.correlationObj.groupName = name
        },
        editConnect (item) {
            /* 编辑关联 */
            this.correlationObj = {
                roomTypeId: item.roomTypeId,
                groupName: item.groupName,
                roomTypeName: item.roomTypeName,
                roomTypeNum: item.roomTypeNum
            }
            this.connectGrouId = item.groupId
            this.openConnectModal = true
        },
        onConnectId (id) {
            this.connectSelectedId = id
        },
        onRemove () {
            /* 解除关联成功 */
            this.cancel('connect')
            this.getMapping()
        },
        confirmBindMapping () {
            /* 确定绑定mapping关系 */
            let param = {
                userId: getCookie('userId'),
                innId: getCookie('innId'),
                groupId: this.connectGrouId,
                roomTypeId: this.connectSelectedId
            }
            this.spinShow = true
            innRoomTypeApiServers.updateMapping(param).then(result => {
                if (result.code === '000000') {
                    this.getMapping()
                    this.cancel('connect')
                } else {
                    alert(result.message)
                }
                this.spinShow = false
            })
        },
        connectOk () {
            /* 确定绑定mapping关系 */
            if (!this.connectSelectedId) {
                alert('请选择关联房型')
                return false
            }
            this.confirmBindMappingModal = true
        },
        cancel (type) {
            if (type === 'connect') {
                this.openConnectModal = false
                this.confirmBindMappingModal = false
                this.correlationObj = {
                    roomTypeId: null,
                    roomTypeName: '',
                    groupName: '',
                    roomTypeNum: 0
                }
            }
            this.connectSelectedId = null
            this.connectId = null
        },
        onSuccess (bool) {
            /* 请求成功 */
            console.log('加载成功, ', bool)
            this.showLoading = false
            this.loadSuccess = false
        },
        getUptodateHotelType () {
            /* 获取最新ota房型数据 */
            this.showLoading = true
            let param = {
                userId: getCookie('userId'),
                innId: getCookie('innId'),
                channelId: this.channelId
            }
            innRoomTypeApiServers.getUptodateHotelType(param).then(result => {
                if (result.code === '000000') {
                    this.loadSuccess = true
                    this.getMapping()
                } else {
                    this.loadSuccess = true
                    setTimeout(() => {
                        this.showLoading = false
                    }, 500)
                    alert(result.message)
                }
            })
        },
        getMapping () {
            /* 获取mapping房型 */
            let param = {
                userId: getCookie('userId'),
                innId: getCookie('innId'),
                channelId: this.channelId
            }
            innRoomTypeApiServers.getMapping(param).then(result => {
                if (result.code === '000000') {
                    this.connectedRoomTypeList = []
                    this.connectRoomTypeList = []
                    let list = result.content.pmsRoomTypeList
                    for (let i = 0, len = list.length; i < len; i++) {
                        let item = list[i]
                        if (item.roomTypeId) {
                            this.connectedRoomTypeList.push(item)
                        } else {
                            this.connectRoomTypeList.push(item)
                        }
                    }
                }
            })
            innRoomTypeApiServers.getAuditingRoomType(param).then(result => {
                if (result.code === '000000') {
                    this.statusName = result.content.statusId ? '已直连' : '待审核'
                }
            })
        }
    },
    created () {
        this.channelId &&
            this.getMapping()
        // innRoomTypeApiServers.findDirectChannel({userId: getCookie('userId'), innId: getCookie('innId')}).then(result => {
        // })
    },
    watch: {
        channelId (val) {
            val &&
                this.getMapping()
        }
    }
}
</script>

<style scoped lang="scss">
@import './css/eBookingMain'
</style>
