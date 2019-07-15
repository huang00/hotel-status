<template>
    <div>
        <div class="mainbox">
            <p>订单提交成功</p>
            <p>请等待系统分配取件员</p>
            <img src="./img/check-coupon.png" alt="">
            <div class="corner"></div>
        </div>
        <div class="detailBtn" @click="toDetail">查看订单详情</div>
    </div>
</template>

<script>
    export default {
        name: 'linenSuccess',
        data () {
            return {

            }
        },
        components: {
        },
        methods: {
            toDetail() {
                this.$router.push({
                    name: 'linenDetail',
                    params: { orderId: this.$route.params.orderId }
                })
            }
        },
        created() {
            // console.log(this.$route.params);
        },
    }
</script>

<style scoped lang="scss">
    .mainbox{
        height: 265px;
        width: 580px;
        position: absolute;
        margin: auto;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -70%);
        border: 2px solid rgba(101,183,217,1);
        box-shadow: 5px 0px 8px rgba(2,58,81,0.26);
        color:rgba(126,196,225,1);
        text-align: center;
        img {
            position: absolute;
            left: 78px;
            top: 45px;
            height: 122px;
            width: 129px;
        }
        p:nth-child(1) {
            font-size:30px;
            position: absolute;
            top: 100px;
            left: 225px;
        }
        p:nth-child(2) {
            font-size:24px;
            position: absolute;
            bottom: 50px;
            width: 100%;
        }
        .corner {
            background: url(./img/success-corner.png);
            width: 164px;
            height: 156px;
            position: absolute;
            left: -68px;
            bottom: -54px;
            z-index: 3;
        }
    }
    .detailBtn {
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translateX(-50%);
        width: 225px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        color: #FFFFFF;
        font-size:24px;
        background: rgba(112,189,221,1);
        border: 1px solid rgba(101,183,217,1);
        border-radius: 10px;
        cursor: pointer;
    }
 
</style>
