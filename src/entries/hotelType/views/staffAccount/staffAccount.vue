<template>
    <div class="staff-account margin_x_c">
        <div class="add-account">
            <span class="textCent cursPoint" @click="addStaff">添加员工</span>
        </div>

        <hotel-people
            v-for="item in staffList"
            :key="item.id"
            @on-remove="removeStaff"
            @on-delete="deleteStaff"
            @on-update="updateStaff"
            :data="item"
        ></hotel-people>

        <!-- 编辑、添加员工模态框 -->
        <app-modal
            v-model="updateModal"
            :header-hide="true"
            :footer-hide="true"
            scrollable
            :width="521"
            :height="addStaffStep === 3? 235: 440"
            @on-cancle="initData"
        >
            <modal-header :title="modalTitle" slot="header"></modal-header>
            <add-staff
                ref="addStaff"
                :model="updateModel"
                v-if="addStaffStep === 1"
                :staff-info="currentStaffInfo"
                :all-staff-phone="allStaffPhone"
                :master-hotel="masterHotel"
            >
            </add-staff>
            <select-authority
                v-if="addStaffStep === 2"
                :model="updateModel"
                :hotel-list-ids="addStaffData.acsriptionHotel"
                @on-change="onChangeSelectAuthority"
                :authority-obj="authorityObj"
            >
            </select-authority>
            <div class="activation-account fontSize16" v-if="addStaffStep === 3">
                <p class="textCent">员工账号待激活</p>
                <p class="content">
                    注册引导以短信形式已发送到该手机号，依照 <br/>短信指引完成激活即可登录疯特民宿管家。
                </p>
            </div>

            <div slot="footer" class="modal-footer textCent">
                <button class="public-buttons save" @click="addStaffNext" v-if="addStaffStep === 1">下一步</button>
                <button
                    :class="{
                        'public-buttons': true,
                        save: !disabledUpdateStaff,
                        disabled: disabledUpdateStaff
                    }"
                    v-if="addStaffStep === 2"
                    @click="confirmUpdate"
                >
                    {{ updateModel === 'add'? '确定添加': '确定修改' }}
                </button>
                <button class="public-buttons save" @click="initData" v-if="addStaffStep === 3">确定</button>
            </div>
        </app-modal>

        <!-- 删除员工模态框 -->
        <app-modal
            v-model="delModal"
            :header-hide="true"
            :footer-hide="true"
            :width="521"
            :height="235"
            @on-cancle="initData"
        >
            <modal-header title="删除员工" slot="header"></modal-header>
            <div class="del-staff-container fontSize16 textCent">
                确认从xx删除此员工吗？<br/>
                （员工账号不会被删除）
            </div>
            <div slot="footer" class="modal-footer textCent del-modal-footer">
                <button class="public-buttons cancle" @click="cancleDel">取消</button>
                <button class="public-buttons del" @click="confirmDel">删除</button>
            </div>
        </app-modal>

        <!-- 移交客栈模态框 -->
        <app-modal
            v-model="removeModal"
            :header-hide="true"
            :footer-hide="true"
            :width="521"
            :height="removeHotelStep === 3? 235: 330"
            @on-cancle="initData"
        >
            <modal-header title="移交客栈" slot="header"></modal-header>
            
            <template v-if="removeHotelStep === 3">
                <div class="del-staff-container fontSize16 textCent">
                    是否确认移交xx？<br/>
                    （移交后您无法再查看和管理此客栈！）
                </div>
            </template>
            <template v-else>
                <remove-hotel
                    ref="removeHotel"
                    :staff-info="currentStaffInfo"
                    :step="removeHotelStep"
                    :key="removeHotelStep"
                >
                </remove-hotel>
            </template>
            
            <div slot="footer" class="modal-footer textCent del-modal-footer">
                <template v-if="removeHotelStep === 3">
                    <button class="public-buttons cancle" @click="cancleRem">取消</button>
                    <button class="public-buttons save" @click="confirmRem">确定</button>
                </template>
                <template v-else>
                    <button class="public-buttons save" @click="removeHotelNext">
                        {{removeHotelStep === 1? '下一步': '确定'}}
                    </button>
                </template>
            </div>
        </app-modal>
    </div>
</template>

<script>
import AppModal from 'common_components/AppModal'
import HotelPeople from 'hotelType/components/common/staffAccount/HotelPeople'
import RemoveHotel from 'hotelType/components/common/staffAccount/RemoveHotel'
import AddStaff from 'hotelType/components/common/staffAccount/AddStaff'
import ModalHeader from 'hotelType/components/ModalHeader'
import SelectAuthority from 'hotelType/components/common/staffAccount/SelectAuthority'
import {
    staffAccountApiServer
} from 'hotelType/api/API'
import {
    deepCopy,
    getCookie,
    setCookie,
    compare
} from 'common_libs/util'

