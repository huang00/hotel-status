<style type="text/css">
.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
#payWaysD {
  clear: both;
  position: relative;
} 
#payWaysD .nodata-tr {
  height:500px;
}
#payWaysD .nodata-td {
  position: absolute;
  /*outline: 1px solid red;*/
  width: 100%;  
  height:500px;
  color: #999;
  font-size: 18px;
  left: 0;
  margin: 0 auto;
  background: #fff url("../../../../assets/noData2.png") no-repeat center center;
}
.nodata-span {
  position: absolute;
  text-align: center;
  width: 100%;
  bottom: 20px; 
}
</style>
<template>
<div>
<table class="split-big-table ">
    <thead>
      <tr>
        <th v-if="checkFlag">
          <input 
            class="table-check" 
            v-model="checkTotal"  
            type="checkbox" 
            @click="checkTotalSwitch(checkTotal)"/>
        </th>
        <th v-for="(item,index) in headData" :key="index">
        <!-- 屏蔽页面上head栏显示的orderId -->
          <span v-if="item !='paywayIds'">{{item}}</span>
          <span v-else style="display: none"></span>
        </th>
        <th v-if="operFlag">订单明细</th>
      </tr>
    </thead>
    
    <tbody  id="payWaysD" style="clear:both">
      <tr :ref="'tr' + index" v-for="(item,index) in bodyData" :key="index" 
        @click='selfRowClick(item,index)'
        :class="{active: activeIndex == index}"
       >
        <td v-if="checkFlag">
          <input 
            class="table-check" 
            v-model="checkArr[index]"  
            type="checkbox" 
            @click="checkSwitch(checkArr,index)"/>
        </td>
          <!-- paywayIds 具体根据后端的 订单id来 用来获取订单详情 -->
        <td v-for="(itemTd,indexTd) in item" :key="indexTd" 
            :class="{hidId: indexTd == 'orderId', sumMoney: indexTd == 'sumMoney' }"
            > 
            <span v-if="!(itemTd instanceof Array)">
              <input 
                v-if="tableEditFlag" 
                type="text" 
                class="table-inp" 
                :value="itemTd" 
                @blur="blurEditInp(index,indexTd,false,$event)"/>
              
              <span v-else>
               <span v-if="indexTd == 'sumMoney'" style='vertical-align: middle'>￥</span>{{itemTd}}
              </span>
            </span>
            <table  @click='selfRowClickChild(item,index)'  v-else class="split-samll-table"  
              :class="{borderRight: indexTd == 'checkInOut', borderRightHover: activeIndex2 == index }">
              <tr  v-for="(smallItem,smallIndex) in itemTd" :key="smallIndex">
                <input 
                  v-if="tableEditFlag" 
                  type="text" 
                  class="table-inp" 
                  :value="smallItem" 
                  @blur="blurEditInp(index,indexTd,smallIndex,$event)"/>
                  <!-- 显示需要聚合的表格-->
                <span v-else >{{smallItem}}</span>
              </tr>
            </table>
        </td>

        <td class="table-operate" v-if="operFlag">
          <slot name="operate" :rowData="item"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
