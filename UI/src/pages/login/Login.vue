<template>
    <common-layout>
        <div class="top">
            <div class="header">
                <img alt="logo" style="height: 80px;" class="logo" src="@/assets/img/logo1.png"/>
            </div>
        </div>
        <div class="login">
            <a-form @submit="onSubmit" :form="form">
                <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
                    <a-tab-pane tab="账户密码登录" key="1">
                        <a-alert type="error" :closable="true" v-if="error" :message="error" @close='onClose' showIcon
                                 style="margin-bottom: 24px;"/>
                        <a-form-item>
                            <a-input
                                    autocomplete="autocomplete"
                                    size="large"
                                    v-decorator="['username ', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
                            >
                                <a-icon slot="prefix" type="user"/>
                            </a-input>
                        </a-form-item>
                        <a-form-item>
                            <a-input
                                    size="large"
                                    autocomplete="autocomplete"
                                    type="password"
                                    v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
                            >
                                <a-icon slot="prefix" type="lock"/>
                            </a-input>
                        </a-form-item>
                    </a-tab-pane>
                    <!-- <a-tab-pane tab="手机号登录" key="2">
                      <a-form-item>
                        <a-input size="large" placeholder="mobile number" >
                          <a-icon slot="prefix" type="mobile" />
                        </a-input>
                      </a-form-item>
                      <a-form-item>
                        <a-row :gutter="8" style="margin: 0 -4px">
                          <a-col :span="16">
                            <a-input size="large" placeholder="captcha">
                              <a-icon slot="prefix" type="mail" />
                            </a-input>
                          </a-col>
                          <a-col :span="8" style="padding-left: 4px">
                            <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                          </a-col>
                        </a-row>
                      </a-form-item>
                    </a-tab-pane> -->
                </a-tabs>
                <!-- <div>
                  <a-checkbox :checked="true" >自动登录</a-checkbox>
                </div> -->
                <a-form-item>
                    <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit"
                              type="primary">登录
                    </a-button>
                </a-form-item>
                <!-- <div>
                  其他登录方式
                  <a-icon class="icon" type="alipay-circle" />
                  <a-icon class="icon" type="taobao-circle" />
                  <a-icon class="icon" type="weibo-circle" />
                  <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
                </div> -->
            </a-form>
        </div>
    </common-layout>
</template>

<script>
    import CommonLayout from '@/layouts/CommonLayout'
    // import {login, getRoutesConfig} from '@/services/user'
    import {login} from '@/services/user'
    import {setAuthorization} from '@/utils/request'
    import {loadRoutes} from '@/utils/routerUtil'
    import {mapMutations} from 'vuex'
    import {GetRoleMenu} from '@/services/personnelmanagement'

    export default {
        username: 'Login',
        components: {CommonLayout},
        data() {
            return {
                logging: false,
                error: '',
                form: this.$form.createForm(this),
                operationoptions: [{id: 1, operate:'新增'}, {id: 2, operate:'修改'},{id: 3, operate:'查看'},{id: 4, operate:'删除'}],
            }
        },
        methods: {
            ...mapMutations('account', ['setUser', 'setRoles']),
            onSubmit(e) {
                e.preventDefault()
                this.form.validateFields((err) => {
                    if (!err) {
                        this.logging = true
                        const username = this.form.getFieldValue('username ')
                        const password = this.form.getFieldValue('password')
                        login(username, password).then(this.afterLogin)
                    }
                })
            },
            afterLogin(res) {
                this.logging = false
                const loginRes = res.data
                console.log(loginRes);
                localStorage.id = res.data.user.id
                localStorage.department_id = loginRes.department_id
                localStorage.name = res.data.user.name
                localStorage.account = res.data.user.account
                if (loginRes.access_token) {
                    this.setUser(loginRes.user)
                    const roles = [{
                        id: '',        //角色ID
                        operation: []  //角色的操作权限
                    }]
                    roles[0].id = loginRes.role_id
                    this.operationoptions.forEach(e => {
                        loginRes.permission_list.forEach(i => {
                            if (e.id === i) {
                                roles[0].operation.push(e.operate)
                                return
                            }
                        })
                    })
                    // const {user, permissions, roles} = loginRes.data
                    // this.setUser(user)
                    // this.setPermissions(permissions)
                    this.setRoles(roles)
                    // setAuthorization({token: loginRes.access_token, expireAt: new Date(loginRes.data.expireAt)})
                    setAuthorization({token: loginRes.access_token})
                    this.$message.success("欢迎回来！", 3)
                    // 获取路由配置
                    GetRoleMenu().then(result => {
                      console.log(result.data.data);
                      const routesConfig = [{
                          router: 'rootrout',
                          children: [{ router: 'dashboard' }, { router: 'personaldata' }]
                      }]
                      result.data.data.forEach(e => {
                          const routername = {
                              router: '',
                              children: []
                          }
                          routername.router = e.path
                          e.children.forEach(i => {
                              routername.children.push(i.path)
                          })
                          routesConfig[0].children.push(routername)
                      })
                      loadRoutes(routesConfig)
                      this.$router.push('/dashboard')
                    })
                } else {
                    this.$message.error('登陆失败！')
                    this.logging = false
                }
            },
            onClose() {
                this.error = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .common-layout {
        .top {
            text-align: center;

            .header {
                height: 44px;
                line-height: 44px;

                a {
                    text-decoration: none;
                }

                .logo {
                    height: 44px;
                    vertical-align: top;
                    margin-right: 16px;
                }

                .title {
                    font-size: 33px;
                    color: @title-color;
                    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
                    font-weight: 600;
                    position: relative;
                    top: 2px;
                }
            }

            .desc {
                font-size: 14px;
                color: @text-color-second;
                margin-top: 12px;
                margin-bottom: 40px;
            }
        }

        .login {
            width: 368px;
            margin: 0 auto;
            @media screen and (max-width: 576px) {
                width: 95%;
            }
            @media screen and (max-width: 320px) {
                .captcha-button {
                    font-size: 14px;
                }
            }

            .icon {
                font-size: 24px;
                color: @text-color-second;
                margin-left: 16px;
                vertical-align: middle;
                cursor: pointer;
                transition: color 0.3s;

                &:hover {
                    color: @primary-color;
                }
            }
        }
    }
</style>
