<template>
    <div class="roomTypeSort">
        <div class="roomTypeSortRow">
            <draggable element="ul" v-model="roomsList" class="roomTypeSortRow" :options='dragOptions' @update="datadragEnd">
                <transition-group type="transition" :name="'rooms-list'">
                    <li v-for="item in roomsList" class="rooms-item" :key="item.roomTypeSequence">
                        <span>{{item.roomTypeName}}</span>
                    </li>
                </transition-group>
            </draggable>
        </div>
        <div v-if="roomsLists"></div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import { compare } from '../../../../../common_libs/util'
    import { innRoomTypeApiServers } from '../../../api/API'

    export default {
        name: 'roomTypeSort',
        components: {
            draggable
        },
        data() {
            return {
                roomsList: []
            }
        },
        computed: {
            dragOptions () {
                return  {
                    animation: 0,
                    group: 'description',
                    ghostClass: 'ghost'
                };
            },
            roomsLists() {
                this.cloneArr(this.$store.state.hotelStatus.hotelRoomTypeInfoList);
            }
        },
        mounted() {
        },
        methods: {
           datadragEnd(evt) {
               innRoomTypeApiServers.sortRoomType(this.paramsProcess()).then(result => {
                   if(result.code !== '000000') {
                       alert(result.message)
                   }
               })
           },
           paramsProcess() {
               let result = [];
                for(let i = 0, len = this.roomsList.length; i < len; i++) {
                    let obj = this.roomsList[i],
                        empty = {};
                    empty.roomTypeId = obj.roomTypeId;
                    empty.roomTypeSequence = i + 1;
                    result.push(empty)
                }
                return result;
           },
           cloneArr(arr) {
               let result = [];
               for(let i = 0, len = arr.length; i < len; i++) {
                   result.push(arr[i]);
               }
               this.roomsList = result;
           }
        },
        created() {
            /* setTimeout(() => {
                this.roomsList = this.$store.state.hotelStatus.hotelRoomTypeInfoList;
                this.roomsList = this.roomsList.sort(compare('roomTypeSequence'));
            }, 500); */
        },
    }
</script>
<style scoped lang="scss">
    .roomTypeSort {
        width: 100%;
        height: 335px;
        overflow-y: auto;
        padding: 15px 0;
        -moz-user-select: none;
        user-select: none;
        .roomTypeSortRow {
            width: 100%;
            padding: 10px 5px;
            display: flex;
            background-color: #DDEAF4;
            justify-content: flex-start;
            .rooms-item {
                width: 120px;
                height: 120px;
                background: rgb(255, 255, 255);
                border-radius: 5px;
                color: #434343;
                cursor: move;
                float: left;
                margin: 10px;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            // .rooms-list-move {
            //     transition: transform 0.5s;
            // }
            .ghost {
                opacity: .5;
                background: #C8EBFB;
            }
        }

    }
</style>
