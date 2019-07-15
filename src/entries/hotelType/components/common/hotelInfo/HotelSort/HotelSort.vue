<template>
    <div class="hotelDrag">
        <draggable element="ul" v-model="hotelListData" :options='dragOptions' @update="datadragEnd">
            <li v-for="item in hotelListData" :key="item.innid" :title="item.label">{{item.label}}</li>
        </draggable>
    </div>
</template>

<script>
// import TabsNav from 'common_components/TabsNav'
// import AppModal from 'common_components/AppModal'
// import HotelPeople from 'hotelType/components/common/staffAccount/HotelPeople'
// import AddStaff from 'hotelType/components/common/staffAccount/AddStaff'
// import ModalHeader from 'hotelType/components/ModalHeader'
// import { getCookie, trimAll } from 'common_libs/util.js'
    import { hotelInforApiServers, innRoomTypeApiServers } from '../../../../api/API'
    import draggable from 'vuedraggable'
    import {mapMutations } from "vuex"


// import {
//     validateRule
// } from 'common_libs/util'

export default {
    name: 'hotelDrag',
    // props: {
    //     hotelList: {
    //         type: Array,
    //         default: []
    //     }
    // },
    // computed: {
    //     hotelListData () {
    //         return  this.hotelList
    //     }
    // },
    data () {
        return {
            hotelListData:[]
        }
    },
    components: {
        draggable
    },
    computed: {
        hotelList () {
            let data = this.$store.getters.hotelList
            for(let z = 0;z < data.length;z++){
                data[z].label = data[z].innName
                data[z].value = data[z].innId
            }
            this.hotelListData = data
            return data
        },
        dragOptions () {
            return  {
                animation: 300,
                group: 'description',
                ghostClass: 'ghost',
                chosenClass: 'chosen',
                fallbackClass: 'fallback'
                // delay:3000
            };
        },
    },
    methods: {
        ...mapMutations([
            'setHotelList',
        ]),
        datadragEnd() {
            let hotelListData = this.hotelListData
            for(let z = 0;z < hotelListData.length;z++){
                hotelListData[z].sort = hotelListData.length - z
                // delete hotelListData[z].innName
                // delete hotelListData[z].label
                // delete hotelListData[z].value
            }
            innRoomTypeApiServers.sortInn(hotelListData).then(result => {
                if (result.code === '000000') {
                    this.$Message.success('操作成功！')
                    this.setHotelList(hotelListData)
                    this.$emit('on-change')
                }else{
                    this.hotelListData = this.hotelList
                    alert(result.message)
                }
            })
        },
    },
    created () {

    },
    watch : {
        hotelList : {
            handler (val) {
                this.hotelListData = val
            }
        }
    },
}
</script>

<style lang="scss">
    .hotelDrag {
        $base-color: #235F92;
        padding-bottom: 40px;
        ul{
            margin-top: 30px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .ghost{
                opacity: 0.1;
                // background: blue;
                // color:#fff;
                // border:none !important;
            }
            .chosen{
                border:2px solid rgb(32, 92, 145);
            }
            .fallback{
                border:2px solid red;
            }
            li{
                width: 160px;
                height: 68px;
                background-color: #fff;
                line-height: 68px;
                border-radius:32px;
                text-align: center;
                color:#1E5A90FF;
                cursor: move;
                border: 1px solid transparent;
                margin: 10px 40px 0 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            li:nth-child(1){
                margin-left: 0px;
            }
            // li:hover{
            //     box-shadow:0px 2px 10px 0px rgba(197,226,253,0.71);
            //     border-radius:32px;
            //     border:1px solid rgba(30,90,144,1);
            // }
        }
    }
</style>
