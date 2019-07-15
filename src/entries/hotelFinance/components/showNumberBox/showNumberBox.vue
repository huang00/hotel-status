<template>
    <div class="showNumberBox">
        <div class="boxWrap" :style="{border:'1px solid ' + borderColor , boxShadow:'0px 1px 15px 0px ' + borderShaw}">
            <div class="boxWrapLeft">
                <img :src="imgSrc" alt="">
            </div>
            <div class="boxWrapRight">
                <div class="numText">
                    <countTo :startVal='0' :separator="','" :endVal='value' :duration='1500' :decimals='2' :style="{fontSize:'26px',color:borderColor}"></countTo>
                    <span style="margin-right:10px">元</span>
                </div>
                <div class="titleText">{{text}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import src from '../../assets/Budget.png'
    import countTo from 'vue-count-to';

    export default {
        name: 'showNumberBox',
        components:{
            countTo
        },
        props: {
            value: { type: Number, default: 0 },                                // 显示数据值
            imgSrc: { default: src },                                           // 显示图片路径
            text: { type: String, default: '' },                                // 显示图片路径
            borderColor: { type: String, default: '#6BB4DAFF' },                // border边框颜色
            borderShaw: { type: String, default: '#C7DFED80' }                  // 阴影
        },
        data() {
            return {
                
            }
        },

        created() {
            
        },
        methods: {}
    }
</script>
<style scoped lang="scss">
    @media screen and (max-width: 1090px) {
        .boxWrap{
            min-width: 260px;
            .boxWrapLeft{
                margin-right:10px
            }
        }
    }
    @media screen and (min-width: 1090px) and (max-width: 1250px) {
        .boxWrap{
            min-width: 280px;
            .boxWrapLeft{
                margin-right: 20px;
            }
        }
    }
    @media screen and (min-width: 1250px) {
        .boxWrap{
            min-width: 300px;
            .boxWrapLeft{
                margin-right:32px
            }
        }
    }
    .boxWrap{
        background: #fff;
        height:97px;
        border-radius:8px;
        .boxWrapLeft{
            float:left;
            width:75px;
            height:45px;
            margin-left:23px;
            margin-top:26px;
        }
        .boxWrapRight{
            float:left;
            margin-top:13px;
            .numText{
                font-size:30px;
                color:#6BB4DAFF;
                span{
                    font-size:14px;
                    color:#9AA7C1FF
                }
            }
            .titleText{
                font-size:16px;
                color:#9AA7C1FF
            }
        }
    }
</style>
