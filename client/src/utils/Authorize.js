const axios = require('axios')

const auth = {
    // pass user object to backend to create user. front end kicks to login when this completes
    register: function (newUser) {
        return axios.post("/auth/users/register", newUser)
    },
    // user info passed into login. If success than it redirects to home page, otherwise throws an error
    login: function (currentUser) {
        return axios.post("/auth/users/login", currentUser)
    }, 
    authenticate: function (authUser) {
        // need to set the headers when making the request to allow the user to authenticate
        // the token is grabbed from local storage and then used to configure the headers
        axios.defaults.headers.common['Authorization'] = authUser.token; 
        return axios.get(`auth/users/authenticate/${authUser.userID}`)
    }, 

    deleteProfile: function (deleteUser) {
        axios.defaults.headers.common['Authorization'] = deleteUser.token; 
        return axios.delete(`auth/users/delete/${deleteUser.userID}/${deleteUser.token}`)
    }
}

export default auth;