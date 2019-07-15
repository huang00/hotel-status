<template>
	<div class='account'>
		<!-- 顶部 -->
		<div class="account-top">
			<span class="backList" @click="accountType = 'list'" v-if="accountType != 'list'"><Icon type="ios-arrow-back"/>我的账号</span>
			<img src="../../../common_assets/imgs/myAccountIcon.png" alt="" class="icon">
			<p> {{returnTitle()}}</p>
		</div>
		<div class="account-content">

			<!-- 账号详细 -->
			<div class="account-list" v-if="accountType == 'list'">
				<p>登录账号： <span>{{userInfo.username}}</span> </p>
				<p>手机号码： <span>{{getCookie('phoneNum')}}</span> <Button type="primary" shape="circle" @click="showChangePhone" class="next-step">修改手机号</Button></p>
				<p>登录密码： <span>***********</span> <Button type="primary" shape="circle" @click="showChangePassword"  class="next-step">修改密码</Button></p>
			</div>

			<!-- 修改手机号第一步 -->
			<Form ref="editPhoneFormFir" :model="phoneFirForm" :rules="ruleValidate" :label-width="100" class="editPhoneFormFir form-err" v-if="accountType == 'changePhoneFir'">
				<FormItem label="原号码" class="oldPhone">
					<span>{{phoneFirForm.oldPhone}}</span>
				</FormItem>
				<FormItem label="图形验证码" prop="codeImgFir">
					<Input type="text" placeholder="请输入图形验证码" :maxlength="20" v-model="phoneFirForm.codeImgFir" style="width:200px"></Input>
					<img class="verificationCode" @click="getVerifyCode" :src='codeImgFirSrc'>
					<span class="changeCodeText" @click="getVerifyCode">换一张</span>
				</FormItem>
				<FormItem label="短信验证码" prop="codeFir">
					<Input type="text" placeholder="请输入短信验证码" :maxlength="20" v-model="phoneFirForm.codeFir" style="width:200px"></Input>
					<Button type="primary" shape="circle" class="next-step get-code" @click="getCode(1)" v-show="!getCodeFiring">发送验证码</Button>
					<Button type="primary" shape="circle" class="time-button" v-show="getCodeFiring" disabled>{{timeNumFir}}s后重新发送</Button>
				</FormItem>
			</Form>

			<!-- 修改手机号第二步 -->
			<Form ref="editPhoneFormSec" :model="phoneSecForm" :rules="ruleValidate" :label-width="100" class="editPhoneFormSec form-err" v-if="accountType == 'changePhoneSec'">
				<FormItem label="新号码" prop="newPhone" style="display:none">
					<Input type="text" placeholder="请输入新的手机号码" :maxlength="11" v-model="phoneSecForm.newPhone" style="width:333px"></Input>
				</FormItem>
				<FormItem label="新号码" prop="newPhone">
					<Input type="text" placeholder="请输入新的手机号码" 
						@on-keyup="validatePhoneNumber(phoneSecForm, 'newPhone')"
						@on-blur="validatePhoneNumber(phoneSecForm, 'newPhone')"
						:maxlength="11" v-model="phoneSecForm.newPhone" style="width:333px"></Input>
				</FormItem>
				<FormItem label="图形验证码" prop="codeImgSec">
					<Input type="text" placeholder="请输入图形验证码" :maxlength="20" v-model="phoneSecForm.codeImgSec" style="width:200px"></Input>
					<img class="verificationCode" @click="getVerifyCode" :src='codeImgFirSrc'>
					<span class="changeCodeText" @click="getVerifyCode">换一张</span>
				</FormItem>
				<FormItem label="短信验证码" prop="codeSec">
					<Input type="text" placeholder="请输入验证码" :maxlength="20" v-model="phoneSecForm.codeSec" style="width:200px"></Input>
					<Button type="primary" shape="circle" class="next-step get-code" @click="getCode(2)" v-show="!getCodeSecing" >发送验证码</Button>
					<Button type="primary" shape="circle" class="time-button" v-show="getCodeSecing" disabled>{{timeNumSec}}s后重新发送</Button>
				</FormItem>
			</Form>

			<!-- 修改密码 -->
			<Form ref="editPassForm" :model="passwordForm" :rules="ruleValidate" :label-width="100" class="editPassForm form-err" v-if="accountType == 'changePassword'">
				<FormItem label="原始密码" prop="oldPasswd">
					<Input type="password" placeholder="请输入原密码" :maxlength="20" v-model="passwordForm.oldPasswd"></Input>
				</FormItem>
				<FormItem label="新密码" prop="password">
					<Input type="password" placeholder="请输入新的密码" :maxlength="20" v-model="passwordForm.password"></Input>
				</FormItem>
				<FormItem label="确认密码" prop="passwdCheck">
					<Input type="password" placeholder="请输入新的密码" :maxlength="20" v-model="passwordForm.passwdCheck"></Input>
				</FormItem>
			</Form>

			<!-- 按钮 -->
			<div class="button-list">
				<Button type="primary" class="submit" shape="circle" @click="submitChangePassword"  v-show="accountType == 'changePassword'">保存</Button>
				<Button type="primary" class="next-step" shape="circle" v-show="accountType == 'changePhoneFir'" @click="nextStep">下一步</Button>
				<Button type="primary" class="submit submit-phone" shape="circle" v-show="accountType == 'changePhoneSec'" @click="submitChangePhone">保存</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import {getCookie,setCookie} from '../../../common_libs/util.js'
	import { headerServers,publicHttpServer } from 'api/api'
	import $ from 'jquery'
	
	export default {
		name:'Serach',
		props: ['searchList'],
		data () {
			return {
				getCookie,
				// 我的账号
                accountType: 'list',

                // 密码
                accountModal:false,
                passwordForm: {
                    password: '',
                    passwdCheck: '',
                    oldPasswd: ''
                },
                ruleValidate: {
                    oldPasswd: [
                        {required: true, message: '原始密码不能为空', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                        { validator: this.validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: this.validatePassCheck, trigger: 'blur' }
                    ],
                    oldPhone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                    ],
                    codeFir: [
                        { required: true, message: '短信验证码不能为空', trigger: 'blur' },
					],
					codeImgFir: [
                        { required: true, message: '图形验证码不能为空', trigger: 'blur' },
					],
					newPhone: [
						{ required: true, message: '新手机号不能为空', trigger: 'blur' },
                    	{ type: 'string', min: 11, message: '输入正确的11位手机号码', trigger: 'blur' }
                    ],
					codeImgSec: [
                        { required: true, message: '图形验证码不能为空', trigger: 'blur' },
					],
                    codeSec: [
                        { required: true, message: '短信验证码不能为空', trigger: 'blur' },
                    ]
                },

                phoneFirForm: {
					oldPhone: getCookie('phoneNum'),
					codeImgFir:'',
                    codeFir: ''
                },
                phoneSecForm: {
					newPhone: 18782468140,
					codeImgSec:'',
                    codeSec: ''
				},

				codeTextFir:'发送验证码',
				codeTextSec:'发送验证码',
				getCodeFiring:false,
				getCodeSecing:false,
				timeNumFir: 59,
				timeNumSec: 59,
				timerFir:null,
				timerSec:null,

				codeImgFirSrc: '',
				index:1
			}
		},
		computed: {
			userInfo () {
				let userInfo = this.$store.getters.userInfo
				return userInfo
			}
		},
		methods: {
			validatePhoneNumber (item, fieldName, callback) {
				if(item[fieldName][0] != 1){
					item[fieldName] = ''
				}
				item[fieldName] = item[fieldName].replace(/[^\d+$]/g, '')
				callback && callback(item)
			},
            // 返回模态框title
            returnTitle() {
                let type = this.accountType
                switch(type) {
                    case 'list':
                        return '我的账号'
						break
						
                    case 'changePassword':
						return '修改密码'
                        break

					case 'changePhoneFir':
						return '修改手机号'
                        break

					case 'changePhoneSec':
						return '修改手机号'
						break
					
					default:
						return '我的账号'
						break;
                }
            },

            // 打开密码修改
            showChangePassword() {
                this.passwordForm={
                    password: '',
                    passwdCheck: '',
                    oldPasswd: ''
                }
                this.accountType = 'changePassword'
            },
            validatePass (rule, value, callback) {
                let len = value.length
                if (/\s/.test(value)) {
                    callback(new Error('密码格式错误'))
                } else if (len < 6 || len > 16) {
                    callback(new Error('密码长度为6~16位'))
                } else {
                    callback()
                }
            },
            validatePassCheck (rule, value, callback) {
                if (value !== this.passwordForm.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            },
            // 提交修改密码
            submitChangePassword(){
                this.$refs['editPassForm'].validate((valid) => {
                    if (valid) {
                        headerServers.updateOldPassword({
                            password: this.passwordForm.oldPasswd,
                            newPassword: this.passwordForm.password,
                            confirmNewPassword: this.passwordForm.passwdCheck,
                            uid: getCookie('userId')
                        }).then(result => {
                            if (result.code === '000000') {
                                this.accountModal = false
                                this.$Message.success('修改成功,退出重新登录！')
                                setTimeout( () => {
                                    this.out()
                                },500)
                            } else {
                                alert(result.message)
                            }
                        })
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

            // 打开修改手机号第一步
            showChangePhone() {
                this.phoneFirForm = {
					oldPhone: getCookie('phoneNum'),
					codeImgFir:'',
                    codeFir: ''
                }
                this.phoneSecForm =  {
					newPhone: '',
					codeImgSec:'',
                    codeSec: ''
				}
				let data = {
					index : 1
				}
				this.getVerifyCode()
				// publicHttpServer.securityCode().then( result => {
				// 	console.log(result)
				// 	// let a = window.URL.createObjectURL(new Blob([result],{type: "image/jpeg"}))
				// 	// let img = document.createElement('img');
				// 	// let binaryData = [];
				// 	// binaryData.push(result);
				// 	// console.log(binaryData)
				// 	// img.src = window.URL.createObjectURL(new Blob(binaryData, {type: "image/jpeg"}));
				// 	// img.onload = function() {
				// 	// 	window.URL.revokeObjectURL(this.src);
				// 	// }
				// 	// $('.account')[0].appendChild(img);
				// 	// this.codeImgFirSrc = result
				// 	// console.log(result)
				// })
                this.accountType = "changePhoneFir"
			},
			
            // 下一步
            nextStep() {
				// this.accountType = "changePhoneSec"
				// return
				this.$refs['editPhoneFormFir'].validate((valid) => {
					if (valid) {
						let data = {
							phone: this.phoneFirForm.oldPhone,
							vcode: this.phoneFirForm.codeFir,
							imgCode: this.phoneFirForm.codeImgFir,
							codeToken: getCookie('codeToken'),
						}
						publicHttpServer.updatePhoneCheckCode(data).then( result => {
							if(result.code == '000000'){
								this.accountType = "changePhoneSec"
								this.timeNumFir = 60
								this.getCodeFiring = false

								this.timeNumSec = 60
								this.getCodeSecing = false
								if(this.timerFir){
									clearTimeout(this.timerFir)
								}

								if(this.timerSec){
									clearTimeout(this.timerSec)
								}
								this.getVerifyCode()
							}else{
								alert(result.message)
							}
						})
					} else {
						// this.$Message.error('表单验证失败!');
						console.log('表单验证失败')
					}
				})
			},
			
			// 获取验证码
			getCode(type) {
				let data
				this.getCodeSecing = false
				this.getCodeFiring = false
				if(type == 1){
					data = {
						phone : this.phoneFirForm.oldPhone,
						vcode : this.phoneFirForm.codeImgFir,
						codeToken : getCookie('codeToken'),
						ac:'edit_old_phone'
					}
					publicHttpServer.sendMessToken(data).then( result => {
						if(result.code == '000000'){
							this.getCodeFiring = true
							this.countDown(1)
						}else{
							this.getVerifyCode()
							alert(result.message)
						}
					})
				}else{
					data = { 
						phone : this.phoneSecForm.newPhone,
						vcode : this.phoneSecForm.codeImgSec,
						codeToken : getCookie('codeToken'),
						ac:'edit_new_phone'
					}
					publicHttpServer.sendMessToken(data).then( result => {
						if(result.code == '000000'){
							this.getCodeSecing = true
							this.countDown(2)
						}else{
							this.getVerifyCode()
							alert(result.message)
						}
					})
				}

			},

			// 倒计时
			countDown(type) {
				if(type == 1){
					this.timerFir = setTimeout( () => {
						if(this.timeNumFir > 1){
							this.timeNumFir--
							if(this.timeNumFir > 0){
								this.countDown(1)
							}
						}else{
							this.timeNumFir = 60
							this.getCodeFiring = false
							console.log('test1')
							this.getVerifyCode()
						}
					},1000)
				}else{
					this.timerSec = setTimeout( () => {
						if(this.timeNumSec > 0){
							this.timeNumSec--
							if(this.timeNumSec > 0){
								this.countDown(2)
							}
						}else{
							this.timeNumSec = 60
							this.getCodeSecing = false
							console.log('test2')
							this.getVerifyCode()
						}
					},1000)
				}
				
			},

			// 提交修改手机号
			submitChangePhone(){
				// let data = {
				// 	test: '2222'
				// }
				// this.$Message.success('修改成功！')
				// this.accountType = "list"
               	// this.$emit('on-success', data)
				// return
				this.$refs['editPhoneFormSec'].validate((valid) => {
					if (valid) {
						let data = {
							phone: this.phoneSecForm.newPhone,
							vcode: this.phoneSecForm.codeSec,
							imgCode: this.phoneSecForm.codeImgSec,
							codeToken: getCookie('codeToken'),
						}
						publicHttpServer.updatePhone(data).then( result => {
							if(result.code == '000000'){
								this.$Message.success('修改成功！')
								// this.getBaseInfo()
								setCookie('phoneNum',data.phone)
                        		window.location.reload()
								// this.accountType = "list"
                        		// this.$emit('on-success', data)
							}else{
								alert(result.message)
							}
						})
					} else {
						// this.$Message.error('表单验证失败!');
						console.log('表单验证失败')
					}
				})
			},

			getBaseInfo () {
				innRoomTypeApiServers.getBaseInfo({token: getCookie('token')}).then(result => {
					if (result.code === '000000') {
						console.log('获取用户信息')
					}
				})
			},

			// 获取图形验证码
			getVerifyCode() {
				let index = new Date().valueOf()
				// this.index++;
				// console.log(this.index)
				// this.codeImgFirSrc = `http://192.168.0.222/user/common/securityCode?index=${index}`;
				this.codeImgFirSrc = `/user/common/securityCode?index=${index}`;
			},
		}
	}
</script>

<style lang='scss'>
	.account{
		.account-top{
			width:590px;
			height:242px;
			background:url('../../../common_assets/imgs/myAccountBg.png') no-repeat white center center;
			text-align: center;
			.backList{
				cursor: pointer;
				position:absolute;
				top:2px;
				left:6px;
				height:30px;
				line-height:30px;
				font-size:14px;
				color:#215D91FF;
				i{
					color: #1F5A8EFF;
					font-size: 18px;
					margin-right:4px;
					margin-top:-2px;
				}
			}
			.icon{
				margin-top:39px;
			}
			p{
				color: #215D91FF;
				font-size: 16px;
				margin-top:10px;
			}
		}
		
		.account-content{
			.account-list{
				width:320px;
				margin:0 auto;
				p{
					margin-top:32px;
					font-size: 14px;
					// height: 50px;
					// line-height: 50px;
					span{
						vertical-align: middle
					}
					button{
						float: right;
						width: 110px;
						font-size: 14px;
						color: #FFFFFF;
						margin-top: -7px
					}
				}
			};
			.editPassForm{
				width:400px;
				margin:0 auto;
				margin-top: 20px;
			}

			.time-button{
				cursor: not-allowed;
				margin-left: 20px;
				background: #ccc;
				box-shadow: none;
				color: #Ffff;
				padding: 0;
			}
			.editPhoneFormFir{
				width: 500px;
				margin: 0 auto;
				margin-top: 10px;
				.oldPhone{
					label{
						padding-right: 17px !important;  
					}
					label::after{
						content: "*";
						display: inline-block;
						margin-left: 4px;
						line-height: 1;
						font-family: "SimSun";
						font-size: 12px;
						color: #ed4014;
					}
				}
				.get-code{
					margin-left: 20px;
					margin-top: 0px;
				}
				
			}
			.editPhoneFormSec{
				width: 500px;
				margin: 0 auto;
				margin-top: 10px;
				.get-code{
					margin-left: 20px;
					margin-top: 0px;
				}
			}
			.button-list{
				text-align: center;
			}
			button{
				border: 0;
				cursor: pointer;
				outline: none;
				width: 110px;
				height: 32px;
				border-radius: 17px;
				font-size: 14px;
				&.submit{
					background: linear-gradient(270deg,rgba(153,200,135,1) 0%,rgba(79,152,55,1) 100%);
					box-shadow:2px 2px 8px 0px rgba(169,242,156,0.45);
				}
				&.submit-phone{
					margin-top: 10px;
				}
				&.next-step{
					background: linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
					box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
					margin-top: 10px;
				}
			}
		}
		.verificationCode{
			vertical-align:middle;
			margin-left:20px;
			width: 110px;
			height: 30px;
		}
		.changeCodeText{
			cursor:pointer;
			color:#205C90;
			text-decoration:underline;
			user-select:none
		}
	}  

</style>


