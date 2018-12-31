<template>
    <div>
        <div class="echartLineWrap">
            <Card class="echartLine" style="width:100%">
                <div id="chartLine" class="chartLineDiv" :style="{height: '610px', float: 'left'}"></div>
                <div class="showAllWrap">
                    <p class="rightTitle">结余</p>
                    <div style="max-height:510px;overflow-y:auto;overflow-x:hidden">
                        <div class="itemBody" v-for="item in showLineData" :key="item.title">
                            <div class="itemIcon">
                                <img class="iconImg" :src="item.iconSrc" alt="" v-if="item.iconSrc">
                                <span class="textIcon"  v-if="!item.iconSrc">{{item.payWayName.substring(0, 1)}}</span>
                            </div>
                            <div class="itemText">{{item.payWayName}}</div>
                            <!-- <div class="itemNum" :style="{ 'color': item.type == '2' ? '#E78069FF' : '#6BB4DAFF' }">￥<span v-if="item.type == '2'">-</span>{{item.surplus}}</div> -->
                            <div class="itemNum" :style="{'color': Number(item.surplus) >= 0 ? '#6BB4DAFF' : '#E78069FF'}">￥{{item.surplus}}</div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        <div class="echartPieWrap">
            <Card class="top">
                <div id="chartPieRe" :style="{width: '470px', height: '284px', float: 'left'}"></div>
                <div class="no-data-show" v-show="showMyLegendRe">
                    <p>
                        <span class="topBlock"></span>
                        <span>房费收入:</span><span>￥ 0.00</span>
                    </p>
                    <p>
                        <span class="middleBlock"></span>
                        <span>定金收入:</span><span>￥ 0.00</span>
                    </p>
                    <p>
                        <span class="bottomBlock"></span>
                        <span>押金收入:</span><span>￥ 0.00</span>
                    </p>
                </div>
                <span class="pieCenterTex">收入</span>
            </Card>
            <Card class="bottom">
                <div id="chartPieOut" :style="{width: '470px', height: '284px', float: 'left'}"></div>
                <div class="no-data-show" v-show="showMyLegendOut">
                    <p>
                        <span class="topBlock"></span>
                        <span>房费支出:</span><span>￥ 0.00</span>
                    </p>
                    <p>
                        <span class="middleBlock"></span>
                        <span>定金支出:</span><span>￥ 0.00</span>
                    </p>
                    <p>
                        <span class="bottomBlock"></span>
                        <span>押金支出:</span><span>￥ 0.00</span>
                    </p>
                </div>
                <span class="pieCenterTex">支出</span>
            </Card>
        </div>
    </div>
</template>

