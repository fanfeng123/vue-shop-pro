<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow ? '65px' : '200px' ">
        <div class="shuxian" @click="menushow=!menushow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="menushow"
          :router="true"
        >
          <el-submenu
            :index="item.id+''"
            v-for="(item,k) in menulist"
            :key="item.id"
            :style="menushow ? 'width:65px' : 'width:200px;' "
          >
            <template slot="title">
              <i :class="'iconfont icon-'+menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //  生命周期
  created() {
    this.getMenulist()
  },
  data() {
    return {
      // 左侧按钮导航是否显示
      menushow: false,
      //接收后端传递过来的左侧权限信息
      menulist: [],
      menuicon: [
        'duoren',
        'wicon-zhong-chuang-kong-jian',
        'wodemima',
        'danju',
        'baobiao'
      ]
    }
  },
  methods: {
    //  获取用于显示左侧导航
    async getMenulist() {
      const { data: res } = await this.$http.get('./menus')
      // 获取失败处理
      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      }
      // 成功
      this.menulist = res.data
    },
    //  退出操作
    logout() {
      //  确认退出清除token
      // 页面跳转到login
      this.$confirm('是否要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('./login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: rgb(55, 61, 65);
    padding: 0;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo-box {
      color: #fff;
      font-size: 22px;
      font-family: '楷体';
      display: flex;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .shuxian {
      background-color: rgb(74, 80, 100);
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.1em;
      cursor: pointer;
      user-select: none;
    }
    .el-main {
      background-color: #eaedf1;
    }
  }
}
</style>
