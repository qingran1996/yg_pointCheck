<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span style="font-size: 15px;">你好, {{user}} </span>
          <img src="../../assets/user_images/222.jpg" class="user-avatar" v-if="isHaveHead">
          <img :src="imageUrl" class="user-avatar" v-if="!isHaveHead">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="changePic">修改头像</el-dropdown-item>
          <el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>

          <!-- <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialogVisible"
               width="25%" center :key="editRender">
      <h3 style="display: flex;justify-content: center;color: #F56C6C" v-show="isPassWordInit">为了保护账号安全性,请对初始密码进行修改</h3>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="infoData.password" clearable placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordSecond">
          <el-input v-model="infoData.passwordSecond" clearable placeholder="请输入密码" type="password"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo" v-prevent-re-click>修改</el-button>
      </span>
    </el-dialog>
    <changeHead/>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import changeHead from '@/layout/components/changeHead'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    changeHead
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data(){
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.infoData.password) {
        callback(new Error('输入密码不一致!'))
      } else {
        callback()
      }
    }
    return{
      dialogTitle:'密码修改',
      editDialogVisible:false,
      editRender:0,
      user:localStorage.getItem('name'),
      picurl:this.documentEAMUrl('upload'),
      isHaveHead:true, //是否为默认头像
      isPassWordInit:true, //判断是否为初始密码
      infoData:{
        password:'',
        passwordSecond:''
      },
      imageUrl:'',
      rules:{
        password:[{
          validator: validatePass, trigger: ['blur','change']
        }],
        passwordSecond:[{
          validator: validatePass2, trigger: ['blur','change']
        }]
      }
    }
  },
  mounted() {
    let result=parseInt(sessionStorage.getItem('passwordIsInit'))
    this.isPassWordInit = result === 1
    if (result === 1 && localStorage.getItem('username') !=='sAdmin'){
      this.changePassword()
    }
   this.lookPic()
    this.$bus.on('changeHeadPicRender',e=>{
      this.$nextTick(()=>{
        this.imageUrl = this.picurl + localStorage.getItem('attachUrl')
        this.isHaveHead = false
      })
    })
  },
  watch:{
    editDialogVisible(val){
      if (val === false){
        this.$refs.ruleForm.resetFields()
        this.editRender +=1
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    lookPic(){ //加载头像
      let pic =localStorage.getItem('attachUrl')
      if (pic !== ''){
        this.isHaveHead = false
        this.imageUrl = this.picurl + pic
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      localStorage.removeItem('eleToken')
      this.$router.push(`/login`)
      location.reload()
      // loading.close()
    },
    async changePassword(){
      this.editDialogVisible = true
    },
    changePic(){
      let item = {}
      item.show = true
      this.$bus.emit('changeUserHead',item)
    },
    close(){
      this.editDialogVisible = false
    },
    updateInfo(){
      this.$refs.ruleForm.validate(valid=>{
        if (valid){
          let par={
            id:parseInt(localStorage.getItem('userId')),
            attachUrl:null,
            password:this.infoData.passwordSecond
          }
          this.$axios.post('/u/user/update',par).then(res=>{
            if (res.data.code === 0){
              this.$message.success('修改密码成功,请重新登录')
              this.close()
              setTimeout(()=>{
                this.logout()
              },1000)
            }else {
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    }
  },
  destroyed() {
    this.$bus.off('changeHeadPicRender')
  }
}
</script>

<style lang="scss" scoped>
	.navbar {
		height: 50px;
		overflow: hidden;
		position: relative;
		background: #fff;
		box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

		.hamburger-container {
			line-height: 46px;
			height: 100%;
			float: left;
			cursor: pointer;
			transition: background .3s;
			-webkit-tap-highlight-color: transparent;

			&:hover {
				background: rgba(0, 0, 0, .025)
			}
		}

		.breadcrumb-container {
			float: left;
		}

		.errLog-container {
			display: inline-block;
			vertical-align: top;
		}

		.right-menu {
			float: right;
			height: 100%;
			line-height: 50px;

			&:focus {
				outline: none;
			}

			.right-menu-item {
				display: inline-block;
				padding: 0 8px;
				height: 100%;
				font-size: 18px;
				color: #5a5e66;
				vertical-align: text-bottom;

				&.hover-effect {
					cursor: pointer;
					transition: background .3s;

					&:hover {
						background: rgba(0, 0, 0, .025)
					}
				}
			}

			.avatar-container {
				margin-right: 30px;

				.avatar-wrapper {
					margin-top: 5px;
					position: relative;

					.user-avatar {
						cursor: pointer;
						width: 40px;
						height: 40px;
						border-radius: 10px;
					}
				}
			}
		}
	}
</style>
