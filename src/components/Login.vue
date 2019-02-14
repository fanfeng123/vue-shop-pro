<template>
  <div id="login-content">
    <div id="login-box">
      <div id="logo-tu">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form :rules="loginFormRules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-username-blue"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-password"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="14">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="chongzhi">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      //    登录校验
      this.$refs.loginFormRef.validate(async vali => {
        if (vali == true) {
          //    用户信息的真实性校验
          // axios带着用户的信息，去后端数据库校验
          const {data: res} = await this.$http.post('./login', this.loginForm)

          //    接着判断用户名或密码  真实性的校验失败
          if (res.meta.status !== 200) {
            // 不等于200 说明错误
            return this.$message.error('用户名或者密码不存在')
          }
          //   通过浏览器的sessionStorage记录返回token信息（相当于秘钥信息）
          window.sessionStorage.setItem('token', res.data.token)
          //  校验成功  页面跳转
          this.$router.push('./home')
        }
      })
    },
    chongzhi() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-content {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 430px;
    height: 304px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #logo-tu {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
