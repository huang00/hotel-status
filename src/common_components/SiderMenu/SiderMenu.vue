<template>
    <menu class="sider-menu">
        <div class="logo">
            <img src="./image/logo.png" class="position_c" alt="logo">
        </div>
        <div class="hotel-name">
            龙门客栈
        </div>
        <ul class="menu-main">
            <li
                v-for="(item, index) in menuList"
                :key="index"
                :class="{
                    active: page === item.page
                }"
                @click="jumpToPage(item.path)">
                <span class="icon"></span> {{item.name}}
            </li>
        </ul>
    </menu>
</template>

<script>
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
                menuList: [
                    { name: '房态', path: '/hotelStatus/hotelStatus.html', page: 'hotelStatus' },
                    { name: '财务', path: '/hotelStatus/hotelFinance.html', page: 'hotelFinance' },
                    { name: '订单', path: '/hotelOrder/hotelOrder.html', page: 'hotelOrder' },
                    { name: '管理', path: '/hotelType/hotelType.html', page: 'hotelType' },
                    { name: '金融', path: '/wefintFinance/wefintFinance.html', page: 'wefintFinance'},
                    { name: '布草', path: '/hotelOrder/hotelLinen.html', page: 'hotelLinen' }
                ]
            }
        },
        methods: {
            jumpToPage (path) {
                window.location.href=`${path}`
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
    .logo {
        height: 120px;
        position: relative;
        background: url('./image/logo-bg.png') no-repeat center;
        background-color: white;
    }
    .hotel-name {
        color: #333333;
        line-height: 55px;
        font-size: 16px;
        text-align: center;
        font-family: '微软雅黑';
        font-weight: 600;
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
                width: 17px;
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
        li:nth-child(1):hover .icon,
        li:nth-child(1).active .icon {
            background-position: -0px 3px;
        }
        li:nth-child(2):hover .icon,
        li:nth-child(2).active {
            background-position: -2px -28px;
        }
        li:nth-child(3):hover .icon,
        li:nth-child(3).active .icon {
            background-position: 0 -56px;
        }
        li:nth-child(4):hover .icon,
        li:nth-child(4).active .icon {
            background-position: 0 -85px;
        }
        li:nth-child(5):hover .icon,
        li:nth-child(5).active .icon {
            background-position: 0 -115px;
        }
        li:nth-child(6):hover .icon,
        li:nth-child(6).active .icon {
            background-position: 0 -145px;
        }
        li:nth-child(1) .icon {
            background-position: -30px 3px;
        }
        li:nth-child(2) .icon { 
            background-position: -32px -28px;
        }
        li:nth-child(3) .icon {
            background-position: -30px -56px;
        }
        li:nth-child(4) .icon {
            background-position: -30px -85px;
        }
        li:nth-child(5) .icon {
            background-position: -30px -115px;
        }
        li:nth-child(6) .icon {
            background-position: -30px -145px;
        }
    }
    /*********************** 居中 ***********************/
    .position_c {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
}
</style>
