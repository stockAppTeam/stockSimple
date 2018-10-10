const axios = require('axios')

// routes to both add a stock and delete a stock from the users investments
const investment = {
    addStock: function (info) {
       return axios.post("/data/investment/", info)
    }, 

    deleteStock: function (id) {
        return axios.delete(`/data/investment/${id}`)
    }

}
export default investment;