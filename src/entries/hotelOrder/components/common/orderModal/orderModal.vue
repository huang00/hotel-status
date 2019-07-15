<template>
    <div class="orderModal">
        <div class="close" @click="closeModal">
            <Icon type="ios-close" style="font-size:36px;font-weight:700" />
            <!-- <i class="iconfont icon-guanbi-"></i> -->
        </div>
        <order-detail-looking :rowData="dataObj"></order-detail-looking>
    </div>
</template>
<script>
import orderDetailLooking from '../orderDetal/orderDetailLooking'

export default {
    name: 'orderModal',
    props: ['dataObj'],
    components: {
        orderDetailLooking
    },
    data() {
        return {
            // isShow: true
        };
    },
    methods: {
        closeModal() {
            this.$emit('closeModal', true)
        },
        createShade() {
            if (!document.getElementById('shadeDiv')) {
                let div = document.createElement('div');
                div.id = 'shadeDiv';
                div.style.cssText =
                    'position: fixed; width: 100%; height: 100%; background: #aaaaaa; opacity: 0.27; top: 0; left: 0;z-index: 1000; ';
                document.body.appendChild(div);
            }
        },
        destroyShade() {
            document.getElementById('shadeDiv') && document.body.removeChild(document.getElementById('shadeDiv'))
        }
    },
    beforeDestroy() {
        this.destroyShade()
    },
    created () {
        this.createShade()
    }
};
</script>

<style lang="scss" scope>
.orderModal {
    width: 800px;
    height: 550px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: white;
    border-radius: 12px;
    box-shadow: 9px 5px 35px #a3a3a3;
    z-index: 1001;
    .close {
        width: 35px;
        height: 35px;
        background-color: rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 5px;
        right: -35px;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
        i {
            font-size: 22px;
            color: #fff;
        }
    }
}
</style>

