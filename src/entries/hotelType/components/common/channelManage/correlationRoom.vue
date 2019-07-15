<template>
    <div class="connectBox">
        <!-- 设置关联房型 -->
        <div class="roomType">
            {{ groupName }}
            <span v-if="show" class="removeConnect" @click="removeConnect"> <span class="removeIcon"></span>解除关联房型</span>
        </div>
        <div class="connectIcon">
            <img src="./img/topDown.png">
        </div>
        <div class="connectItemGroup">
            <div :class="['connectItem', index%4 === 0?'m_l_c':'', index%4 === 3?'m_r_c':'', item.roomTypeId == id?'selected':'', 'text-break-1']" @click="selected(item.roomTypeId)" v-for="(item, index) in roomTypeList" :key="index" :title="item.roomTypeName">{{ item.roomTypeName }}（{{ item.roomTypeNum }}间）</div>
            <div v-if="!roomTypeList.length" class="notData">没有可关联房型</div>
        </div>

        <!-- 确定解除房型关系 -->
        <app-modal v-model="confirmModal" :showHeader="false" :shwoClose="false" :borderRadius=12 :showCancel="true" :width=350 :height=156 @on-ok="removeOk" @on-cancel="cancel"><div class="confirmText">确认解除该关联房型？</div></app-modal>

        <!-- 加载遮罩 -->
        <Spin fix v-if="spinShow">
            <Icon type="ios-loading" size=36 class="spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>

<script>
import { getCookie } from 'common_libs/util'
import { innRoomTypeApiServers } from '../../../api/API'
import AppModal from 'pms-modal'

export default {
    name: 'correlationRoom',
    components: {
        AppModal
    },
    props: {
        groupId: { default: null },
        groupName: { type: String, default: ''},
        roomTypeName: { type: String, default: ''},
        roomTypeId: { default: null },
        roomTypeNum: { default: 0 }
    },
    data () {
        return {
            id: null,
            show: false,
            roomTypeList: [],
            confirmModal: false,
            spinShow: false
        }
    },
    methods: {
        selected (id) {
            this.id = id
        },
        removeConnect () {
            /* 解除房型关系 */
            this.confirmModal = true
        },
        removeOk () {
            let param = {
                userId: getCookie('userId'),
                innId: getCookie('innId'),
                groupId: this.groupId
            }
            this.spinShow = true
            innRoomTypeApiServers.removeMapping(param).then(result => {
                if (result.code === '000000') {
                    this.confirmModal = false
                    this.$emit('on-remove')
                } else {
                    alert(result.message)
                }
                this.spinShow = false
            })
        },
        cancel () {
            console.log('你点击了取消')
        },
        getRoomType () {
            let param = {
                userId: getCookie('userId'),
                innId: getCookie('innId'),
                pmsCode: 'FTPMS'
            }
            innRoomTypeApiServers.getPmsRoomType(param).then(result => {
                if (result.code === '000000') {
                    this.roomTypeList = result.content.pmsRoomTypeList
                    if (this.roomTypeId) {
                        this.roomTypeList.unshift({
                            roomTypeName: this.roomTypeName,
                            roomTypeId: this.roomTypeId,
                            roomTypeNum: this.roomTypeNum
                        })
                    }
                }
            })
        }
    },
    created () {
        this.id = this.roomTypeId
        this.roomTypeId && (this.show = true)
        this.getRoomType()
    },
    watch: {
        id (val) {
            this.$emit('on-selected', val)
        }
    }
}
</script>


<style scoped lang="scss">
    .connectBox {
        .roomType { 
            text-align: center;
            height:21px;
            font-size:20px;
            color: #010101;
            position: relative;
            .removeConnect {
                position: absolute;
                width:123px;
                height:30px;
                line-height: 30px;
                font-size:12px;
                border-radius:12px;
                color: #000000;
                display: inline-block;
                right: 0;
                cursor: pointer;
                .removeIcon {
                    display: inline-block;
                    height: 14px;
                    width: 14px;
                    background: url('./img/removeConnectBlack.png') no-repeat center center;
                    background-size: 100% 100%;
                    vertical-align: sub;
                    margin-right: 5px;
                }
            }
            .removeConnect:hover {
                border: 0;
                background:rgba(11,140,239,1);
                .removeIcon { background-image: url('./img/removeConnectWhite.png'); }
                color: white;
            }
        }
        .connectIcon { 
            text-align: center;
            margin: 25px 0 40px 0;
        }
        .connectItemGroup {
            display: flex;
            flex-wrap: wrap;
            .connectItem {
                width:110px;
                height:32px;
                background:#F3F3F3;
                color: #000000;
                line-height: 32px;
                text-align: center;
                margin: 0 15px;
                margin-bottom: 38px;
                cursor: pointer;
                box-sizing: border-box;
            }
            .connectItem:hover { border: 1px solid #0B8CEF; }
            .connectItem.selected { background-color: #0B8CEF; color: white; }
        }
        .confirmText {
            color: #000000;
            font-size: 16px;
            text-align: center;
            height: 78px;
            line-height: 78px;
        }
        .notData {
            height: 40px;
            line-height: 40px;
            color: #ccc;
            font-size: 16px;
            text-align: center;
            width: 100%;
        }
    }
</style>
