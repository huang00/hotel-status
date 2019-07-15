<template>
    <div class="remove-hotel">
        <p class="prompt">您创建的客栈可移交给其他用户，移交后您无法再查看和管理此客栈！</p>
        <div class="account-validate fontSize14">
            {{ step === 1? '验证账号': '移交对象（需有疯特账号）' }}
        </div>
        <Form
            @submit.native.prevent
            class="remove-hotel-form form-err"
            ref="removeHotelForm"
            :model="removeHotelForm"
            :rules="removeHotelRuleValidate"
            :label-width="90"
        >
            <FormItem label="注册号码" prop="phone">
                <span style="color: #999;" v-if="step === 1">{{ removeHotelForm.phone }}</span>
                <Input
                    v-else
                    v-model="removeHotelForm.phone"
                    :maxlength="11"
                    placeholder="请输入11位手机号码"
                    style="width: 196px; margin-right: 13px;">
                </Input>
            </FormItem>
            <FormItem label="图形验证码 " prop="imgCode">
                <Input
                    v-model="removeHotelForm.imgCode"
                    :maxlength="10"
                    placeholder="图形验证码"
                    style="width: 196px; margin-right: 13px;">
                </Input>
                <img :src="verigyCodeImg" class="verigy-code-img cursPoint" alt="验证码" width="110" height="32" @click="getVerifyCode">
                <span style="color: #205C90; text-decoration: underline;" class="cursPoint" @click="getVerifyCode">换一张</span>
            </FormItem>
            <FormItem label="验证码" prop="phoneValidate" :error="vCodeErr">
                <Input
                    v-model="removeHotelForm.phoneValidate"
                    :maxlength="10"
                    placeholder="短信验证码"
                    style="width: 196px; margin-right: 13px;">
                </Input>
                <button :class="{
                    'get-vcode': true,
                    'public-buttons': true,
                    edit: !sendMessDisabled,
                    disabled: sendMessDisabled
                }"  @click="getPhoneCode">
                    {{ sendMessDisabled? `${timer}s 后重新发送`: '获取验证码' }}
                </button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import {
    validateRule,
    getCookie
} from 'common_libs/util'
import {
    publicHttpServer
} from '@/api/api'

export default {
    name: 'RemoveHotel',
    props: {
        step: {
            type: Number,
            default: 1
        },
        staffInfo: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        const validateImgCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('图形验证码不能为空'));
            }
            if (this.isValidateImg) {
                publicHttpServer.sendMessToken({
                    phone: this.removeHotelForm.phone,
                    vcode: this.removeHotelForm.imgCode,
                    codeToken: getCookie('codeToken'),
                    ac: this.step === 1? 'trans_self': 'transer'
                }).then(res => {
                    if (res.code !== '000000') {
                        callback(new Error(res.message))
                        this.timer = 0
                        this.getVerifyCode()
                    } else
                        callback()
                })
            } else
                callback()
        }
        return {
            removeHotelForm: {
                phone: '',
                imgCode: '',
                phoneValidate: ''
            },
            removeHotelRuleValidate: {
                imgCode: [
                    { required: true, message: '图形验证码不能为空', trigger: 'blur' },
                    { validator: validateImgCode, trigger: ' ' }
                ],
                phoneValidate: [
                    { required: true, message: '短信证码不能为空', trigger: 'blur' }
                ]
            },
            timer: 60,
            sendMessDisabled: false,
            verigyCodeImg: '',
            isValidateImg: true,
            vCodeErr: ''
        }
    },
    created() {
        if (this.step === 2)
            this.removeHotelRuleValidate.phone = [
                { required: true, message: '手机号码不能为空', trigger: 'blur' },
                { pattern: validateRule.phoneNumber, message: '请输入正确的手机号', trigger: 'blur' }
            ]
        this.removeHotelForm.phone = this.staffInfo.telephone
        this.getVerifyCode()
    },
    methods: {
        validateForm (callback) {
            this.isValidateImg = false
            this.$refs.removeHotelForm.validate(res => {
                callback(res, Object.assign(this.removeHotelForm, {
                    codeToken: getCookie('codeToken')
                }))
            })
        },
        getVerifyCode() {
            this.verigyCodeImg = `/user/common/securityCode?index=${new Date().valueOf()}`;
        },
        getPhoneCode () {
            this.isValidateImg = true
            if (!this.sendMessDisabled) {
                if (this.step === 1) {
                    this.sendmessBefore()
                } else if (this.step === 2) {
                    this.$refs.removeHotelForm.validateField('phone', err => {
                        this.sendmessBefore()
                    })
                }
            }
        },
        sendmessBefore () {
            this.$refs.removeHotelForm.validateField('imgCode', err => {
                if (!err) {
                    this.timer = 60
                    let timer = setInterval(() => {
                        this.sendMessDisabled = true
                        this.timer--
                        if (this.timer <= 0) {
                            this.sendMessDisabled = false
                            clearInterval(timer)
                            this.getVerifyCode()
                        }
                    }, 1000)
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .remove-hotel {
        $base-color: #235F92;
        /* 移交客栈 */
        margin-top: -10px;
        padding: 0 15px;
        .prompt {
            color: #9AA7C1;
        }
        .account-validate {
            color: $base-color;
            margin-top: 20px;
        }
        .remove-hotel-form {
            background-color: #F4F8FC;
            padding: 20px 10px;
            padding-right: 0;
        }
        .ivu-input-wrapper {
            .ivu-input {
                background-color: #F4F8FC;
            }
        }
        .verigy-code-img {
            vertical-align: middle;
        }
    }
</style>

