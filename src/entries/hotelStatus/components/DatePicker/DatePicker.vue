<template>
    <div class="date-picker">
        <Icon
            type="md-arrow-dropleft"
            style="cursor: pointer;"
            size="25"
            @click="jumpMonth('decrement')"
        />
        <DatePicker
            type="date"
            placeholder="Select date"
            :editable="false"
            v-model="startDate"
            @on-change="onStartDate"
            :options="formatNowTimeOptions"
            style="width: 135px"
            format="yyyy年MM月dd日"></DatePicker>
        <Icon
            type="md-arrow-dropright"
            style="cursor: pointer;"
            size="25"
            @click="jumpMonth('increment')"
        />
        <div class="back-to-today" @click="toToday">
            <p class="icon margin_x_c"></p>
            <p>今日</p>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'

    export default {
        name: 'HotelDatePicker',
        data () {
            return {
                formatNowTimeOptions: {
                    shortcuts: [
                        {
                            text: '今天',
                            value() {
                                return new Date();
                            },
                            onClick: () => {
                                this.toToday()
                            }
                        },
                        {
                            text: '昨天',
                            value() {
                                const yesterday = +new Date() - 3600 * 1000 * 24;
                                return new Date(yesterday)
                            },
                            onClick: () => {
                                const yesterday = +new Date() - 3600 * 1000 * 24;
                                this.setTheCurrentNeedToQueryTheStartTime(new Date(yesterday))
                            }
                        },
                        {
                            text: '一周前',
                            value() {
                                const fiveAgo = +new Date() - 3600 * 1000 * 24 * 7
                                return new Date(fiveAgo)
                            },
                            onClick: () => {
                                const fiveAgo = +new Date() - 3600 * 1000 * 24 * 7
                                this.setTheCurrentNeedToQueryTheStartTime(new Date(fiveAgo))
                            }
                        }
                    ]
                },
                startDate: new Date()
            }
        },
        computed: {
            theCurrentNeedToQueryTheStartTime () {
                return this.$store.getters.theCurrentNeedToQueryTheStartTime
            }
        },
        methods: {
            ...mapMutations([
                'setTheCurrentNeedToQueryTheStartTime'
            ]),
            onStartDate (value, aa) {
                this.setTheCurrentNeedToQueryTheStartTime(new Date(value.replace(/年|月/g, '-').slice(0, -1)))
            },
            jumpMonth (type) {
                // increment  decrement
                let aMonth = 24*3600000*30
                let startTime = type === 'increment' ? +new Date(this.theCurrentNeedToQueryTheStartTime) + aMonth
                    : +new Date(this.theCurrentNeedToQueryTheStartTime) - aMonth
                this.startDate = new Date(startTime)
                this.setTheCurrentNeedToQueryTheStartTime(new Date(startTime))
            },
            toToday () {
                this.setTheCurrentNeedToQueryTheStartTime(new Date())
                this.startDate = new Date()
            }
        }
    }
</script>

<style lang="scss">
    .date-picker {
        border-radius:4px;
        background:linear-gradient(31deg,rgba(216,222,227,1) 0%,rgba(241,241,242,1) 100%);
        padding: 9px;
        .ivu-date-picker {
            .ivu-input-icon-normal {
                display: none;
            }
            .ivu-input {
                padding-right: 7px;
                border-color: transparent;
                font-size: 16px;
                box-shadow: initial;
                color: #2F6CA3;
                border: 0;
                background-color: transparent;
            }
        }
        .back-to-today {
            position: fixed;
            width: 38px;
            height: 42px;
            bottom: 68px;
            right: 30px;
            background:rgba(106,112,118,1);
            border-radius:4px;
            color: white;
            text-align: center;
            cursor: pointer;
            .icon {
                width: 17px;
                height: 10px;
                background: url('./img/back-to-today.png') no-repeat center;
                margin-top: 8px;
                margin-bottom: 4px;
            }
        }
    }
</style>