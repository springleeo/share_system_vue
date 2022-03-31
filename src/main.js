import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axios'
import auth from './auth/auth'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
const app = createApp(App)
installElementPlus(app)
app.use(store)
app.use(router)
app.mount('#app')

//请求拦截器
axios.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token')
        if (token != '' || token != "" || token != null) {
            config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')

        } else {
            alert('请登录')
            router.replace({
                path: '/login'
            })
        }
        return config
    },
    function (err) {
        return Promise.reject(err)
    })

// 响应拦截器
axios.interceptors.response.use(
    function (rep) {
        if (rep.data.code == 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            router.replace({
                path: '/login'
            })
        } else if (rep.data.token) {
            localStorage.setItem('token', rep.data.token)
            localStorage.setItem('username', rep.data.user.username)
        }
        return rep
    },
    function (err) {
        if (err.response.data.detail == 'token不正确或已过期') {
            alert('token过期，请重新登录')
            router.replace({
                path: '/login'
            })
        } else {
            return Promise.reject(err)
            // alert(err.response.data)
        }
    })


// this.$router
app.config.globalProperties.$router = router
app.config.globalProperties.$axios = axios
app.config.globalProperties.$auth = auth
app.config.globalProperties.baseURL = 'http://127.0.0.1:8080'