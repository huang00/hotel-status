<template>
    <div class="add-staff">
        <Form
            @submit.native.prevent
            class="add-staff-form form-err"
            ref="addStaffForm"
            :model="addStaffForm"
            :rules="addStaffRuleValidate"
            :label-width="80"
        >
            <FormItem label="手机号码" prop="phone" v-if="model === 'add'">
                <Input size="large" v-model="addStaffForm.phone" :maxlength="11" placeholder="请输入员工11位手机号"></Input>
            </FormItem>
            <FormItem label="员工名称" prop="name">
                <Input size="large" v-model="addStaffForm.name" :maxlength="10" placeholder="请输入员工姓名或称呼"></Input>
            </FormItem>
            <FormItem label="所属客栈" prop="acsriptionHotel">
                <CheckboxGroup v-model="addStaffForm.acsriptionHotel">
                    <Checkbox
                        v-for="item in hotelList"
                        :key="item.innId"
                        :label="item.innId"
                        class="text-break-1"
                        :title="item.innName"
                    >
                        {{ item.innName }}
                    </Checkbox>
                </CheckboxGroup>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import {
    validateRule
} from 'common_libs/util'

export default {
    name: 'AddStaff',
    props: {
        model: {
            type: String,
            default: 'add'
        },
        staffInfo: {
            type: Object,
            default () {
                return {}
            }
        },
        allStaffPhone: {
            type: Array,
            default () {
                return []
            }
        },
        masterHotel: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data() {
        const vPhoneNumver = (rule, value, callback) => {
            if (this.phoneNumber === value) {
                return callback(new Error('不能添加自己为员工账号'))
            }
            // for (let i = 0, len = this.allStaffPhone.length; i < len; i++) {
            //     if (this.allStaffPhone[i] === value) {
            //         return callback(new Error('该账号下已存在该员工账号'))
            //     }
            // }
            callback()
        }
        return {
            addStaffForm: {
                name: '',
                phone: '',
                acsriptionHotel: []
            },
            addStaffRuleValidate: {
                phone: [
                    { required: true, type: 'string', message: '电话号码不能为空', trigger: 'blur' },
                    { pattern: validateRule.phoneNumber, message: '请输入正确的手机号', trigger: 'blur' },
                    { validator: vPhoneNumver, trigger: 'blur' }
                ],
                acsriptionHotel: [
                    { required: true, type: 'array', min: 1, message: '所属客栈不能为空', trigger: 'change' }
                ]
            }
        }
    },
    created() {
        if (this.model !== 'add') {
            this.addStaffForm.acsriptionHotel = this.staffInfo.acsriptionHotel
            this.addStaffForm.name = this.staffInfo.employeeName
            this.addStaffForm.id = this.staffInfo.id
        }
    },
    computed: {
        phoneNumber () {
            return this.$store.getters.userInfo.phoneNumber
        },
        hotelList () {
            return this.$store.getters.hotelList.filter(item => this.masterHotel.indexOf(item.innId) === -1)
        }
    },
    methods: {
        validateForm (callback) {
            this.$refs.addStaffForm.validate(res => {
                callback(res, this.addStaffForm)
            })
        }
    }
}
</script>

<style lang="scss">
    .add-staff {
        padding: 0 20px;
        .add-staff-form {
            margin-top: 35px;
        }
    }
</style>

