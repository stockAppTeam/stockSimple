const axios = require('axios')

const auth = {
    register: function (newUser) {
        return axios.post("/auth/users/register", newUser)
    },
    login: function (currentUser) {
        return axios.post("/auth/users/login", currentUser)
    }, 
    authenticate: function (authUser) {
        axios.defaults.headers.common['Authorization'] = authUser.token; 
        return axios.get(`auth/users/authenticate/${authUser.email}`)
    }
}

export default auth;