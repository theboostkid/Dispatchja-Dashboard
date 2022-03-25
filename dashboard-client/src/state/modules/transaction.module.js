import { TransactionService } from '../../services/transaction.service'

const service = new TransactionService();

export const state = {
  overallTransactions: [],
  restaurantTransactions: []
}

export const mutations = {
  SET_OVERALL_TRANSACTIONS(state, transactions){
    state.overallTransactions = transactions
  },

  SET_RESTAURANT_TRANSACTIONS(state, transactions){
    state.restaurantTransactions = transactions
  }
}

export const getters = {
  failedTransactions: (state)=> state.overallTransactions.filter( transaction => transaction.jobStatus == 3),
  
  completedTransactions: (state)=> state.overallTransactions.filter( transaction => transaction.jobStatus == 2),

  canceledTransactions: (state)=> state.overallTransactions.filter( transaction => transaction.jobStatus == 9),

  
  failedRestaurantTransactions: (state)=> state.restaurantTransactions.filter( transaction => transaction.jobStatus == 3),
  
  completedRestaurantTransactions: (state)=> state.restaurantTransactions.filter( transaction => transaction.jobStatus == 2),

  canceledRestaurantTransactions: (state)=> state.restaurantTransactions.filter( transaction => transaction.jobStatus == 9),
}

export const actions = {
  async getTransactions({ commit }, { restaurantName, startDate, endDate }) {
    const result = await service.getTransaction(restaurantName, startDate, endDate);
    console.log("transactions: ", result);
    if(result.status == 200) {
      if(restaurantName) {
        commit('SET_RESTAURANT_TRANSACTIONS', result.data)
      } else {
        commit('SET_OVERALL_TRANSACTIONS', result.data)
      }
    }
  }
}