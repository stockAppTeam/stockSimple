const axios = require('axios')

const auth = {
    register: function (newUser) {
        return axios.post("/auth/users", newUser)
    }
}

export default auth;