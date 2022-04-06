import { TransactionService } from '../../services/transaction.service'

const service = new TransactionService();

export const state = {
  allTransactions: [],
  merchantTransactions: []
}

export const mutations = {
  SET_ALL_TRANSACTIONS(state, transactions){
    state.allTransactions = transactions
  },

  SET_MERCHANT_TRANSACTIONS(state, transactions){
    state.merchantTransactions = transactions
  }
}

export const getters = {
  failedTransactions: (state)=> state.allTransactions.filter( transaction => transaction.jobStatus == 3),
  
  completedTransactions: (state)=> state.allTransactions.filter( transaction => transaction.jobStatus == 2),

  cancelledTransactions: (state)=> state.allTransactions.filter( transaction => transaction.jobStatus == 9),

  
  failedMerchantTransactions: (state)=> state.merchantTransactions.filter( transaction => transaction.jobStatus == 3),
  
  completedMerchantTransactions: (state)=> state.merchantTransactions.filter( transaction => transaction.jobStatus == 2),

  cancelledMerchantTransactions: (state)=> state.merchantTransactions.filter( transaction => transaction.jobStatus == 9),
}

export const actions = {
  async getTransactions({ commit }, { merchantName, startDate, endDate }) {
    const result = await service.getTransactions(merchantName, startDate, endDate);
    if(result.status == 200) {
      if(merchantName) {
        commit('SET_MERCHANT_TRANSACTIONS', result.data)
      } else {
        commit('SET_ALL_TRANSACTIONS', result.data)
      }
    }
  }
}