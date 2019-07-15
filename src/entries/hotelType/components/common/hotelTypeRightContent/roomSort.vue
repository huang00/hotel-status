<template>
    <div class="roomSort">
        <div class="roomTable">
            <ul class="tableHead">
                <li class="roomName">房间名称</li>
                <li class="roomNumber">房间号</li>
            </ul>
            <div class="tableBody">
                <ul class="tableBodyRow" v-for="(item, index) in roomList" :key="index">
                    <li class="tableBodyRowLi roomName">{{item.roomTypeName}}</li>
                    <li class="tableBodyRowLi roomtype-item" :ref="'roomType'+index" :data-id="item.roomTypeId">
                        <span v-for="item in item.roomList" class="rooms-item" :key="item.roomId" :data-id="item.roomId"> {{item.roomNo}} </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import Sortable from 'sortablejs'
    import { compare } from '../../../../../common_libs/util'
    import { innRoomTypeApiServers } from '../../../api/API'

    export default {
        name: 'roomSort',
        data() {
            return {
                list: [],
            }
        },
        computed: {
            roomList() {
                let list = this.$store.state.hotelStatus.hotelRoomTypeInfoList;
                this.list = list;
                this.fetchId();
                return list
            }
        },
        methods: {
            RegisterDrag(el) {
                if (!el) {
                    return false;
                }
                let that = this;
                Sortable.create(el, {
                    group: {
                        name: 'data-list',
                        pull: true
                    },
                    sort: true,
                    delay: 0,
                    fallbackClass: 'cloned-item',
                    ghostClass: 'ghostClass',
                    forceFallback: true,
                    onRemove (event) {
                        that.sendRequest(event)
                    },
                    onUpdate(event) {
                        that.sendRequest(event)
                    }
                });
            },
            sendRequest(event) {
                let nodes = event.to.childNodes,
                    params = [];
                for (let i = 0, len = nodes.length; i < len; i++) {
                    let emptyObj = {
                        roomId: nodes[i].getAttribute('data-id'),
                        roomTypeId: event.to.getAttribute('data-id'),
                        roomSequence: len - i
                    }
                    params.push(emptyObj);
                }
                innRoomTypeApiServers.sortRoom(params).then((result) => {
                    if (result.code !== '000000') {
                        alert(result.message);
                    }
                })
            },
            fetchId() {
                setTimeout(() => {
                    let list = this.list;
                    for(let i = 0, len = list.length; i < len; i++) {
                        this.RegisterDrag(this.$refs[`roomType${i}`][0])                        
                    }
                }, 1000)
            }
        },
    }
</script>
<style scoped lang="scss">
    .roomSort {
        width: 100%;
        height: 34vh;
        overflow-y: auto;
        .roomTable {
            width: 100%;
            border: 1px solid #CCCCCC;
            .roomName {
                width: 15%;
                padding-left: 25px;
            }
            .roomNumber {
                width: 70%;
            }
            .tableHead {
                width: 100%;
                height: 32px;
                display: flex;
                font-size: 14px;
                color: #000;
                font-weight: 500;
                line-height: 32px;
                border-bottom: 1px solid #CCCCCC;
                .roomName {
                    width: 13%;
                }
                .roomNumber {
                    width: 70%;
                    padding-left: 30px;
                }
            }
            .tableBody {
                width: 100%;
                .tableBodyRow {
                    width: 100%;
                    height: 100%;
                    padding: 10px 0;
                    .tableBodyRowLi {
                        color: #434343;
                        font-size: 16px;
                        display: inline-block;
                        height: 24px;
                    }
                     .roomtype-item {
                         min-width: 80%;
                         vertical-align: top;
                         .rooms-item {
                            padding: 0 10px;
                            height: 24px;
                            cursor: move;
                            border: 1px solid #AAAAAA;
                            line-height: 24px;
                            display: inline-block;
                            margin: 0 7px;
                            background: white;
                        }
                    }
                    
                }
                .tableBodyRow:nth-child(even) {
                    background-color: rgba(239,239,239,1);;
                }
                .ghostClass {
                    border: 1px dashed #ccc !important;
                }
                .cloned-item {
                    opacity: 1 !important;
                }
            }
        }
    }
</style>
