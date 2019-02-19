<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- input框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdy.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="role_name" label="职位" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg-state" label="状态" width="70">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUser(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="修改职位" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdy.pagenum"
        :page-sizes="[3, 8, 10, 20]"
        :page-size="querycdy.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdy.tot"
      ></el-pagination>
      <!-- 添加用户的对话框
      -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户信息 -->
      <el-dialog
        title="添加用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edituser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期
  created() {
    this.getUserInfos()
  },
  methods: {
        // 修改用户1
        editDialogClose() {
          this.$refs.editFormRef.resetFields()
        },
        // 修改用户
        edituser() {
          //  校验表单
          this.$refs.editFormRef.validate(async valid=>{
            if(valid){
              // 校验成功处理
              const {data:res}=await this.$http.put('users/'+this.editForm.id,
              this.editForm)
                 if(res.meta.status!==200){
                   return this.$message.error(res.meta.msg)
                 }         
                //  修改成功 关闭对话框 成功提示 页面更新
                this.editDialogVisible=false
                this.$message.success(res.meta.msg)
                this.getUserInfos()  
            }

          })
        },
    //  修改用户2
    async showUser(id) {
      // 显示对话框
      this.editDialogVisible = true
      // 根据ID获取被修改的用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //  把获取的数据 赋予给 editForm
      this.editForm = res.data
    },
    //  删除用户
    delUser(id) {
      this.$confirm('是否删除该用户？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //  删除操作,使用axios调用api删除
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功，刷新消息，刷新数据
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },
    // 收集数据库信息
    adduser() {
      // 先校验form表单
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 如果成功
          const { data: res } = await this.$http.post('users', this.addForm)

          // 添加失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          //  添加成功，关闭对话框，成功提示 显示新添加的用户
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 添加用户，form表单重置
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  修改以后状态的方法
    async changeState(uid, state) {
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status)
      }
      this.$message.success(res.meta.msg)
    },
    //  数据分页相关
    // 每条记录条数变化的回调处理
    handleSizeChange(age) {
      // age 记录变化后的条数
      this.querycdy.pagesize = age
      // 从新获取数据
      this.getUserInfos()
    },
    // 记录当前页码变化的回调
    handleCurrentChange(age) {
      // age 记录裱花后的当前页码
      this.querycdy.pagenum = age
      //  重新获取数据
      this.getUserInfos()
    },
    //  获取真实用户列表数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.querycdy
      })
      // console.log(res)
      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //  获取总条数
      this.querycdy.tot = res.data.total
      // 把获取好的用户数据赋予给userInfos成员
      this.userInfos = res.data.users
    }
  },
  data() {
    //  表单验证
    var checkMobile = (rule, value, callback) => {
      //自定义正则表达式
      // 失败
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机格式不正确，请重新输入'))
      }
      // 成功
      callback()
    }
    return {
      //  修改用户1
      editDialogVisible: false,
      //form表单需要的数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户2
      editFormRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          //自定义规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //添加用户
      addDialogVisible: false,
      //form表单需要的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户2
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          //自定义规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //  关键字
      keywords: '',
      //  用户数据
      userInfos: [],
      // 给用户设置查询条件
      querycdy: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 3,
        tot: 0
      }
      // 表格小demo
      // tableData: [
      //   {
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '2016-05-04',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   },
      //   {
      //     date: '2016-05-01',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   },
      //   {
      //     date: '2016-05-03',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   }
      // ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
