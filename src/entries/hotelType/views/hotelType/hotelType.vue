<template>
    <div class="hotelType">
        <div class="hotelTypePageBody">
            <div class="hotelTypeRight">
                <hotel-type-right-content v-on:openModal="openModal" v-if="currentPath === '/'"></hotel-type-right-content>
                <router-view></router-view>
            </div>
        </div>
        <div class="addRoomTypeModal" v-if="roomTypeModal">
            <add-romm-type-modal
                v-if="roomTypeModal"
                :thisOpenValue="addRoomOpenValue"
                :roomTypeId="roomTypeId"
                v-on:closeAddRoomModal="closeAddRoomModal">
            </add-romm-type-modal>
        </div>
        <div class="setWeekAndSpecialPriceModal" v-if="setWeekAndSpecialPriceModal">
            <set-week-and-special-price-modal
                v-if="setWeekAndSpecialPriceModal"
                :thisOpenValue="setSpeciaPriceValue"
                :roomTypeId="roomTypeId"
                v-on:closeSetPrice='closeSetPrice'
                v-on:closeSetPriceModal="closeSetPriceModal">
            </set-week-and-special-price-modal>
        </div>
        <tool-tip-box-modal v-if="tooltipBox" :body-cont="toolTipBoxBodyCont"></tool-tip-box-modal>
        <div class="modalShadow" v-if="roomTypeModal||setWeekAndSpecialPriceModal"></div>
        
        <template v-if="setSpecialModalOpen">
            <set-special-price-modal :data='setSpecialModalData' :closeSpecialModa='closeSpecialModa' :closeSetPriceModal='closeSetPriceModal'></set-special-price-modal>
        </template>
        
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    import {getCookie} from 'common_libs/util.js'
    import hotelTypeRightContent from '../../components/common/hotelTypeRightContent/hotelTypeRightContent.vue'
    import addRommTypeModal from '../../components/common/hotelModal/addHotelRoomTypeModal'
    import setWeekAndSpecialPriceModal from '../../components/common/hotelModal/setWeekAndSpecialPriceModal.vue'
    import toolTipBoxModal from '../../components/common/hotelModal/toolTipBoxModal.vue'
    import setSpecialPriceModal from '../../components/common/hotelModal/setSpecialPriceModal'

    export default {
        name: 'hotelStatus',
        components: {
            hotelTypeRightContent,
            addRommTypeModal,
            setWeekAndSpecialPriceModal,
            toolTipBoxModal,
            setSpecialPriceModal
        },
        data() {
            return {
                roomTypeModal: false,
                setWeekAndSpecialPriceModal: false,
                tooltipBox: false,
                toolTipBoxBodyCont: '',
                addRoomOpenValue: false,
                setSpeciaPriceValue: false,
                roomTypeId: Number,
                setSpecialModalOpen: false,
                setSpecialModalData: null,
            }
        },
        created() {
            this.dispatchGetHotelRoomTypeInfoList({'innId': getCookie('innId')})
            this.dispatchFestivalList()
        },
        computed: {
            hotelOrderChangeToolTipBox() {
                return this.$store.state.hotelStatus.hotelOrderChangeToolTipBox;
            },
            currentPath () {
                return this.$route.path
            }
        },

        watch: {
            hotelOrderChangeToolTipBox(data) {
                this.tooltipBox = data.isOpen;
                this.toolTipBoxBodyCont = data.bodyCont;
            }
        },
        methods: {
            ...mapActions(['dispatchGetHotelRoomTypeInfoList', 'dispatchFestivalList']),
            closeAddRoomModal(data) {
                return this.roomTypeModal = data;
            },
            openModal(data) {
                if (data[0] === 'addRoomModal') {
                    data[1] >= 0 ? this.addRoomOpenValue = data[1] : this.addRoomOpenValue = false;
                    data[2] && (this.roomTypeId = data[2]);
                    return this.roomTypeModal = true;
                } else if (data[0] === 'setPriceModal') {
                    data[1] >= 0 ? this.setSpeciaPriceValue = data[1] : this.setSpeciaPriceValue = false;
                    data[2] && (this.roomTypeId = data[2]);
                    return this.setWeekAndSpecialPriceModal = true
                } else return false;
            },
            closeSetPriceModal(data) {
                return this.setWeekAndSpecialPriceModal = data;
            },
            closeSetPrice(day) {
                /*  打开 setSpecialModal 组件, 并且传入数据 */
                if(day) {
                    this.setSpecialModalOpen = true;
                    this.setSpecialModalData = day;
                }
            },
            closeSpecialModa(boo) {
                /* 通过setSpecialModal 组件 回调关闭 */
                this.setSpecialModalOpen = boo;
            }
        }
    }
</script>

<style scoped lang="scss">
    .hotelType {
        width: 100%;
        min-height: 100vh;
        min-width: 1280px;
        margin: 0;
        padding: 0;
        overflow: hidden;

        .modalShadow {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1000;
            width: 100vw;
            height: 100vh;
            background: rgba(170, 170, 170, 1);
            opacity: 0.27;
        }
        .setWeekAndSpecialPriceModal {
            width: 795px;
            height: 595px;
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 100000;
            transform: translate(-50%, -50%);
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 9px 5px 35px rgba(163, 163, 163, 1);
        }
        .addRoomTypeModal {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 100000;
            transform: translate(-50%, -50%);
            max-height: 395px;
            min-height: 305px;
            width: 425px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 9px 5px 9px rgba(202, 202, 202, 1);
        }
        .hotelStatusPageHead {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            min-width: 1280px;
            height: 70px;
            justify-content: space-between;
            z-index: 1000;
        }
        .hotelTypePageBody {
            width: 100%;
            min-height: calc(100vh - 70px);
            position: relative;
            display: flex;
            overflow: auto;
            justify-content: flex-start;
            .hotelTypeLeft {
                position: absolute;
                left: 0;
                width: 198px;
                min-width: 198px;
                height: 100%;
                background-color: #fff;
                box-shadow: 4px 0 6px rgba(221, 221, 221, 1);
            }
            .hotelTypeRight {
                width: 100%;
                margin-left: 10px;
                margin-right: 10px;
                padding-top: 30px;
            }
        }
    }
</style>
