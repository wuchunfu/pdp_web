import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/userList',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/user/UserList.vue'),
                    meta: { title: '用户列表' }
                },
                {
                    path: '/roleList',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/role/RoleList.vue'),
                    meta: { title: '角色列表' }
                },
                {
                    path: '/roleAuth',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/role/RoleAuth.vue'),
                    meta: { title: '角色绑定权限' }
                },
                {
                    path: '/authList',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/auth/AuthList.vue'),
                    meta: { title: '权限列表' }
                },
                {
                    path: '/swagger',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Swagger.vue'),
                    meta: { title: '数据平台Swagger文档' }
                },
                {
                    path: '/job-doc',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/job/JobDoc.vue'),
                    meta: { title: '调度中心使用文档' }
                },
                {
                    path: '/env',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Env.vue'),
                    meta: { title: '环境监控' }
                },
                {
                    path: '/link',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/platformEntrance/LinkList.vue'),
                    meta: { title: '平台入口' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '开发团队' }
                },
                {
                    path: '/datasource',
                    component: () => import(/* webpackChunkName: "datasource" */ '../components/page/gather/Datasource.vue'),
                    meta: { title: '数据源' }
                },
                {
                    path: '/gatherDolphin',
                    component: () => import(/* webpackChunkName: "gatherDolphin" */ '../components/page/gather/gatherDolphin.vue'),
                    meta: { title: 'Dolphin数据采集' }
                },
                {
                    path: '/quality',
                    component: () => import(/* webpackChunkName: "gatherDolphin" */ '../components/page/quality/quality.vue'),
                    meta: { title: '数据质量' }
                },
                {
                    path: '/qualityReport',
                    component: () => import(/* webpackChunkName: "gatherDolphin" */ '../components/page/quality/QualityReport.vue'),
                    meta: { title: '数据校验报告' }
                },
                {
                    path: '/jobReport',
                    component: () => import(/* webpackChunkName: "jobReport" */ '../components/page/job/Report.vue'),
                    meta: { title: '运行报表' }
                },
                {
                    path: '/jobManager',
                    component: () => import(/* webpackChunkName: "jobManager" */ '../components/page/job/Manager.vue'),
                    meta: { title: '任务管理' }
                },
                {
                    path: '/jobLog',
                    component: () => import(/* webpackChunkName: "jobLog" */ '../components/page/job/Log.vue'),
                    meta: { title: '调度日志' }
                },
                {
                    path: '/executor',
                    component: () => import(/* webpackChunkName: "executor" */ '../components/page/job/Executor.vue'),
                    meta: { title: '执行器管理' }
                },
                {
                    path: '/metaDataChangeReport',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/metaData/MetaDataChangeList'),
                    meta: { title: '元数据变更列表' }
                },
                {
                    path: '/report-edit',
                    component: () => import(/* webpackChunkName: "report-edit" */ '../components/page/report/reportEdit'),
                    meta: { title: '报表设计' }
                },
                {
                    path: '/report-board',
                    component: () => import(/* webpackChunkName: "report-board" */ '../components/page/report/reportBoard'),
                    meta: { title: '报表看板' }
                },
                {
                    path: 'report-doc',
                    component: () => import(/* webpackChunkName: "report-doc" */ '../components/page/report/reportDoc'),
                    meta: { title: '报表设计使用文档' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
