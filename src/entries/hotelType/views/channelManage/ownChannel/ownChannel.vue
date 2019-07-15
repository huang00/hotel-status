<template>
    <div class="wonChannel  f_d">
        <div class="wonChannelMain">
            <div class="defaultChannel">
                <div class="lineTitle">
                    <p>默认渠道<span>（不可修改）</span></p>
                </div>
                <main class="clearfix">
                    <div class="channelGroup" v-for="item in defaultChannel" :key="item.id">
                        <channel-item :data="item"></channel-item>
                    </div>
                </main>
            </div>
            <div class="customChannel">
                <div class="lineTitle">
                    <p>自定义渠道<span>（可修改颜色及名称）</span></p>
                </div>
                <main class="clearfix">
                    <div class="channelGroup" v-for="item in customChannel" :key="item.id">
                        <channel-item :data="item" @on-delete="deleteChannel"></channel-item>
                    </div>
                    <div class="channelGroup">
                        <div class="addChannel">
                            <span class="symbol"  @click="addChannel">
                                <Icon type="md-add" color="#fff" size="27"></Icon>
                            </span>
                            <span class="text">增加新渠道</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <OBJECT id=myColor CLASSID="clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b" width="0px" height="0px"></OBJECT>
        <!-- 删除 -->
        <app-modal v-model="delModal" :showHeader="false" :shwoClose="false" :borderRadius=12 :showCancel="true" :width=350 :height=156 @on-ok="delOk">
            <p class="confirmText"> 确认删除 </p>
        </app-modal>
    </div>
</template>

<script>
import { trimAll, getCookie } from 'common_libs/util.js'
import { innRoomTypeApiServers } from '../../../api/API'
import ChannelItem from '../../../components/common/channelManage/channelItem'
import AppModal from 'pms-modal'
/* import setBrokerage from '../../../common/channelManage/setBrokerage' */

export default {
    name: 'wonChannel',
    components: {
        ChannelItem,
        AppModal
    },
    data () {
        return {
            defaultColor: ['#C90000', '#FF0000', '#FD8383', '#660000', '#D700C5', '#FF80EC', '#870082', '#0078FF', '#00C4C4', '#77BAFF',
            '#0025AF', '#00FF8A', '#00B74D', '#007878', '#AB6F28', '#D1D900', '#A646FF', '#19A58C', '#021065', '#0062D1', '#983900', '#FDC6FF', '#A1FFB9'],
            delChannel: null,
            delModal: false,
            defaultChannel: [], // 默认渠道
            customChannel: []
        }
    },
    methods: {
        addChannel () {
            /* 新增渠道 */
            let len = this.customChannel.length
            if (len && !this.customChannel[len - 1].id) {
                console.log('不能新增')
                return false
            }
            let newChannel = {
                channelColor: this.defaultColor[Math.floor(Math.random() * 20)],
                channelName: '',
                channelType: 2,
                directConnected: 0,
                channelCode: null
            }
            this.customChannel.push(newChannel)
        },
        deleteChannel (data) {
            /* 删除渠道 */
            this.delChannel = data
            this.delModal = true
        },
        delOk () {
            let id = this.delChannel.id
            let list = this.customChannel
            for (let i = 0, len = list.length; i < len; i++) {
                if (id === list[i].id) {
                    innRoomTypeApiServers.deleteChannel({userId: getCookie('userId'), innId: getCookie('innId'), id}).then(result => {
                        if (result.code === '000000') {
                            list.splice(i, 1)
                        } else {
                            alert(result.message)
                        }
                        this.delModal = false
                    })
                }
            }
        },
        getDataList () {
            /* 获取自有渠道列表 */
            let params = {
                userId: getCookie('userId'),
                innId: getCookie('innId')
            }
            innRoomTypeApiServers.findOwnChannel(params).then(result => {
                if (result.code === '000000') {
                    let list = result.content
                    let customChannel = []
                    let emptyList = []
                    for (let i = 0, len = list.length; i < len; i++) {
                        let item = list[i]
                        if (item.channelType === 1) {
                            this.defaultChannel.push(item)
                        } else {
                            customChannel.push(item)
                        }
                    }
                    this.customChannel = customChannel.filter(item => item.deleted === 0)
                }
            })
        },
        getDirectChannel() {
            /* 获取自有渠道列表 */
            let params = {
                userId: getCookie('userId'),
                innId: getCookie('innId')
            }
            innRoomTypeApiServers.findDirectChannel(params).then(result => {
                if (result.code === '000000') {
                    let list = result.content
                    let customChannel = []
                    let emptyList = []
                    for (let i = 0, len = list.length; i < len; i++) {
                        let item = list[i]
                        if (item.channelType === 1) {
                            this.defaultChannel.push(item)
                        } else {
                            customChannel.push(item)
                        }
                    }
                    this.customChannel = customChannel.filter(item => item.deleted === 0)
                    this.getDataList()
                }
            })
        }
    },
    created () {
        this.getDirectChannel()
    }
}
</script>

<style scoped lang="scss">
@import './ownChannel'
</style>

