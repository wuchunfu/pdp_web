<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'dashboard',
          title: '系统首页'
        },
        {
          icon: 'el-icon-data-line',
          index: '18',
          title: '报表开发',
          subs: [
            {
              index: 'report-board',
              title: '报表看板'
            },
            {
              index: 'report-edit',
              title: '报表设计'
            }
          ]
        },
        {
          icon: 'el-icon-s-data',
          index: '10',
          title: '数据采集',
          subs: [
            {
              index: 'datasource',
              title: '数据源管理'
            },
            {
              index: '/gatherDolphin',
              title: 'Dolphin数据采集'
            }
          ]
        },
        {
          icon: 'el-icon-share',
          index: '11',
          title: '数据质量',
          subs: [
            {
              index: 'quality',
              title: '数据校验配置'
            },
            {
              index: 'qualityReport',
              title: '数据校验报告'
            },
            {
              index: 'metaDataChangeReport',
              title: '元数据变更报告'
            }
          ]
        },
        {
          icon: 'el-icon-view',
          index: '15',
          title: '任务监控',
          subs: [
            {
              index: 'job',
              title: '任务监控配置'
            },
            {
              index: 'jobReport',
              title: '任务监控报告'
            }
          ]
        }, {
          icon: 'el-icon-s-tools',
          index: '16',
          title: '调度中心',
          subs: [
            {
              index: 'jobReport',
              title: '运行报表'
            },
            {
              index: 'jobManager',
              title: '任务管理'
            },
            {
              index: 'jobLog',
              title: '调度日志'
            },
            {
              index: 'executor',
              title: '执行器管理'
            }
          ]
        },
        {
          icon: 'el-icon-lx-people',
          index: '12',
          title: '用户管理',
          subs: [
            {
              index: 'userList',
              title: '用户列表'
            }
          ]
        },
        {
          icon: 'el-icon-lx-group',
          index: '13',
          title: '角色管理',
          subs: [
            {
              index: 'roleList',
              title: '角色列表'
            },
            {
              index: 'roleAuth',
              title: '角色权限'
            }
          ]
        },
        {
          icon: 'el-icon-lx-lock',
          index: '14',
          title: '权限管理',
          subs: [
            {
              index: 'authList',
              title: '权限列表'
            }
          ]
        },
        {
          icon: 'el-icon-lx-text',
          index: '17',
          title: '使用文档',
          subs: [
            {
              index: 'swagger',
              title: 'pdp swagger文档'
            },
            {
              index: 'job-doc',
              title: '调度中心使用文档'
            },
            {
              index: 'report-doc',
              title: '报表设计使用文档'
            }
          ]
        },
        {
          icon: 'el-icon-view',
          index: 'env',
          title: '环境监控'
        },
        {
          icon: 'el-icon-link',
          index: 'link',
          title: '平台入口'
        },
        {
          icon: 'el-icon-s-opportunity',
          index: '/donate',
          title: '开发团队'
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
