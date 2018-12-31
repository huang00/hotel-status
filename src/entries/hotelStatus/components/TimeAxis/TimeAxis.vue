<template>
    <div class="time-axis" :style="{left: scrollLeft + 'px'}">
        <ul>
            <li
                :class="['time-axis-item', item.today?'today':'', item.weekend?'weekend':'', item.weekEn === 0?'Mon':'']"
                v-for="item in dateList" :key="item.strDate">
                <p class="date">
                    {{item.dateView}}
                    <span class="today-mark" v-if="item.today">今</span>
                </p>
                <p class="week">{{item.week}}</p>
                <div style="height: 20px;">
                    <!-- weekend: item.weekend  weekend-->
                    <p 
                        :class="{
                            special: true,
                            festival: item.isFestival
                        }"
                        v-if="item.isFestival"
                    >
                        <span>
                            {{ item.isFestival && item.isFestivalName ? item.isFestivalName: '休息' }}
                        </span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'TimeAxis',
        props: {
            scrollLeft: {
                type: Number,
                default: 0
            }
        },
        computed: {
            dateList() { // 计算属性 。将创建的时间集合计算并返回
                return this.$store.getters.dateList
            }
        }
    }
</script>

<style lang="scss">
    .time-axis {
        position: relative;
        color: #333333;
        font-size: 14px;
        font-family:MicrosoftYaHei;
        width: 3000px;
        .time-axis-item {
            box-sizing: border-box;
            display: inline-block;
            width: 100px;
            padding: 15px 0 3px 3px;
            vertical-align: text-bottom;
            position: relative;
            &.today { background: #FBF4F0; }
            &.weekend { color: #5C84A2; }
            .date {
                .today-mark {
                    width:20px;
                    background:linear-gradient(142deg,rgba(253,89,2,1) 0%,rgba(248,54,29,1) 100%);
                    box-shadow:-1px 2px 6px 0px rgba(255,0,0,0.25);
                    border-radius: 50%;
                    font-size: 12px;
                    margin-left: 5px;
                }
            }
            .special {
                font-size: 12px;
                text-align: right;
                padding-right: 5px;
                height: 20px;
                &.festival {
                    span {
                        background: #E17F4C !important;
                    }
                }
                span {
                    width:50px;
                    background:rgba(47,108,163,1);
                    border-radius:10px;
                }
            }
            span {
                display: inline-block;
                text-align: center;
                line-height: 20px;
                height:20px;
                color: white;
            }
        }
    }
</style>
