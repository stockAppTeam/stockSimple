const axios = require('axios')

const investment = {
    // pass user object to backend to crate user. front end kicks to login when this completes
    addStock: function (info) {
       return axios.post("/data/investment/", info)
    }, 

    deleteStock: function (id) {
        return axios.delete(`/data/investment/${id}`)
    }

}
export default investment;