<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="titleshow">{{ titlename }}</div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in showMenu" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: {
    SidebarItem,
    Logo
  },
  data() {
    return {
      titlename: 'EAM',
      showMenu: [{
        children: [{
          path: 'index',
          name: '首页',
          meta: {
            title: '首页',
            icon: 'guide',
            affix: true
          }
        }]
      }]
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const {
        meta,
        path
      } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    getitems() { // 通过local存储获取动态菜单
      return localStorage.getItem('userMenu')
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    // console.log(this.permission_routes)
    const data = JSON.parse(this.getitems.replace(/url/g, 'path'))
    // console.log(data)
    // this.showMenu = []
    // this.showMenu = this.permission_routes
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid === 0) {
        this.showMenu.push({
          id: data[i].id,
          path: data[i].path,
          name: data[i].name,
          meta: {
            title: data[i].name
          },
          children: [{
            path: data[i].path,
            name: data[i].name,
            meta: {
              title: data[i].name,
              noCache: true
            }
          }

          ]
        })
      }
    }
    for (let i = 0; i < this.showMenu.length; i++) {
      const children = []
      for (let j = 0; j < data.length; j++) {
        if (data[j].pid === this.showMenu[i].id) {
          this.showMenu[i]['children'] = []
          children.push({
            path: data[j].path.slice(1),
            name: data[j].name,
            meta: {
              title: data[j].name,
              noCache: true
            }
          })
          this.showMenu[i]['children'] = children
        }
      }
    }
    console.log(this.showMenu)
  }
}
</script>
<style scoped>
	.titleshow {
		height: 50px;
		line-height: 50px;
		text-align: center;
		color: rgb(191, 203, 217);
		display: block;
		font-size: 16px;
	}
</style>
