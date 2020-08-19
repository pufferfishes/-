<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加用户 对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%"
        @close="resetForm()">

          <el-form ref="addUserRef" :model="addUser"
          :rules="addUserRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUser.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addUser.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="addUser.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUser.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addUserDialog = false">取 消</el-button>
            <el-button type="primary" @click="tianjia()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户 对话框 -->
        <el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%"
        @close="resetEditForm()">
          <el-form ref="editUserRef" :model="editUser"
          :rules="editUserRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editUser.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="editUser.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editUser.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editUserDialog = false">取 消</el-button>
            <el-button type="primary" @click="xiugai()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 卡片区 -->
        <el-card class="box-card">
            <!-- 搜索框和添加按钮 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                    placeholder="请输入搜索内容"
                    v-model="querycdt.query"
                    class="input-with-select"
                    clearable
                    @clear="search()"
                    @keyup.enter.native="search()"
                    >
                      <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 数据列表区域 -->
            <el-table :data="userList" stripe style="width: 100%" border>
              <el-table-column type="index" label="序号" width="60">
              </el-table-column>
              <el-table-column prop="username" label="用户名">
              </el-table-column>
              <el-table-column prop="mobile" label="手机号码" width="140">
              </el-table-column>
              <el-table-column prop="role_name" label="角色" width="140"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
              <el-table-column prop="mg_state" label="状态" width="80">
                <!-- 在该处要显示多条记录的不同状态和不同的操作
                所以我们需要把每一条的用户的记录信息都获取到，然后再获取每个用户的状态 -->
                <!-- info为自定义的属性值，父组件的所有用户记录信息 row是table表格提供的一个自定义的参数还有列（column等）
                info.row代表所有的用户操作信息的每一行的操作信息 -->
                <!-- <span slot-scope="info"> {{ info.roe }}</span -->
                <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="info">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(info.row.id)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(info.row.id)"></el-button>
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="querycdt.pagenum"
            :page-sizes="[3, 5, 10, 20]"
            :page-size="3"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tot">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
  // 生命周期函数
  created () {
    this.getUserList()
  },
  methods: {
    /* 修改用户相关1 */
    // 收集数据存储
    xiugai () {
      // 表单校验
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put('users/' + this.editUser.id, this.editUser)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 修改成功（提示 关闭对话框）
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    // 关闭Dialog重置form表单
    resetEditForm () {
      this.$refs.editUserRef.resetFields()
    },
    async showEditDialog (id) {
      // 获取被修改的用户信息
      const {data: dt} = await this.$http.get('users/' + id)
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获取到的修改用户信息赋予给editUser表单数据对象
      this.editUser = dt.data
      // id: 被修改的用户信息
      // 显示修改用户的对话框
      this.editUserDialog = true
    },
    // 删除用户
    delUser (id) {
      this.$confirm('确认要删除该用户么？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 服务器端实现删除数据逻辑
        const {data: dt} = await this.$http.delete('users/' + id)
        // console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        // 删除成功
        this.$message.success(dt.meta.msg)
        // 如果当前页只有一条数据，请给页码做减一操作(前提是当前页码大于1)
        if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
          this.querycdt.pagenum--
        }
        // 刷新数据
        this.getUserList()
        // window.sessionStorage.removeItem('token',)
      }).catch(() => {
      })
    },
    /* 添加用户对话框和form表单相关1 */
    tianjia () {
      // 校验表单
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          // 获得各个表单域信息
          // 利用axios把表单域传递给后端存储
          const {data: dt} = await this.$http.post('users', this.addUser)
          // console.log(dt)
          // 添加失败处理
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 关闭Dialog 刷新数据
          this.addUserDialog = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    resetForm () {
      // 重置form表单
      this.$refs.addUserRef.resetFields()
    },
    // 数据检索
    search () {
      this.getUserList()
    },
    /* 数据分页1 */
    // 当前页码变化的处理
    handleCurrentChange (val) {
      // val变化后的当前页码
      this.querycdt.pagenum = val
      this.getUserList()
    },
    // 每页数据显示条数的处理
    handleSizeChange (val) {
      // val: 代表当前改变后每页显示的条数
      this.querycdt.pagesize = val
      // 根据变化后的每页条数重新获取数据
      this.getUserList()
    },
    /* 数据分页2 */
    // 每页数据显示条数的处理
    // 获取用户列表数据
    async getUserList () {
      const { data: dt } = await this.$http.get('/users', { params: this.querycdt })
      // console.log(dt)
      // 获取数据失败处理
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获取到的总条数赋予给tot存储
      this.tot = dt.data.total
      // 把获得到的数据传递给userList成员
      this.userList = dt.data.users
    }
  },
  data () {
    // 自定义表单校验规则
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则
      // 数字 11位 1为开头 第2位 3456789均可
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        // 校验失败
        callback(new Error('手机号码格式不正确'))
      }
      // 校验成功
      callback()
    }
    return {
      /* 修改用户相关1 */
      editUserDialog: false, // 对话框显示标志
      // 表单数据对象
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      editUserRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 添加用户相关信息
      // 表单数据对象
      addUser: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 应用自定义校验规则
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      },
      // 对话框是否显示的标志
      addUserDialog: false,
      // 数据记录总条数
      tot: 0,
      // 用户列表成员
      userList: [],
      // 获取用户列表需要的参数部分
      // 改参数在做数据 检索 和 分页 的时候都需要使用
      querycdt: {
        query: '', // 被查询的关键字[数据检索]
        pagenum: 1, // 被查询的页码,默认查询第1页数据[分页]
        pagesize: 3 // 每页需要显示的记录条数[分页]
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
