const axios = require('axios')

const investment = {
    // pass user object to backend to crate user. front end kicks to login when this completes
    addStock: function (info) {
       console.log(info)
       return axios.post("/data/investment/", info)
    }
}
export default investment;