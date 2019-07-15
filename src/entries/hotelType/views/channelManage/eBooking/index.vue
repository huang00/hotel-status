<template>
    <div class="eBookingIndex" style="min-width: 1270px; padding-bottom: 20px; padding-top: 20px;">
        <ebooking-main v-if="isLogin" :channelId="channelId"></ebooking-main>
        <ebooking-login v-else></ebooking-login>
        <input type="hidden" v-model="ebooking">
    </div>
</template>

<script>
import ebookingLogin from './eBookingLogin'
import ebookingMain from './eBookingMain'
import { getCookie } from 'common_libs/util'
import { innRoomTypeApiServers } from 'hotelType/api/API'
import { mapActions } from 'vuex'

export default {
    name: 'eBookingIndex',
    components: {
        ebookingLogin,
        ebookingMain
    },
    data () {
        return {
            isLogin: 3,
            channelId: '',
            channelNameObj: {
                '1': '/channelManage',
                '2': ''
            }
        }
    },
    created() {
        /* 获取渠道管理的列表 */
        this.getChannelList()
    },
    computed: {
        ebooking () {
            let list = this.$store.state.hotelStatus.channelList
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].otaId === '1') {
                    let item = list[i]
                    if (item.channelId && item.status === 1) {
                        this.isLogin = 1
                        this.channelId = item.channelId
                        return false;
                    }
                    this.isLogin = 0
                }
            }
            return list
        }
    },
    methods: {
        ...mapActions(['dispatchChannelList']),
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
    }
};
</script>

