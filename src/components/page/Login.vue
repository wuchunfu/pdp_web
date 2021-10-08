<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">pdp</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="30px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="param.account" placeholder="account" style="width:300px;">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="password"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()"
                            style="width:300px;"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="param.code" placeholder="请输入验证码" class="login-code" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-qrcode"></el-button>
                    </el-input>
                    <img :src="codeImg" class="login-code-img" @click="updateCodeImg()" alt="点击刷新"/>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码 admin/123456</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login} from '../../api/login';
    import request from '../../utils/request';
    import md5 from 'js-md5';

    export default {
        data: function () {
            return {
                param: {
                    account: 'admin',
                    password: '123456',
                    code: '',
                    pCode: '',
                },
                codeImg: '',
                rules: {
                    account: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
                },
            };
        },
        mounted() {
            this.updateCodeImg();
        },
        methods: {
            submitForm() {
                let reqData = {
                    account: this.param.account,
                    password: md5(this.param.password),
                    pCode: this.param.pCode,
                    code: this.param.code
                };
                login(reqData).then(res => {
                    if (res.code === '200') {
                        this.$message.success('登录成功');
                        localStorage.setItem('ms_username', res.data.userEntity.userName);
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('time', res.data.time);
                        localStorage.setItem('address', res.data.address);
                        localStorage.setItem('userEntity', JSON.stringify(res.data.userEntity));
                        localStorage.setItem('roleEntities', JSON.stringify(res.data.roleEntities));
                        localStorage.setItem('authEntityDTOS', JSON.stringify(res.data.authEntityDTOS));
                        localStorage.setItem('buttonMap', JSON.stringify(res.data.buttonMap));
                        this.$router.push('/');
                    } else {
                        this.param.pCode = Math.ceil(Math.random() * 10000 + 1000);
                        this.codeImg = request.baseUrl + "/login/createImg?pCode=" + this.param.pCode;
                        this.$message.error(res.msg);
                        return false;
                    }
                }).catch((res)=>{
                    console.log("异常:"+res)
                });
            },
            updateCodeImg() {
                this.param.pCode = Math.ceil(Math.random() * 10000 + 1000);
                this.codeImg = request.baseUrl + "/login/createImg?pCode=" + this.param.pCode;
            }
        },
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 43%;
        top: 45%;
        width: 600px;
        height: 450px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 100px 100px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 85%;
        height: 40px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 100px;
        color: #fff;
    }

    .login-code {
        width: 60%;
        float: left;
    }

    .login-code-img {
        margin-left: 5px;
        border-radius: 4px;
        width: 20%;
        height: 30px;
    }
</style>