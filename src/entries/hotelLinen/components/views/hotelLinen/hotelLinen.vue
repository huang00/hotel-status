<template>
    <div class="hotelLinen">
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>
<script>
    // 父容器
    export default {
        name: 'hotelLinen',
        components: {
        },
        data() {
            return {
                
            }
        },
        methods: {

        },
        created() {
            
        },
        mounted () {
            
        }
    }
</script>
<style>
    /* 解决低版本iView中spin组件fix定位和高度问题 */
    .spinFix {
        display: inline-block;
        background-color: #ffffffd1;
    }
    .spinFix > .ivu-spin-main {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        height: auto;
    }
    /* 单行超出省略号 */
    .text-break-1 {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    /* 两行超出省略号 */
    .text-break-2 {
        overflow:hidden;
        text-overflow:ellipsis;
        word-wrap: break-word;
        word-break: break-all;
        line-break: anywhere;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
    }
</style>
<style scoped lang="scss">
    .hotelLinen {
        main {
            padding-top: 70px;
            width: 100%;
        }
    }
</style>
