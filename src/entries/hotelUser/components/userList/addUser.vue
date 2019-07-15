<!-- 添加客户 -->
<template>
  <Modal v-model="addUserModal" width='665' class='change-record-modal' footer-hide>
    <div class="add-user-modal">
      <div class="title">{{pannelType}}</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
        style="padding: 24px 88px 0 58px;">
        <FormItem label="姓名" prop="name"  >
          <Input v-model.trim="formValidate.name" @on-keyup='validName(formValidate.name)' @on-blur='validName(formValidate.name)'   :maxlength="30" placeholder="请输入客户姓名"></Input>
          <span class="wraning" style="width: 200px; left: 0; bottom: 3px; height: 0;" v-if="showNameFalse">
            <span style="font-size: 12px;color:rgb(237, 64, 20);">
              <Icon type="md-alert" /> 请输入客户姓名
            </span>
          </span>  
        </FormItem>

        <FormItem label="电话" prop="telephoneNum" v-show="pannelType =='添加客户'">
          <Input @on-keyup='validPhone(formValidate.telephoneNum)' @on-blur='validPhone(formValidate.telephoneNum)' v-model.trim="formValidate.telephoneNum" :maxlength="16" placeholder="请输入联系方式"></Input>
          <span class="wraning" style="width: 200px; left: 0; bottom: 3px; height: 0;" v-if="showPhoneFalse">
            <span style="font-size: 12px;color:rgb(237, 64, 20);">
              <Icon type="md-alert" /> 请输入正确的电话
            </span>
          </span>
        </FormItem>
        <FormItem label="电话" prop="telephoneNum" v-show="pannelType =='编辑客户信息'">
          {{formValidate.telephoneNum}}
          <span v-if='formValidate.telephoneNumAttribution'>（{{formValidate.telephoneNumAttribution}}）</span>
          <span v-else>{{formValidate.telephoneNumAttribution}}</span>
        </FormItem>

        <FormItem label="证件" prop="identityType">
          <Select @on-change='chooseCard' v-model.trim="formValidate.identityType" placeholder="请选择证件类型"
            style="width:120px">
            <Option v-for='item in zjList' :value="item.value" :key='item.value'>{{item.label}}</Option>
          </Select>
          <Input @on-blur='validId' v-model.trim="formValidate.identityNo" ::maxlength="18" placeholder="请输入证件号码"
            style="width:265px; margin-left: 18px;"></Input>
          <span class="wraning" style="width: 200px; left: 141px; bottom: 3px; height: 0;" v-if="showIDfalse">
            <span style="font-size: 12px;color: rgb(237, 64, 20);">
              <Icon type="md-alert" /> 请输入正确的身份证
            </span>
          </span>
        </FormItem>
        <FormItem label="性别" prop="gender">
          <Select @on-change='chooseSex' v-model.trim="formValidate.gender" placeholder="请选择性别">
            <Option value="man">男</Option>
            <Option value="woman">女</Option>
          </Select>
        </FormItem>
        <FormItem label="生日">
          <Select @on-change='chooseYear' v-model="formValidate.year" placeholder="请选择年" style="width: 120px;">
            <Option v-for='y in yearList' :value="y" :key='y'>{{y}} 年</Option>
          </Select>
          <Select @on-change='chooseMonth' v-model="formValidate.month" placeholder="请选择月"
            style="width: 120px;margin-left: 19px;">
            <Option v-for="(m, index) in monthList" :value="m" :key="m">{{m}}月</Option>

          </Select>
          <Select @on-change='chooseDate' v-model="formValidate.date" placeholder="请选择日"
            style="width: 120px;margin-left: 20px;">
            <Option v-for='(d, index) in dateList' :value="d" :key='d'>{{d}}日</Option> {{formValidate.date}}
          </Select>
        </FormItem>
        <FormItem label="民族" prop="nation">
          <Input @on-blur='checkNation' v-model.trim="formValidate.nation" :maxlength="20" placeholder="请输入民族"></Input>
          <span class="wraning" style="width: 200px; left: 0; bottom: 3px; height: 0;" v-if="showNationfalse">
            <span style="font-size: 12px;color:rgb(237, 64, 20);">
              <Icon type="md-alert" /> 只能输入中文
            </span>
          </span>
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model.trim="formValidate.address" :maxlength="50" placeholder="请输入客户家庭住址"></Input>

        </FormItem>
        <FormItem label="微信" prop="weChatId">
          <Input @on-blur='checkWX' v-model.trim="formValidate.weChatId" :maxlength="30" placeholder="请输入客户微信号"></Input>
          <span class="wraning" style="width: 200px; left: 0; bottom: 3px; height: 0;" v-if="showWXfalse">
            <span style="font-size: 12px;color:rgb(237, 64, 20)">
              <Icon type="md-alert" /> 请输入正确的微信号
            </span>
          </span>
        </FormItem>
        <FormItem label="备注" prop="remarks">
          <Input v-model.trim="formValidate.remarks" type="textarea" :maxlength="100" :autosize="{minRows: 4,maxRows: 7}"
            placeholder="请输入客户习惯、要求等"></Input>
        </FormItem>
      </Form>
      <div class='save-btn' v-show="pannelType =='添加客户'" @click="saveBtn">保存</div>
      <div class='save-btn' v-show="pannelType =='编辑客户信息'" @click="editSaveBtn">保存</div>
    </div>
  </Modal>
