const token_key = 'token'
const username_key = 'username'


class Auth {
    //构造函数
    constructor() {
        this.token = localStorage.getItem(token_key) ? localStorage.getItem(token_key) : ''
        this.username_key = localStorage.getItem(username_key) ? localStorage.getItem(username_key) : ''
    }
    // 存
    setAuth(token, username, id) {
        this.token = token
        this.username = username
        localStorage.setItem(token_key, token)
        localStorage.setItem(username_key, username)
    }
    //删
    delAuth() {
        this.token = ''
        this.username = ''
        localStorage.removeItem(token_key)
        localStorage.removeItem(username_key)
    }

}


//单例
const auth = new Auth()
export default auth
