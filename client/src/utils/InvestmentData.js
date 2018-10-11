const axios = require('axios')

// routes to both add a stock and delete a stock from the users investments
const investment = {
    addStock: function (info) {
       return axios.post("/data/investment/", info)
    }, 

    deleteStock: function (investmentId, userId) {
        return axios.delete(`/data/investment/${investmentId}/${userId}`)
    }

}
export default investment;