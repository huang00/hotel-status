<template>
    <div class="not-order-data margin_x_c">
        <div>
            <img src="./img/nohouse.png">
            <p style="font-size: 14px; color: #666666; margin-top: 20px;">未配置房型</p>
            <p style="color: #999999;">到房型管理新建房型</p>
            <p class="arrow-down tooltip margin_x_c">新建一个房型试试吧！</p>
            <span
                class="new-room-type"
                @click="jumpToRoomType"
            >新建房型</span>  
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NotOrderData',
        computed: {
            userPermissionList () {
                return this.$store.getters.userPermissionList
            }
        },
        methods: {
            jumpToRoomType () {
                this.userPermissionList.map(item => {
                    if (item === 'R_ROOM_MANAGER')
                        window.location.href = '/hotelStatus/hotelType.html'
                })
                this.$Message.warning('暂无房型添加权限！')
            }
        }
    }
</script>

<style lang="scss">
.not-order-data {
    text-align: center;
    width: 340px;
    padding-right: 120px;
    margin-top: 130px;
    .new-room-type {
        color: white;
        font-size: 14px;
        display: inline-block;
        width:92px;
        line-height:35px;
        background:linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
        box-shadow:0px 2px 9px 0px rgba(76,136,152,0.15);
        border-radius:18px;
        cursor: pointer;
        margin-top: 15px;
    }
    .tooltip {
        width:165px;
        height:40px;
        line-height: 40px;
        color: white;
        background-color: rgba(0, 0, 0, .5);
        border-radius:4px;
        margin-top: 22px;
        position: relative;
        &:before {
            left: 72px !important;
        }
    }
}
</style>