</template>
<script>
  import { hotelUserApiSercers } from '../../api/API'
  import { formatStampYMD, changeMoney } from '../../libs/util.js'
  import { validateRule } from '../../../../common_libs/util'
  export default {
    data() {
      return {
        addUserModal: false,
        pannelType: '添加客户',
        showIDfalse: false,
        showWXfalse: false,
        showNameFalse: false,
        showNationfalse: false,
        showPhoneFalse: false,
        saveBtnFlag: true, // 允许添加 发送请求
        zjList: [
          {
            value: 'identity',
            label: '身份证',
          },
          {
            value: 'passport',
            label: '护照',
          },
          {
            value: 'officers',
            label: '军官证',
          },
          {
            value: 'other',
            label: '其他',
          },

        ],
        yearList: this.createYear(),
        dateList: this.createDate((new Date()).getFullYear(), (new Date()).getMonth() + 1),
        monthList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        formValidate: {
          name: '',
          telephoneNum: '', // telephoneNum phone
          phoneAddress: '', // Address
          identityType: '',
          identityNo: '', //51102418800505004
          gender: '',
          year: '',
          month: '',
          date: '',
          nation: '汉族',
          address: '',
          weChatId: '',
          remarks: '',
          telephoneNumAttribution: ''
        },
        currentId: '',
        temPhone: '',
        tempBirthday: '',
        ruleValidate: {
          name: [
            { required: true, message: ' ', trigger: 'change' }
          ],
          telephoneNum: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
        },

      }
    },
    watch: {
      addUserModal(val) {
        if (!val) {
          this.clearForm('formValidate')
        }
      },
      formValidate: {
        handler(val, oldVal) {
          if (val.nation && val.nation.length == 0) {
            this.showNationfalse = false
          }
          if (val.weChatId && val.weChatId.length == 0) {
            this.showWXfalse = false
          }
        },
        deep: true
      }
    },
    methods: {
      clearForm(name) {
        this.$refs[name].resetFields();
        this.formValidate.name = '',
        this.formValidate.telephoneNum = '' // telephoneNum
        this.formValidate.telephoneNumAttribution = '' // Address
        this.zjList[0] = {
          value: 'identity',
          label: '身份证'
        }
        this.showIDfalse = false
        this.showWXfalse = false
        this.showNameFalse = false
        this.showNationfalse = false
        this.showPhoneFalse = false
        this.saveBtnFlag = true
        this.formValidate.identityType = ''
        this.formValidate.identityNo = '' //51102418800505004
        this.formValidate.year = new Date().getFullYear()
        this.monthList[0] = '01'
        this.formValidate.month = ''
        this.dateList[0] = '01'
        this.formValidate.date = ''
        this.formValidate.gender = ''
        this.formValidate.nation = '汉族'
        this.formValidate.address = ''
        this.formValidate.weChatId = ''
        this.formValidate.remarks = ''
      },
      addAndEidt(type, flag, row) {
        if (type == 'add') {
          this.pannelType = '添加客户'
          this.addUserModal = true
        } else {
          this.pannelType = '编辑客户信息'
        }
        if (flag) {
          this.currentId = row.id
          // 编辑前获取内容
          hotelUserApiSercers.lookForClinent({ id: row.id }).then((res) => {
            if (res.code == '000000' && res.content) {
              if (res.content.birthday) {
                res.content.birthday = formatStampYMD(Number(res.content.birthday))
                res.content.year = res.content.birthday.substr(0, 4)
                // this.monthList[0] = res.content.birthday.substring(5, 7)
                res.content.month = res.content.birthday.substring(5, 7)
                this.dateList = this.createDate((new Date()).getFullYear(), (new Date()).getMonth() + 1)
                res.content.date = res.content.birthday.substr(8, 10)
               
              } else {
                  this.formValidate.year = ''
                  this.formValidate.month = ''
                  this.monthList[0] = '01'
                  this.dateList[0] = '01'
                  this.formValidate.date = ''
              }
              //   this.formValidate.gender = this.formValidate.identityNo.substr(16, 1) % 2 ? 'man' : 'woman'
              this.addUserModal = true
              this.formValidate = res.content
            }
          })
        }
      },
      saveBtn() {
        if (!this.formValidate.name || !this.formValidate.telephoneNum) {
          this.$Message.warning('姓名和电话为必填项')
          this.saveBtnFlag = false
          return
        } else {
          this.saveBtnFlag = true
        }
        let obj = this.savePub()
        if (this.saveBtnFlag) {
          hotelUserApiSercers.addClinent(obj).then((res) => {
            if (res.code == '000000') {
              this.$parent.curPageNum(1, true)
              this.addUserModal = false
              this.$Message.success('保存成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        }
        
      },
      editSaveBtn() {
        if (!this.formValidate.name) {
          this.saveBtnFlag = false
        } else {
          this.saveBtnFlag = true
        }
        let obj = this.savePub()
        obj.id = this.currentId
        if (this.saveBtnFlag) {
          hotelUserApiSercers.editClinent(obj).then((res) => {
            if (res.code == '000000') {
              this.$parent.curPageNum(1, true)
              this.addUserModal = false
              this.$Message.success('编辑成功')
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      },
      savePub() {
        if (this.showPhoneFalse || this.showIDfalse) {
          this.saveBtnFlag = false
        } 
        if (this.formValidate.nation && this.showNationfalse) {
          this.saveBtnFlag = false
        } 
        if (this.formValidate.weChatId && this.showWXfalse) {
          this.saveBtnFlag = false
        }  
        let obj = {}
        if (this.formValidate.identityType && this.formValidate.identityNo) {
          obj.identityType = this.formValidate.identityType
          obj.identityNo = this.formValidate.identityNo
        } else {
          if (this.formValidate.identityNo && !this.formValidate.identityType) {
            this.$Message.warning('请输入相应的证件类型')
            this.saveBtnFlag = false
            return
          } 
          if (this.formValidate.identityType && !this.formValidate.identityNo) {
            this.$Message.warning('请输入相应的证件号')
            this.saveBtnFlag = false
            return
          } 
        }

        for (let key in this.formValidate) {
          if (key == 'year' || key == 'month' || key == 'date' || key == 'identityNo' || key == 'identityType') {
            continue
          } else {
            if (this.formValidate[key]) {
              obj[key] = this.formValidate[key]
            }
          }
        }

        if (this.formValidate.year.length && this.formValidate.month.length && this.formValidate.date.length) {
          obj.birthday = `${this.formValidate.year}-${this.formValidate.month}-${this.formValidate.date}`
        } else {
          if (this.formValidate.year.length || this.formValidate.month.length || this.formValidate.date.length) {
            this.$Message.warning('出生年月日需同时选择')
            this.saveBtnFlag = false
            return
          }  
        }
        return obj
      },
      // 是否有值
      valFunc(key, val) {
        if (this.formValidate[key].length) {
          return obj[val] = this.formValidate[key]
        }
      },

       //姓名验证
      validName(val) {
        let reg = validateRule.hotelUserName
        if (!reg.test(val)) {
          this.showNameFalse = true
          this.saveBtnFlag = false
        } else {
          this.showNameFalse = false
        }
      },
      //手机号验证
      validPhone(val) {
        let reg = val.replace(/[^0-9\-\s]/g, '')
        this.formValidate.telephoneNum = reg
        if (!reg) {
          this.showPhoneFalse = true
          this.saveBtnFlag = false
        } else {
          this.showPhoneFalse = false
        }
      },
      // 失焦身份验证
      validId() {
        if (this.formValidate.identityNo) {
          let reg = validateRule.idCard
          if (this.formValidate.identityType == 'identity' && this.formValidate.identityNo.length && !reg.test(this.formValidate.identityNo)) {
            this.showIDfalse = true
          } else {
            if (this.formValidate.identityType == 'identity') {
              this.formValidate.year = this.formValidate.identityNo.substr(6, 4)
              this.formValidate.month = this.formValidate.identityNo.substr(10, 2)

              // this.dateList[0] = this.formValidate.identityNo.substr(12, 2)
              this.formValidate.date = this.formValidate.identityNo.substr(12, 2)

              this.formValidate.gender = this.formValidate.identityNo.substr(16, 1) % 2 ? 'man' : 'woman'
            }
            this.showIDfalse = false
          }
        }


      },
      chooseCard(card) {
        this.validId()

        this.formValidate.identityType = card
        this.formValidate.identityNo = ''
        // if (this.formValidate.identityNo == '' && this.formValidate.identityType != '') {
        //   this.formValidate.identityType = ''
        // }
      },
      chooseSex(gender) {
        this.formValidate.gender = gender
      },
      //年选择
      chooseYear(year) {
        this.formValidate.year = year
        let m = this.formValidate.month || (new Date()).getMonth()
        this.dateList = this.createDate(year, m)
      },
      //月选择
      chooseMonth(month) {
        this.formValidate.month = month
        let y = this.formValidate.year || (new Date()).getFullYear()
        this.dateList = this.createDate(y, month)
        // console.log('dateList', this.dateList)
      },
      //日选择
      chooseDate(date) {
        this.formValidate.date = date
      },
      createYear() {
        let y = (new Date()).getFullYear()
        let min = y - 150
        let arr = []
        let str = ""

        for (let i = y; i > min; i--) {
          arr.push(i + str)
        }
        return arr
      },
      createDate(y, month) {
        // 页面初始化的时候需要
        if (typeof month == 'number') {
          if (month < 10) {
            month = "0" + month
          } else {
            month = "" + month
          }
        }
        let ynum = Number(y)
        let dArr = []
        switch (month) {
          case '01':
          case '03':
          case '05':
          case '07':
          case '08':
          case '10':
          case '12':
            dArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
            break
          case '04':
          case '06':
          case '09':
          case '11':
            dArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
            break
          case '02': prYear()
            break
          default: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
            break
        }
        function prYear() {
          if ((ynum % 4 == 0 && ynum % 100 != 0) || (ynum % 400 == 0)) {
            dArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29']
          } else {
            dArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28']
          }
        }
        return dArr
      },
      
      // 微信校验
      checkWX() {
        let val = this.formValidate.weChatId
        if (val && !validateRule.wx.test(val)) {
          this.showWXfalse = true
        } else {
          this.showWXfalse = false
        }
      },
      // 民族校验
      checkNation() {
        let val = this.formValidate.nation
        if (val && !validateRule.nation.test(val)) {
          this.showNationfalse = true
        } else {
          this.showNationfalse = false
        }
      },

    }
  }
</script>
<style lang="scss">
  .add-user-modal {
    .ivu-form-item-error .ivu-input {
      border: 1px solid #dcdee2;
    }
    .ivu-form-item-error .ivu-input:focus {
      border: 1px solid #4b7ba6;
      box-shadow: 0 0 0 2px rgba(30, 90, 144, 0.2);
      outline: 0;
    }
    font-family: 'PingFangSC-Regular';

    .title {

      font-size: 16px;
      font-weight: 400;
      color: rgba(33, 93, 145, 1);
      line-height: 22px;
    }

    .save-btn {
      margin: 20px auto;
      width: 110px;
      height: 36px;
      font-size: 14px;
      line-height: 36px;
      text-align: center;
      font-family: 'MicrosoftYaHei';
      color: rgba(255, 255, 255, 1);
      background: linear-gradient(270deg, rgba(153, 200, 135, 1) 0%, rgba(79, 152, 55, 1) 100%);
      box-shadow: 2px 2px 8px 0px rgba(169, 242, 156, 0.45);
      border-radius: 17px;
      cursor: pointer;
    }
  }
</style>