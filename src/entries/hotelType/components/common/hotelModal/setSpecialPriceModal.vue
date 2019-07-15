<template>
    <div class="modalPrice" id="modalPrice">
        <div class="close" @click="closeAddRoomModal"><i class="iconfont icon-guanbi-"></i></div>
        <div class="title">修改特殊价格</div>
        <div class="content">
            设置特殊价格：<input type="text" v-model="price" placeholder="请输入价格">
        </div>
        <button class="affirm" @click='affirm'>确认</button>
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import { innRoomTypeApiServers } from '../../../api/API'
    import { getCookie } from '../../../../../common_libs/util';

    export default {
        name: 'setSpecialPrice',
        props: ['data', 'closeSpecialModa', 'closeSetPriceModal'],
        data() {
            return {
                price: '',
                isUpdate: false,
                specialPriceId: null
            }
        },
        methods: {
            ...mapActions(['dispatchRefreshSpecialPrice']),
            closeAddRoomModal() {
                /* 关闭模态框 */
                let modalPriceBg = document.getElementById('modalPriceBg');
                document.body.removeChild(modalPriceBg);
                this.closeSpecialModa(false);
            },
            affirm() {
                /* 确认 */
                let params = {
                    roomTypeId: this.data.roomTypeId,
                    specialPrice: Number(this.price) * 100,
                    startDay: this.data.fullDate,
                    endDay: this.data.fullDate,
                    innId: getCookie('innId')
                }
                this.data.specialPriceId ? 
                (this.addOrUpdate({...params, id: this.specialPriceId, updateUser: getCookie('userId')}, false)):(this.addOrUpdate(params, true));
                
            },
            addOrUpdate(params, boo) {
                /* true 为新增 false 为更新 */
                let request = boo? 'addSpecialPrice' : 'updateSpecialPrice';
                if (params.specialPrice > 100000000) {
                    alert('数额不可超过1,000,000')
                    return false;
                }
                innRoomTypeApiServers[request](params).then(result => {
                    if(result.code === '000000') {
                        this.closeAddRoomModal();
                        this.dispatchRefreshSpecialPrice()
                        this.$Message.success({
                            duration: 1,
                            content: '设置成功！',
                        });
                        this.closeSetPriceModal(false)

                    } else {
                        alert(result.message)
                    }
                })
            },
            getSpecialPrice() {
                /* 获取特殊价格id */
                let params = {
                    roomTypeId: this.data.roomTypeId,
                    innId: getCookie('innId'),
                    specialPriceId: this.data.specialPriceId
                }
                innRoomTypeApiServers.getSpecialPrice(params).then(result => {
                    if(result.code === '000000') {
                        this.specialPriceId = result.content.id;
                    } else {
                        alert(result.message)
                    }
                })
            }
        },
        created() {
            this.price = this.data.price;
            if(this.data.specialPriceId) {
                this.getSpecialPrice();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .modalPrice {
        width:424px;
        position: absolute;
        z-index: 100001;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius:12px;
        box-shadow:9px 5px 9px rgba(202,202,202,1);
        background: white;
        padding-bottom: 19px;
        .title {
            border-radius:12px 12px 0px 0px;
            line-height:59px;
            background:rgba(236,236,236,1);
            font-size:16px;
            color:rgba(0,0,0,1);
            padding-left: 19px;
        }
        .content{
            padding: 0 55px 0 72px;
            font-size:16px;
            color:rgba(88,88,88,1);
            margin-top: 27px;
            margin-bottom: 59px;
            input {
                width: 178px;
                height: 29px;
                border:1px solid rgba(170,170,170,1);
                border-radius:6px;
            }
        }
        .affirm {
            width:127px;
            line-height:37px;
            background:rgba(7,185,91,1);
            border-radius:19px;
            margin: 0 auto;
            display: block;
        }
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
