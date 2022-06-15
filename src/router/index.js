import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/main',
        redirect: '/main/dashboard'
    }, {
        path: "/main",
        name: "Home",
        component: Home,
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ("../views/Dashboard.vue")
            }, 
            {
                path: "user_list",
                name: "user_list",
                meta: {
                    title: '用户列表'
                },
                component: () => import ("../views/UserList.vue")
            }, 
            {
                path: "department_list",
                name: "department_list",
                meta: {
                    title: '部门列表'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/DepartmentList.vue")
            }, 
            {
                path: "role_list",
                name: "role_list",
                meta: {
                    title: '角色列表'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/RoleList.vue")
            }, 
            {
                path: "permission_list",
                name: "permission_list",
                meta: {
                    title: '权限列表'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/PermissionList.vue")
            }, 
            {
                path: "doc_list",
                name: "doc_list",
                meta: {
                    title: '文档列表'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/DocList.vue")
            }, 
            {
                path: "charts",
                name: "basecharts",
                meta: {
                    title: '图表'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/BaseCharts.vue")
            }, {
                path: "form",
                name: "baseform",
                meta: {
                    title: '表单'
                },
                component: () => import ( /* webpackChunkName: "form" */ "../views/BaseForm.vue")
            }, {
                path: "tabs",
                name: "tabs",
                meta: {
                    title: 'tab标签'
                },
                component: () => import ( /* webpackChunkName: "tabs" */ "../views/Tabs.vue")
            }, {
                path: "donate",
                name: "donate",
                meta: {
                    title: '鼓励作者'
                },
                component: () => import ( /* webpackChunkName: "donate" */ "../views/Donate.vue")
            }, {
                path: "permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permission: true
                },
                component: () => import ( /* webpackChunkName: "permission" */ "../views/Permission.vue")
            }, {
                path: "i18n",
                name: "i18n",
                meta: {
                    title: '国际化语言'
                },
                component: () => import ( /* webpackChunkName: "i18n" */ "../views/I18n.vue")
            }, {
                path: "upload",
                name: "upload",
                meta: {
                    title: '上传插件'
                },
                component: () => import ( /* webpackChunkName: "upload" */ "../views/Upload.vue")
            }, {
                path: "icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import ( /* webpackChunkName: "icon" */ "../views/Icon.vue")
            }, {
                path: '404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
            }, {
                path: 'user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/User.vue')
            }, {
                path: 'editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器'
                },
                component: () => import (/* webpackChunkName: "editor" */ '../views/Editor.vue')
            }
        ]
    },
    {
        path: '/',
        redirect: '/login'
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    //不需要校验token的
    if (to.path == '/login' || to.path == '/') {
        next();
        //需要校验token的
    } else {
        const reg = /\/main\/[a-zA-Z]+[_-]?/
        // 正则匹配到了/main/
        if (reg.test(to.path)) {
            // 尝试获取token缓存
            const token = localStorage.getItem('token')
            if (token == '' || token == "" || token == null) {
                // 没有token则返回登陆
                next('/login')
            } else {
                // 有token则正常访问
                next()
            }
        }
    }

}
)


export default router;