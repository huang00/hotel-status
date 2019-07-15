<template>
    <div class="setSpeciaPrice">
        <ul class="selectMounth">
            <li class='selectMounthList' v-for="(item,value) in mouthList" :key="value">
                <span :class="value ===selectMonth? 'actions':''" @click="changeMonthAndCreatCalenDar(value,item)">{{item.name}}</span>
            </li>
        </ul>
        <div class="calendarWatch">
            <div class="labelHead">日历表</div>
            <div class="calendarTable">
                <ul class="calendarWeek">
                    <li>日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li>六</li>
                </ul>
                <ul class="calendarDayRow" v-for="(item, index) in calendarList" :key="index">
                    <li v-for="(key, i) in item" :class="[disabled(key.date)]" :date="key.fullDate" :key="i" @click='disabled(key.date).indexOf("disabled") !== -1?empty:setPrice(key, $event)'>
                        <p class="date">{{key.text}}</p>
                        <p class="price">{{ key.price?'¥':'' }}{{key.price}}</p>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</template>
<script>
    import {uniq as _uniq,} from 'lodash'
    import {is_leap, addZero, getCookie, formatDatem, compare, toDecimal2} from 'common_libs/util.js'
    import {innRoomTypeApiServers} from '../../../api/API'
    import {
        dateTrsition
    } from '../../../libs/util.js'

    export default {
        name: 'setSpeciaPrice',
        props: ['thisOpenRoomTypeId', 'speciaUpdate'], // 打开弹窗时的房间型号
        data() {
            return {
                nowDate: new Date(),
                calendarList: [],
                mouthList: [],
                selectMonth: 0,
                shadow: null,
                isOpen: true,
                dateParams: {
                    start: Date,
                    end: Date
                },
                totalDataList: [], //所有数据列表
                roomTypeClass: {}, //按照roomTypeId分好类的数据列表
                dataObj: {}, //单个月份的数据
                nowMounth: 0,
                cache: {},
                index: 0, //节日循环列表
                indexName: 0
            }
        },
        methods: {
            disabled(date) {
                /* 添加类样式 是否禁止、是否节假日 */
                let month = this.nowDate.getMonth(),
                    year = this.nowDate.getFullYear(),
                    currentTime = +new Date(`${year}-${this.nowMounth}-${date}`),
                    result = '';
                
                if(date) {
                    /* 添加 festival*/
                    for(let i = this.index, len = this.festivalList.length; i < len; i++) {
                        let min = dateTrsition(this.festivalList[i]['startDate']), 
                            max = dateTrsition(this.festivalList[i]['endDate']);
                        if(min <= currentTime && currentTime <= max) {
                            result += 'festival ';
                            this.index = i;
                        }
                    }
                }
 
                if(month === this.nowMounth) {
                    return result += date < this.nowDate.getDate() ? 'disabled ':' ';
                } else if (this.nowMounth < month) {
                    result += 'disabled ';
                } else {
                    result += date ? ' ': 'disabled ';
                }
                return result;
                
            },
            changeMonthAndCreatCalenDar(value, item) {
                this.selectMonth = value;
                this.setDateParams(item.month + 1);
                this.dataObj = this.roomTypeClass[this.thisOpenRoomTypeId];
                if(this.nowMounth !== item.month) {
                    this.creatThisMouthCalendar(item.month, item.year)
                }
                
            },
            creatThisMouthCalendar(nowMounth, year) {
                this.calendarList = [];
                let nowYear = nowMounth > 11 ?  this.nowDate.getFullYear()+1 : this.nowDate.getFullYear();
                nowMounth = nowMounth > 11 ? nowMounth - 12 : nowMounth
                let nowMounthFirstDay = new Date(nowYear, nowMounth, 1);
                let firstWeek = nowMounthFirstDay.getDay();
                let nowMounthDayNumber = [31, is_leap(nowYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                let calendarDayRow = Math.ceil((nowMounthDayNumber[nowMounth] + firstWeek) / 7); // 获得行数
                
                this.dataObj.realPriceList.sort(compare('currDate'));
                for (let i = 0; i < calendarDayRow; i++) {
                    let calendarRowObj = [];
                    for (let k = 0; k < 7; k++) {
                        let calendarObj = {};
                        calendarObj.index = i * 7 + k;
                        calendarObj.date = i * 7 + k - firstWeek + 1;
                        calendarObj.fullDate = `${nowYear}-${addZero(nowMounth + 1)}-${addZero(i * 7 + k - firstWeek + 1)}`;
                        if(calendarObj.date <= 0 || calendarObj.date > nowMounthDayNumber[nowMounth]) {
                            calendarObj.date = ''
                        } else {
                            calendarObj.date = addZero(i * 7 + k - firstWeek + 1)
                            calendarObj.text = this.festivalText(calendarObj.date)
                            let index = calendarObj.date - 1;
                            calendarObj.price = this.dataObj.realPriceList[index]['realPrice'];
                            calendarObj.specialPriceId = this.dataObj.realPriceList[index]['specialPriceId'];
                        }
                        calendarRowObj.push(calendarObj)
                    }
                    this.calendarList.push(calendarRowObj)
                }
            },
            setPrice(day, event) {
                /* 把参数传到 addHotelRoomTypeModal 组件 */
                this.isOpen = true;
                this.createShadow();
                this.$emit('closeSetPrice', {...day, roomTypeId: this.thisOpenRoomTypeId, el: event.target});
            },
            empty() {},
            createShadow() {
                /* 创建一个遮罩层 */
                let modalPriceBg = document.createElement('div');
                modalPriceBg.className = 'modalPriceBg';
                modalPriceBg.id = 'modalPriceBg';
                this.shadow = modalPriceBg;
                document.body.appendChild(modalPriceBg);
            },
            getData(isGetCache = true) {
                /* isGetCache 是否要从cache中取数据 ,默认为true */
                /* 设置时间参数 */
                let params = {
                    innId: getCookie('innId'),
                    startDay: this.dateParams.start,
                    endDay: this.dateParams.end
                };
                let month = this.transitionMonth(this.dateParams.start.split('-')[1]);
                this.cache[this.thisOpenRoomTypeId] = this.cache[this.thisOpenRoomTypeId] || {};
                if(!this.cache[this.thisOpenRoomTypeId][month] || !isGetCache) {
                    innRoomTypeApiServers.searchPrice(params).then(result => {
                        if(result.code === '000000') {
                            this.totalDataList = result.content;
                            for (let i = 0, len = this.totalDataList.length; i < len; i++) {
                                this.totalDataList[i].realPriceList.map(item => {
                                    item.realPrice = toDecimal2(item.realPrice / 100)
                                })
                            }
                            this.cache[this.thisOpenRoomTypeId][month] = result.content;
                            this.setRoomTypeClass();
                        } else {
                            alert(result.message);
                        }
                    })
                } else {
                    this.totalDataList = this.cache[this.thisOpenRoomTypeId][month];
                    this.setRoomTypeClass();
                }
                
            },
            setDateParams(month) {
                /* 设置时间参数 */
                let date = this.nowDate,
                    year = date.getFullYear();
                month ? (this.nowMounth = month-1) : (month = date.getMonth() + 1);
                let days = new Date(year, month, 0).getDate();
                this.dateParams = {
                    start: `${year}-${month}-01`,
                    end: `${year}-${month}-${days}`
                }
                this.getData();
            },
            setRoomTypeClass() {
                /* 做数据分类 */
                let roomTypeId = Number;
                for(let i = 0, len = this.totalDataList.length; i < len; i++) {
                    roomTypeId = this.totalDataList[i]['roomTypeId']
                    this.roomTypeClass[roomTypeId] = this.totalDataList[i];
                }
                /* 初始化数据 */
                this.dataObj = this.roomTypeClass[this.thisOpenRoomTypeId];
                this.creatThisMouthCalendar(this.nowMounth);
            },
            transitionMonth(num) {
                let monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return monthList[num - 1];
            },
            dateRang(min, max, date) {
                min = +new Date(min);
                max = +new Date(max);
                date = +new Date(date);
                return (min <= date && date <= max);
            },
            festivalText(date) {
                /* 设置节日名称 */
                let month = this.nowDate.getMonth(),
                    year = this.nowDate.getFullYear(),
                    currentTime = +new Date(`${year}-${this.nowMounth}-${date}`);
                    
                for(let i = this.indexName, len = this.festivalList.length; i < len; i++) {
                    let start = dateTrsition(this.festivalList[i]['startDate']);
                    if(start === currentTime) {
                        this.indexName = i;
                        return this.festivalList[i].name.slice(0, -1);
                    } else {
                        return date;
                    }
                }
            }
        },
        created() {
            this.nowMounth = this.nowDate.getMonth();
            let wrapMonth = this.nowDate.getMonth() - 1;
            for (let i = 0; i < 5; i++) {
                wrapMonth++;
                let mouthObj = {
                    year: wrapMonth + 1 > 12 ? this.nowDate.getFullYear() + 1 : this.nowDate.getFullYear(),
                    name: wrapMonth + 1 > 12 ? `${wrapMonth - 11}月` : `${wrapMonth + 1}月`,
                    // month: wrapMonth > 11 ? wrapMonth - 11 : wrapMonth,
                    month: wrapMonth
                };
                this.mouthList.push(mouthObj)
            }
            this.setDateParams();
        
        },
        computed: {
            refreshSpecialPrice(){
                return  this.$store.state.hotelStatus.refreshSpecialPrice;
            },
            festivalList () {
                return this.$store.state.hotelStatus.festivalList
            }
        },
        watch: {
            thisOpenRoomTypeId(curr, old) {
                this.dataObj = this.roomTypeClass[curr];
                this.creatThisMouthCalendar(this.nowMounth);
            },
            speciaUpdate() {
                this.getData(false);
            },
            refreshSpecialPrice(data) {
                this.getData(false);
            }
        }
    }
</script>
<style scoped lang="scss">
    @import './setSpeciaprice'
</style>