export default{
name:'splitTable',

props:{
  headData:{
    required:true,
    type:Array,
    default:[]
  },

  bodyData:{
    required:true,
    type:Array,
    default:function () {
        return []
    }
  },

  checkFlag:{
    type:Boolean,
    default:true
  },

  tableEditFlag:{
    type:Boolean,
    default:true
  },

  operFlag:{
    type:Boolean,
    default:true
  },
},

data(){
  return{
    checkTotal:false,
    checkArr:[],
    multipleData:[],
    multipleIndex:[],
    activeIndex: null,
    activeIndex2: null,
    isActive: true,
    bodyDataTemp: [],
  }
},
created(){
  this.headData.map((item,index)=>{
    this.checkArr.push(false)
  })
  this.activeIndex = null
 
},
watch : {
  bodyData (val, oldVal) {
    // if (val.length == 0) {
    //   this.showNoData()
    // } else {
    //   let emptyBody = document.getElementById('payWaysD');
    //   if (document.getElementById('noDataTr')) {
    //     var temp = document.getElementById('noDataTr')
    //     emptyBody.removeChild(temp)
    //   }
    //   console.log(1312313 ,'removeChild')
    // }
  }
},
mounted() {
  
},

methods:{
  selfRowClick (item,index){
    console.log(132)
    this.activeIndex = index
    this.selfRowClickChild(item,index)
  },
  selfRowClickChild (item,index) {
    this.activeIndex2 = index
    console.log(137, item,index)
  },
  // 总的check切换
  checkTotalSwitch(val){
    setTimeout(()=>{
    this.checkArr.map((item,index)=>{
      this.$set(this.checkArr,index,this.checkTotal);
    });
    //判断是否全选
    if(this.checkTotal){
      this.multipleData=this.bodyData;
    }else{
      this.multipleData=[];
    }
    //将multipleData值传入父组件
    this.$emit('multipleData',this.multipleData);
    },2)
  },

  // 单个check切换
  checkSwitch(val,valIndex){
    setTimeout(()=>{
      this.checkTotal=val.every(item=>{
        return item===true;
      })
    //将选中的项取出来,通过索引取项
    if(val[valIndex]){
      this.multipleIndex.push(valIndex);
      this.multipleIndex=this.multipleIndex.sort();
    }else{
      this.multipleIndex.splice(valIndex,1);
    }
    this.multipleIndex.map((item,index)=>{
      this.$set(this.multipleData,index,this.bodyData[item])
    })
    //将multipleData值传入父组件
    this.$emit('multipleData',this.multipleData);
    },0)
  },
  //编辑失焦
  blurEditInp(index,key,arrIndex,e){
    if(arrIndex!==false){
      this.$set(this.bodyData[index][key],arrIndex,e.target.value);
    }else{
      this.bodyData[index][key]=e.target.value;
    }
    //将编辑的值传入父组件
    this.$emit('editData',this.bodyData);
  },
  showNoData () {
    let emptyBody = document.getElementById('payWaysD');
    emptyBody.innerHTML = '<tr id=""noDataTr class="nodata-tr"><td class="nodata-td"><span class="nodata-span">暂无数据 <br/> ...</span></td></tr>'
  },
}

}
</script>

<style scoped>
.split-big-table {
  /*height: 578px;*/
  position: relative;
}
.split-big-table,.split-samll-table {
  width: 100%;
  border: 0;
  border-collapse: collapse;

  background:#fafafa;
}
th:first-child{
  color: #9AA7C1;
}
th{
  padding:8px 5px 3px 5px;
  line-height: 42px;
  font-size: 16px;
  background:#fff;
  color: #215C92;
  font-weight: 500;
}

tr{
  color: #9AA7C1;
}
tr td:first-child{
  border-left: 2px solid #215D91;
}
tr:hover, tr:hover td table tr{
  cursor:default;
  background:#DBE1ED;
}
/*tr:hover td table tr {
  border-left:5px solid #DBE1ED;
  border-bottom: 5px solid #DBE1ED;
}*/
td {
  color:#9AA7C1;
  font-size: 14px;
 
}
td,th{
  text-align:center;
  border: 0;
  border-bottom: 5px solid #fff;
}
.split-samll-table{
  margin:-1px;
  border:none;
  /*outline: 1px solid red;*/
}
.split-samll-table tr{
  line-height: 42px;
  border: 0;
  border-bottom: 5px solid #fff;
  border-left: 5px solid #fff;
}

.split-samll-table tr:hover {
  background:#DBE1ED;
}
.split-samll-table tr:last-child{
  border-bottom: none;
}

/* 编辑输入框 */
.table-inp{
  margin:5px 0;
  padding:5px;
  border: 1px solid #fff;
}

tr:hover .table-inp{
  border: 1px solid #dfe6ec;
}

/* 操作列 */
.table-operate span{
  margin-left:10px;
  color: #409eff;
}
/* 订单id隐藏 */
.hidId {
  display: none;
}
/* 金额列单独css */
.sumMoney {
  color: #86C1E0;
}
.borderRight {
  border-right: 5px solid #fff;
}
.borderRightHover {
  background: #DBE1ED;
  /*border-right: 5px solid #DBE1ED;*/
}
/*tr:hover .borderRight {
  border-right: 5px solid #DBE1ED;
}*/
/* 点击激活当前行选中css */
.active {
  background: #DBE1ED;
}

</style>