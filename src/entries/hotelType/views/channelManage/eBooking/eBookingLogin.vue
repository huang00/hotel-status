<template>
    <div class="channelLogin">
        <div class="head">
            <div class="imgs">
                <img src="./img/timelySynchronous.png">
                <p>订单实时同步</p>
            </div>
            <div class="imgs">
                <img src="./img/nimbleSwitch.png">
                <p>便捷放量开关</p>
            </div>
            <div class="imgs">
                <img src="./img/unifiedManage.png">
                <p>价格统一管理</p>
            </div>
        </div>
        <div class="connetBox">
            <p class="channelIcon">
                <img src="./img/channelIcon.png">
            </p>
            <Form class="connetForm" ref="connetForm" :model="connetForm" :rules="rule" :label-width="80">
                <FormItem label="EBK账号：" prop="ebkAccount">
                    <Input type="text" @on-focus="onFocus" v-model="connetForm.ebkAccount" placeholder="请输入账号"></Input>
                </FormItem>
                <FormItem label="EBK密码：" prop="ebkPassword">
                    <Input type="password" @on-focus="onFocus" v-model="connetForm.ebkPassword" @keyup.native.enter="handleSubmit('connetForm')" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem style="margin-bottom: 0;">
                    <span style="color: #ed3f14; display: inline-block; height: 18px;">{{ errinfo }}</span>
                </FormItem>
                <FormItem class="protocol">
                    <span class="checkbox" @click="agree = !agree">
                        <img src="./img/checked.png" width="24" height="24" v-if="agree">
                        <img v-else src="./img/check.png" height="24" width="24">
                    </span>
                    我已阅读并同意<span @click="ebookingProtocolModal = true">《赫程直连协议》</span>
                </FormItem>
                <div class="loginButton">
                    <Button type="primary" :disabled="!agree || loging" @click="handleSubmit('connetForm')">{{ loging?'登录中...':'登录' }}</Button>
                </div>
            </Form>
        </div>
        <!-- 确认协议 -->
        <app-modal v-model="confirmProtocolModal" :title="'请您确认赫程直联后的模式差异'" :width="750" :showFooter="false" :height="400">
            <confirm-ebooking-protocol @on-allselected="onAllselected"></confirm-ebooking-protocol>
        </app-modal>
        <!-- 协议模态框 -->
        <Modal
            v-model="ebookingProtocolModal"
            width="50%" height="80vh">
            <p slot="header" style="color:#f60;text-align:center;font-size: 16px;">
                <span>赫程直连协议</span>
            </p>
            <ebooking-protocol></ebooking-protocol>
            <div slot="footer" style="text-align: center;">
                <Button size="large" @click="ebookingProtocolModal = false">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { getCookie } from 'common_libs/util'
    import { innRoomTypeApiServers } from '../../../api/API'
    import AppModal from 'pms-modal'
    import ConfirmEbookingProtocol from '../../../components/common/channelManage/confirmEbookingProtocol'
    import EbookingProtocol from '../../../components/common/channelManage/ebookingProtocol'

    export default {
        naem: 'eBookingLogin',
        components: {
            AppModal,
            ConfirmEbookingProtocol,
            EbookingProtocol
        },
        data () {
            const validateAccount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else {
                    if (this.connetForm.ebkPassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.connetForm.validateField('ebkPassword');
                    }
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            
            return {
                connetForm: {
                    ebkAccount: '',
                    ebkPassword: ''
                },
                rule: {
                    ebkAccount: [
                        { validator: validateAccount, trigger: 'blur' }
                    ],
                    ebkPassword: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                },
                agree: true,
                errinfo: '',
                loging: false,
                confirmProtocolModal: false,
                ebookingProtocolModal: false
            }
        },
        computed: {
            channelList () {
                return this.$store.state.hotelStatus.channelList
            }
        },
        methods: {
            ...mapActions(['dispatchChannelList']),
            handleSubmit (name) {
                if (this.agree && !this.loging) {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.confirmProtocolModal = true
                        }
                    })
                } else {
                    this.errinfo = '请先阅读协议并同意'
                }
                
            },
            onFocus () {
                this.errinfo = ''
            },
            login () {
                let param = {
                    userId: getCookie('userId'),
                    innId: getCookie('innId'),
                    accountName: this.connetForm.ebkAccount,
                    accountPassword: this.connetForm.ebkPassword,
                    pmsCode: 'FTPMS',
                    otaId: '1'
                }
                this.loging = true
                innRoomTypeApiServers.openChannel(param).then(result => {
                    if (result.code === '000000') {
                        let list = this.channelList
                        let channelId = result.content.channelId
                        for (let i = 0, len = list.length; i < len; i++) {
                            if (list[i].otaId === '1') {
                                let item = list[i]
                                item.status = 1
                                item.channelId = channelId
                            }
                        }
                        this.dispatchChannelList([])
                        this.dispatchChannelList(list)
                        this.errinfo = ''
                    } else {
                        this.errinfo = result.message
                    }
                    this.loging = false
                })
            },
            onAllselected (boo) {
                this.confirmProtocolModal = false
                if (boo) {
                    this.login()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
@import './css/eBookingLogin'
</style>