<script>
    function compareLine(property,property2){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            // 当结余相等时，用收入来做排序
            if((value2 - value1) == 0){
                return b[property2] - a[property2]
            }else{
                return value2 - value1;
            }
        }
    }
    export default {
        name: 'echartsShow',
        props: ['showLineData'],
        data() {
            return {
                showMyLegendRe: false,
                showMyLegendOut: false
            }
        },
        mounted(){
        },
        computed: {
            // 饼状图data
            paywayPieChart () {
                let obj = {
                    resever:{},
                    out:{}
                }
                let pieData = JSON.parse(JSON.stringify(this.$store.getters.paywayPieChart))
                for(let q = 0;q < pieData.length;q++){
                    if(pieData[q].name == '收入'){
                        obj.resever = pieData[q]
                    }
                    if(pieData[q].name == '支出'){
                        obj.out = pieData[q]
                    }
                }
                return obj
            },
            // 柱状图data
            paywayBarChart () {
                return this.$store.getters.paywayBarChart
            },
            // 支付方式列表
            orderPaymentList () {
                return this.$store.getters.orderPaymentList
            },
        },
        watch: {
            paywayPieChart(data) {
                if(data){
                    this.drawChartPieRe(data.resever);
                    this.drawChartPieOut(data.out);
                }
            },
            paywayBarChart(data) {
                let _data = JSON.parse(JSON.stringify(data))
                _data = _data.sort(compareLine('surplus','payIn'))
                this.drawLine(_data);
            }
        },
        methods: {
            drawLine(dataLine){
                // 基于准备好的dom，初始化echarts实例
                let chartLine = this.$echarts.init(document.getElementById('chartLine'))
                let axisLabelObj = {
                    formatter: function (value, index) {
                        let res = ''
                        if(value.includes('代收')){
                            var arr = [
                                value.substring(0,value.length - 2) + '\n',
                                '{a|代收}',
                            ]
                            // res = value.substring(0,value.length - 2) + '\n' + '代收'
                        }else{
                            var arr = [
                                value
                            ]
                            res = value
                        }
                        return arr.join('\n')
                    },
                    rich: {
                        a: {
                            color: '#C7D3ECFF',
                             lineHeight: 2
                        },
                    }
                };
                let xAxisData = []
                let data1 = []
                let data2 = []
                let showData = true

                // 当有数据时暂时正常数据   当无数据时横向暂时所有支付方式，数据都为0,不显示数据值showData=false
                if(dataLine.length > 0){
                    for(let m = 0;m < dataLine.length;m++){
                        xAxisData.push(dataLine[m].payWayName)
                        // 判断数据是0或者空，如果是push空字符串，否则echart显示bug
                        if(dataLine[m].payIn == '0' || !dataLine[m].payIn){
                            data1.push("")
                        }else{
                            data1.push("+"+dataLine[m].payIn)
                        }

                        if(dataLine[m].payOut == '0' || !dataLine[m].payOut){
                            data2.push("")
                        }else{
                            data2.push("-"+dataLine[m].payOut)
                        }

                        // data1.push("+"+dataLine[m].payIn)
                        // data2.push("-"+dataLine[m].payOut)
                    }
                }else{
                    for(let q = 0;q < this.orderPaymentList.length;q++){
                        xAxisData.push(this.orderPaymentList[q].name)
                        data1.push('0')
                        data2.push('0')
                    }
                    showData = false
                }

                                // formatter: '{c|{b}} \n{d|{d}%}',

                // 中屏横坐标斜向展示
                if(document.body.clientWidth < 1600 && xAxisData.length > 5){
                    axisLabelObj = {
                        interval:0,  
                        rotate:45,
                        margin:2,
                        formatter: function (value, index) {
                            let res = ''
                            if(value.includes('代收')){
                                res = value.substring(0,value.length - 2) + '\n' + '代收'
                            }else{
                                res = value
                            }
                            return res
                        },
                    }
                }

                if(document.body.clientWidth > 1600 && document.body.clientWidth < 1820  && xAxisData.length > 4){
                    axisLabelObj = {
                        interval:0,  
                        rotate:45,
                        margin:2,  
                        formatter: function (value, index) {
                            let res = ''
                            if(value.includes('代收')){
                                res = value.substring(0,value.length - 2) + '\n' + '代收'
                            }else{
                                res = value
                            }
                            return res
                        }
                    }
                }

                let option = null;

                // 收入柱状样式
                let itemStyle1 = {
                    normal: {
                        label: {
                            show: showData, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: '#7DC475FF',
                                fontSize: 14
                            }
                        },
                        color:'#95A2BCFF',
                        barBorderRadius:[16,16,0,0]
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: 'rgba(0,0,0,0.5)'
                    },
                };

                // 支出柱状样式
                let itemStyle2 = {
                    normal: {
                        label: {
                            show: showData, //开启显示
                            position: 'bottom', //在上方显示
                            textStyle: { //数值样式
                                color: '#E78069FF',
                                fontSize: 14
                            }
                        },
                        color:'#C7D3ECFF',
                        barBorderRadius:[0,0,16,16]
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: 'rgba(0,0,0,0.5)'
                    },
                };

                option = {
                    title: {
                        text: '收支结余',
                        left: 'left',
                        textStyle:{
                            color:'#205D91FF',
                            fontStyle:'normal',
                            fontWeight:'normal',
                            fontFamily:'MicrosoftYaHei',
                    　　　　 fontSize:18
                        }
                    },
                    tooltip : {
                        show:showData,
                        enterable:true,
                        trigger: 'axis',
                        axisPointer : {            
                            type : ''        
                        }, 
                        formatter(params){ 
                            let relVal = `${params[0].name}<br/>`
                            relVal += `收入:${Math.abs(params[0].value)}元<br/>`
                            relVal += `支出:${Math.abs(params[1].value)}元<br/>`
                            return relVal;
                        }
                    }, 
                    grid: {
                        left: 60,
                        right: 0
                    },
                    backgroundColor: '#eee',
                    xAxis: {
                        data: xAxisData,
                        silent: false,
                        axisLine: {
                            onZero: false,
                            lineStyle:{
                                color:'#89A0B1FF',
                                width:2,//这里是为了突出显示加上的
                            }
                        },
                        axisLabel:axisLabelObj,
                        splitLine: {show: false},
                        splitArea: {show: false}
                    },
                    yAxis: {
                        nameGap: 20,
                        // max: function(value) {
                        //     return 1000
                        // },
                        // min: function(value) {
                        //     return -1000
                        // },
                        axisLine:{
                            lineStyle:{
                                color:'#89A0B1FF',
                                width:2,//这里是为了突出显示加上的
                            }
                        },
                        splitLine: {
                            show: true,
                        },
                        nameTextStyle:{
                            align: 'left',
                            padding: [90,30,0,0]
                        },
                        splitArea: {show: false},
                        
                    },
                    backgroundColor: '#fff',
                    series: [
                        {
                            name: '收入',
                            type: 'bar',
                            stack: 'one',
                            barWidth : 31,
                            itemStyle: itemStyle1,
                            data: data1
                        },
                        {
                            name: '支出',
                            type: 'bar',
                            stack: 'one',
                            barWidth : 31,
                            itemStyle: itemStyle2,
                            data: data2
                        },
                    ]
                };
                if(!showData){
                    option.yAxis.max = function(value) {
                        return 1000
                    }
                    option.yAxis.min = function(value) {
                        return -1000
                    }
                }else{
                    delete option.yAxis.max
                    delete option.yAxis.min
                }
                // 绘制图表
                chartLine.clear()
                chartLine.setOption(option);
                // 当窗口大小修改时，重置echart
                window.onresize = chartLine.resize;
            },
            drawChartPieRe(dataRe){
                this.commonPieOption(dataRe,1)
            },
            drawChartPieOut(dataOut){
                this.commonPieOption(dataOut,2)
            },
            commonPieOption(pieData,type){
                // pieData => 饼状图数据  type => 1代表收入饼状图  2代表支出饼状图
                // x => 押金  y => 定金  z => 房费  showData => 是否展示数据 showLegend => 是否展示Legend  showMyLegendOut => 是否展示自定义的showMyLegendOut  chartPie => 收入支出Div
                let x = 0
                let y = 0
                let z = 0
                let showData = true
                let showLegend = true
                let chartPie = null

                if(type == 1){
                    this.showMyLegendRe = false
                    chartPie = this.$echarts.init(document.getElementById('chartPieRe'))
                }else{
                    this.showMyLegendOut = false
                    chartPie = this.$echarts.init(document.getElementById('chartPieOut'))
                }

                if(!pieData.details){
                    pieData.details = []
                }
                for(let q = 0;q < pieData.details.length;q++){
                    if(pieData.details[q].name == '房费'){
                        x = pieData.details[q].money ? pieData.details[q].money : 0
                    }
                    if(pieData.details[q].name == '定金'){
                        y = pieData.details[q].money ? pieData.details[q].money : 0
                    }
                    if(pieData.details[q].name == '押金'){
                        z = pieData.details[q].money ? pieData.details[q].money : 0
                    }
                }
                var option = null;
                var data = [
                    {
                        value: 0.00,
                        name: '房费',
                        itemStyle:{
                            normal:{
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#A9C4FFFF' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#DBE7FDFF' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            }
                        },
                    },
                    {
                        value: 0.00,
                        name: '定金',
                        itemStyle:{
                            normal:{
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#FFF2CBFF' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#F8D766FF' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            }
                        },
                    },
                    {
                        value: 0.00,
                        name: '押金',
                        itemStyle:{
                            normal:{
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#F4DFFEFF' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#EAC3FFFF' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            }
                        },
                    },
                ]

                if(x == 0 && y == 0 && z == 0){
                    showData = false
                    data.splice(1,1)
                    data.splice(1,1)
                    data[0].value = x
                    data[0].itemStyle.normal.color.colorStops[0].color = '#C7D3ECFF'
                    data[0].itemStyle.normal.color.colorStops[1].color = '#9AA7C1FF'
                    showLegend = false

                    if(type == 1){
                        this.showMyLegendRe = true
                        data[0].name = '收入'
                    }else{
                        this.showMyLegendOut = true
                        data[0].name = '支出'
                    }
                }else{
                    data[0].value = x
                    data[1].value = y
                    data[2].value = z
                }

                // 获取收入总数
                let total = 0;
                for(let q = 0;q < data.length;q++){
                    total += data[q].value
                }
                total = parseInt(total)
                // total = 1234567

                // 根据长度改变left值
                let totalLength = (total.toString()).length         //获取总数值长度
                let totalLeft = '23%'                               //默认一位长度时的left

                // 根据长度改变left值
                switch (totalLength) {
                    case 1:
                        totalLeft = '25%'
                        break
                    case 2:
                        totalLeft = '23%'
                        break
                    case 3:
                        totalLeft = '21.5%'
                        break
                    case 4:
                        totalLeft = '19.5%'
                        break
                    case 5:
                        totalLeft = '18%'
                        break
                    case 6:
                        totalLeft = '16%'
                        break
                    case 7:
                        totalLeft = '16.5%'
                        break
                    case 8:
                        totalLeft = '15.5%'
                        break
                    case 9:
                        totalLeft = '15.5%'
                        break
                }
                option = {
                    title: {
                        text:total.toFixed(2),
                        left:totalLeft,
                        top:'45%',
                        textStyle:{
                            color: type == 1 ? '#7DC475FF' : '#E78069FF',
                            fontSize:Number(totalLength) > 6 ? 24 : 28,
                            align:'center',
                            fontWeight: 'normal'
                        },
                    },
                    
                    backgroundColor: '#fff',
                    tooltip: {
                        trigger: 'item',
                        formatter: showData?"{b}支出: {c}元 ({d}%)":"{b} : {c} 元"
                    },
                    legend: {
                        selectedMode:false,
                        show: showLegend,
                        orient: 'vertical',
                        top: '18%',
                        left: '290px',
                        itemGap: 60,
                        formatter: function (name) {
                            let value
                            for(let q = 0;q < data.length;q++){
                                if(data[q].name == name){
                                    value = data[q].value.toFixed(2)
                                }
                            }
                            if(type == 1){
                                var arr = [
                                    '{a|'+ name + '收入: '+'}',
                                    '{b|'+'￥'+value+'}',
                                ]
                            }else{
                                var arr = [
                                    '{a|'+ name + '支出: '+'}',
                                    '{b|'+'￥'+value+'}',
                                ]
                            }
                            
                            return arr.join("")
                        },
                        textStyle: {
                            fontSize: 14,
                            rich: {
                                a: {
                                    color: '#365073FF',
                                },
                                b: {
                                    color: type == 1? '#7DC475FF' : '#E78069FF',
                                },
                            }
                        },
                        data: ['房费', '定金', '押金']
                    },
                    grid: {
                        top:0,
                        left: 5,
                        right: 1
                    },
                    series: [{
                        hoverAnimation:true,
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['32%', '48%'],
                        data: data,
                        markArea : {
                            silent : false
                        },
                        labelLine: {
                            normal: {
                                show: false,
                                length: 0,
                                length2: 0,
                                lineStyle: {
                                    color: '#12EABE',
                                    width: 0
                                }
                            }
                        },
                        label: {
                            normal: {
                                show:  showData,
                                formatter: '{c|{b}} \n{d|{d}%}',
                                rich: {
                                    b: {
                                        fontSize: 12,
                                        color: '#365073FF',
                                        align: 'left',
                                    },
                                    d: {
                                        fontSize: 12,
                                        color: '#365073FF',
                                        align: 'left',
                                    },
                                    c: {
                                        color: '#365073FF',
                                        fontSize: 12,
                                        align: 'left',
                                    }
                                }
                            }
                        }
                    }]
                };
                chartPie.setOption(option);
            },
            getRoomList(){
                let data = {
                    token : common.getToken()
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @media screen and (min-width: 1800px) and (max-width: 1900px){
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:820px;
            }
        }
        .showAllWrap .itemBody{
            // width: 221px
        }
    }
    @media screen and (min-width: 1700px) and (max-width: 1800px){
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:740px;
            }
        }
        .showAllWrap{
            width:calc(100% - 760px);
        }
        .showAllWrap .itemBody{
            // width: 221px
        }
    }
    @media screen and (min-width: 1600px) and (max-width: 1700px){
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:600px;
            }
        }
        .showAllWrap{
            width:calc(100% - 620px);
        }
        .showAllWrap .itemBody{
            // width: 261px
        }
    }
    @media screen and (min-width: 1550px) and (max-width: 1600px){
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:580px;
            }
        }
        .showAllWrap{
            width:calc(100% - 600px);
        }
        .showAllWrap .itemBody{
            // width: 220px
        }
    }
    @media screen and (min-width: 1500px) and (max-width: 1550px){
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:530px;
            }
        }
        .showAllWrap .itemBody{
            width: 220px
        }
    }
    @media screen and (min-width: 1280px) and (max-width: 1500px){
        .echartLineWrap{
            width: calc(100%) !important;
        }
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:calc(75%);
            }
        }
        .showAllWrap{
            width:calc(25% - 20px);
        }
        .showAllWrap .itemBody{
            // width: 220px
        }
        .echartsShow{
            .echartPieWrap{
                clear: both;
                float: none;
                margin-left:0;
                margin-top: 10px;
                .top{
                    float: left;
                    margin: 20px 0 0 0;
                }
                .bottom{
                    float: right;
                }
            }
        }
        
    }
    @media screen and (max-width: 1280px){
        .echartLineWrap{
            width: calc(100%) !important;
        }
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:calc(70%);
            }
        }
        .showAllWrap{
            width:calc(30% - 20px);
        }
        .showAllWrap .itemBody{
        }
        .echartsShow{
            .echartPieWrap{
                clear: both;
                float: none;
                margin-left:0;
                margin-top: 10px;
                .top{
                    float: left;
                    margin-top: 20px;
                }
                .bottom{
                    float: right;
                }
            }
        }
        
    }
    @media screen and (max-width: 1190px){
        .echartsShow{
            .echartPieWrap{
                clear: both;
                float: none;
                margin-left:0;
                margin-top: 10px;
                .top{
                    float: left;
                    margin-top: 20px;
                    margin-left: 22%
                }
                .bottom{
                    float: left;
                    margin-left: 22%
                }
            }
        }
        
    }
    @media screen and (min-width: 1900px) { 
        .echartLine{
            overflow: hidden;
            height:650px;
            .chartLineDiv{
                width:900px;
                height:222px;
            }
        }
        .showAllWrap .itemBody{
            width: 261px
        }
    }
    .echartLineWrap{
        float:left;
        margin-right: -492px;
        width: calc(100% - 500px);
    }
    .showAllWrap{
        float: right;
        margin: 30px 10px 0 10px;
        .rightTitle{
            color: #205D91FF;
            font-size: 18px;
            margin-bottom: 10px
        }
        .itemBody{
            height:41px;
            line-height:41px;
            background:#FAFBFEFF;
            margin-top: 10px;
            .itemIcon{
                float:left;
                .iconImg{
                    width:18px;
                    height:18px;
                    vertical-align:middle;
                    margin-left:15px
                }
                .textIcon{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    font-size: 12px;
                    margin: 0 6px;
                    line-height: 16px;
                    background: #CDCDCD99;
                    color: #215D91FF;
                    text-align: center;
                    border-radius: 50%;
                }
            }
            .itemText{
                color:#9AA7C1FF;
                float:left;
                font-size:16px;
                margin-left:17px
            }
            .itemNum{
                width: 90px;
                color:#6BB4DAFF;
                float:right;
                font-size:14px
            }
        }
    }
    .echartPieWrap{
        float:right;
        margin-left:20px;
        overflow: hidden;
        .no-data-show{
            position: absolute;
            right: 11%;
            font-size: 12px;
            top: 22%;
            p{
                margin-bottom: 57px;
                cursor: pointer;
                user-select: none;
                .topBlock{
                    display: inline-block;
                    vertical-align: middle;
                    width: 24px;
                    height: 14px;
                    background: linear-gradient(to bottom, #A9C4FFFF 0%,#DBE7FDFF 100%);
                    border-radius: 3px;
                }
                .middleBlock{
                    display: inline-block;
                    vertical-align: middle;
                    width: 24px;
                    height: 14px;
                    background: linear-gradient(to bottom, #F8D766FF 0%,#FFF2CBFF 100%);
                    border-radius: 3px;
                }
                .bottomBlock{
                    display: inline-block;
                    vertical-align: middle;
                    width: 24px;
                    height: 14px;
                    background: linear-gradient(to bottom, #EAC3FFFF 0%,#F4DFFEFF 100%);
                    border-radius: 3px;
                }
                span:nth-child(2){
                    color: #365073FF
                }
                span:nth-child(3){
                    color: #E78069FF
                }
            }
        }
        .top{
            height:314px;
            .no-data-show{
                p{
                    span:nth-child(3){
                        color: #7DC475FF
                    }
                }
            }
            .pieCenterTex{
                position: absolute;
                top: 34%;
                left: 30%;
                font-size: 18px;
                color: #365073FF;
                user-select: none;
            }
        }
        .bottom{
            position: relative;
            height:314px;
            margin-top:20px;
            .pieCenterTex{
                position: absolute;
                top: 34%;
                left: 30%;
                font-size: 18px;
                color: #365073FF;
                user-select: none;
            }
        }
    }
</style>
