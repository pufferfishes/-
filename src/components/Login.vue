<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="userpass">
          <el-input v-model="loginForm.userpass" type="password" autocomplete="off">
            <i slot="prefix" class="el-input__icon iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        userpass: '123456'
      },
      loginFormRules: {
        username: [
          // {固定规则， 错误提示信息， 触发机制}
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userpass: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 管理员登录系统
    login () {
      // 表单校验没有问题时再进行跳转
      this.$refs.loginFormRef.validate(async valid => {
        // valid: 校验成功/失败 的标志, true:成功 false:失败
        if (valid === true) {
          // 判断valid为true还是为false 如果为真就跳转到后台页面，如果为假就不跳转
          // 账户真实性校验（用户名，密码校验）
          const { data: dt } = await this.$http.post('/login', { username: this.loginForm.username, password: this.loginForm.userpass })
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // return this.$message.success(dt.meta.msg)
          // 通过dt把服务器端返回的token在sessionStorage里边保存好
          window.sessionStorage.setItem('token', dt.data.token)
          // 编程式导航 到达后台首页面
          this.$router.push('/home')
        }
      })
    },
    // 重置系统
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
    overflow: hidden;

    .login-box {
      width: 450px;
      height: 304px;
      background-color: #fff;
      border-radius: 4px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .el-form {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 20px;
        box-sizing: border-box;
      }

      .avatar-box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 8px;
        box-shadow: 0 0 10px #eee;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
  }
</style>