export default {
    name: 'staffAccount',
    data () {
        return {
            updateModal: false,
            delModal: false,
            removeModal: false,
            modalTitle: '',
            addStaffStep: 1,
            removeHotelStep: 1,
            removeHotelSubmitData: {}, // 移交酒店提交数据
            updateModel: 'add',
            staffList: [],
            addStaffData: {
                acsriptionHotel: []
            },
            currentStaffInfo: {},
            disabledUpdateStaff: false,  // 禁止更新/添加 员工
            removeHotelParams: {},
            authorityObj: {},
            useless: false,
            allStaffPhone: [], //  当前主账号下，所有员工电话号码集合
            masterHotel: []
        }
    },
    created() {
        this.getStaffList()
    },
    components: {
        HotelPeople,
        AddStaff,
        AppModal,
        ModalHeader,
        SelectAuthority,
        RemoveHotel
    },
    methods: {
        initData () {
            /* 初始化所有数据 */
            this.modalTitle = ''
            this.addStaffStep = 1
            this.removeHotelStep = 1
            this.updateModel = 'add'
            this.updateModal = false
            this.masterHotel = []
        },
        getStaffList () {
            staffAccountApiServer.getStaffList().then(res => {
                if (res.code === '000000' && res.content) {
                    let content = res.content
                    content.sort(compare('sort', false))
                    content.map(item => {
                        item.employees.sort(compare('master', false))
                        for (let i = 0, len = item.employees.length; i < len; i++)
                            this.allStaffPhone.push(item.employees[i].telephone)
                    })
                    this.staffList = res.content
                }
            })
        },
        addStaff () {
            this.modalTitle = '添加员工'
            this.updateModal = true
        },
        addStaffNext() {
            /* 添加员工 -》 下一步 */
            this.$refs.addStaff.validateForm((res, data) => {
                if (res) {
                    this.addStaffData = Object.assign(this.addStaffData, data)
                    if (this.updateModel === 'add') {
                        staffAccountApiServer.judgeExists({
                            innList: data.acsriptionHotel,
                            phone: data.phone
                        }).then(response => {
                            if (response.code === '000000') {
                                if (response.content)
                                    this.$Message.error('添加手机号，有客栈已关联！')
                                else {
                                    this.addStaffStep = 2
                                    this.modalTitle = '选择权限'
                                }
                            }
                        })
                    } else {
                        this.addStaffStep = 2
                        this.modalTitle = '选择权限'
                    }
                }
            })
        },
        confirmUpdate () {
            /* 确定新增\修改 */
            if (!this.disabledUpdateStaff) {
                if (this.updateModel === 'add') {
                    staffAccountApiServer.addEmployee({
                        phone: this.addStaffData.phone,
                        employeeName: this.addStaffData.name,
                        inns: JSON.stringify(this.addStaffData.inns)
                    }).then(res => {
                        if (res.code === '000000') {
                            this.$Message.success('添加成功')
                            if (res.content === 1 || res.content === 0) {
                                this.addStaffStep = 3
                            } else {
                                this.updateModal = false
                                this.initData()
                            }
                            this.getStaffList()
                        } else {
                            this.$Message.error(res.message)
                        }
                    })
                } else {
                    let masterPermissionObj = {}
                    for (let i = 0, len = this.masterHotel.length; i < len; i++) {
                        let innId = this.masterHotel[i]
                        masterPermissionObj[innId] = this.authorityObj[innId].map(item => item.permissionId)
                    }
                    staffAccountApiServer.editEmployee({
                        employeeName: this.addStaffData.name,
                        inns: JSON.stringify(Object.assign(this.addStaffData.inns, masterPermissionObj)),
                        id: this.addStaffData.id
                    }).then(res => {
                        if (res.code === '000000') {
                            this.$Message.success('修改成功')
                            this.updateModal = false
                            this.getStaffList()
                            this.initData()
                        }
                    })
                }
            }
        },
        onChangeSelectAuthority (data) {
            /* 监听从 SelectAuthority 数据  */
            this.addStaffData.inns = data
            for (let key in data) {
                let item = data[key]
                if (item.length === 0) {
                    this.disabledUpdateStaff = true
                    continue
                } else
                    this.disabledUpdateStaff = false
            }
        },
        removeHotelNext () {
            /* 移交客栈 -》 下一步 */
            this.$refs.removeHotel.validateForm((res, data) => {
                if (res) {
                    if (this.removeHotelStep === 1) {
                        staffAccountApiServer.transInnFirst({
                            phone: data.phone,
                            vcode: data.phoneValidate,
                            imgCode: data.imgCode,
                            codeToken: getCookie('codeToken'),
                            innId: this.currentStaffInfo.innId
                        }).then(res => {
                            if (res.code === '000000') {
                                this.removeHotelStep += 1
                                this.currentStaffInfo.telephone = ''
                            } else {
                                this.useless = !this.useless
                                let space = this.useless ? ' ': '  '
                                this.$refs.removeHotel.vCodeErr = res.message + space
                            }
                        })
                    } else if (this.removeHotelStep === 2) {
                        this.removeHotelParams = {
                            transerPhone: data.phone,
                            transerVcode: data.phoneValidate,
                            imgCode: data.imgCode,
                            codeToken: getCookie('codeToken'),
                            innId: this.currentStaffInfo.innId
                        }
                        staffAccountApiServer.transInnSecond(this.removeHotelParams).then(res => {
                            if (res.code === '000000') {
                                this.removeHotelStep += 1
                            } else {
                                this.useless = !this.useless
                                let space = this.useless ? ' ': '  '
                                this.$refs.removeHotel.vCodeErr = res.message + space
                            }
                        })
                    }
                }
            })
        },
        removeStaff (data) {
            /* 移交客栈 */
            this.currentStaffInfo = deepCopy(data)
            this.removeModal = true
        },
        deleteStaff (data) {
            this.currentStaffInfo = deepCopy(data)
            this.delModal = true
        },
        updateStaff (data) {
            let masterHotelRequest = new Promise(res => {
                staffAccountApiServer.masterHotelByUserId({
                    userId: data.userId
                }).then(response => {
                    if (response.code === '000000')
                        res(response.content)
                })
            })
            let permissionListRequest = new Promise(res => {
                staffAccountApiServer.permissionListByUerId({
                    userId: data.userId
                }).then(response => {
                    if (response.code === '000000') {
                        res(response.content)
                    }
                })
            })

            Promise.all([masterHotelRequest, permissionListRequest]).then(res => {
                let masterHotel = res[0]
                let permissionList = res[1]
                let acsriptionHotel = []
                this.authorityObj = permissionList
                this.masterHotel = masterHotel
                for (let key in permissionList) {
                    let innId = Number(key)
                    if (masterHotel.indexOf(innId) === -1)
                        acsriptionHotel.push(Number(key))
                }
                this.currentStaffInfo = deepCopy(data)
                this.currentStaffInfo.acsriptionHotel = acsriptionHotel
                this.modalTitle = '编辑'
                this.updateModel = 'update'
                this.updateModal = true
            })
        },
        confirmDel () {
            /* 确定删除员工 */
            staffAccountApiServer.deleteEmployee({
                id: this.currentStaffInfo.id
            }).then(res => {
                this.$Message.success('删除成功')
                this.getStaffList()
                this.delModal = false
            })
        },
        cancleDel () {
            /* 取消删除员工 */
            this.delModal = false
        },
        cancleRem () {
            this.removeModal = false
            this.initData()
        },
        confirmRem () {
            staffAccountApiServer.confirmRemove(this.removeHotelParams).then(res => {
                if (res.code === '000000') {
                    this.$Message.success('移交客栈成功')
                    setTimeout( () => {
                        this.out()
                    },500)
                    // this.removeModal = false
                    // this.initData()
                    // this.getStaffList()
                }
            })
        },
        // 退出登陆
        out () {
            setCookie('token', '');
            setCookie('innId', '');
            setCookie('userId', '');
            setCookie('innName', '');
            this.junpTo('/index/index.html')
        },

        			
        // 跳转
        junpTo (path, newOpen) {
            if (newOpen) {
                window.open(path)
            } else {
                window.location.href = path
            }
        },
    },
    watch: {
        updateModal: {
            handler (val) {
                var main = document.getElementsByClassName('main');
                if(val){
                    main[0].style.overflow = 'hidden'
                }else{
                    main[0].style.overflow = 'auto'
                }
            },
            deep: true
        },
    }
}
</script>

<style lang="scss">
    .staff-account {
        $base-color: #235F92;
        width: 90%;
        padding-top: 40px;
        .add-account {
            text-align: right;
            margin-bottom: 13px;
            .textCent {
                width: 119px;
                height: 36px;
                line-height: 36px;
                font-size: 14px;
                border: 1px solid $base-color;
                border-radius: 20px;
                display: inline-block;
                color: #9AA7C1;
                transition: color .3s;
                &:hover {
                    color: $base-color;
                }
            }
        }
        .activation-account {
            color: #666666;
            .content {
                margin: 26px 0 0 97px;
            }
        }
        .modal-footer {
            height: 50px;
            background: #fcfcfc;
            padding: 8px 35px 0;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
        }
        .del-modal-footer {
            display: flex;
            justify-content: space-around;
        }
        .del-staff-container {
            /* 删除与员工模态框 */
            color: #666;
            margin-top: 40px;
        }
        .ivu-checkbox-wrapper {
            font-size: 14px;
            width: 32%;
            margin-right: 0;
            .ivu-checkbox {
                margin-right: 3px;
            }
        }
    }
</style>
