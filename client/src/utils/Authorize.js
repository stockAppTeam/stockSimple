const axios = require('axios')

const auth = {
    register: function (newUser) {
        return axios.post("/auth/users/register", newUser)
    },
    login: function (currentUser) {
        return axios.post("/auth/users/login", currentUser)
    }, 
    authenticate: function (authUser) {
        // need to set the headers when making the request to allow the user to authenticate
        // the token is passed in from the front end
        axios.defaults.headers.common['Authorization'] = authUser.token; 
        return axios.get(`auth/users/authenticate/${authUser.email}`)
    }
}

export default auth;