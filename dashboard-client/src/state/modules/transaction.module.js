import { TransactionService } from '../../services/transaction.service'

const transactionService = new TransactionService();

export const state = {
  statements: [],
  statementsCount: 0,

  transactions: [],
  transactionPeriodSummary: [],

  paymentMethodSummaries: [],
  periodSummaries: [],

  merchantSummaries: [],
  merchantSummary: {},
};

export const mutations = {
  SET_TRANSACTIONS(state, payload) {
    state.transactions = payload;
  },

  SET_MERCHANT_SUMMARIES(state, payload) {
    state.merchantSummaries = payload;
  },

  SET_PAYMENT_METHOD_SUMMARIES(state, payload) {
    state.paymentMethodSummaries = payload;
  },

  SET_PERIOD_SUMMARIES(state, payload) {
    state.periodSummaries = payload;
  },

  SET_MERCHANT_SUMMARY(state, payload) {
    state.merchantSummary = payload;
  },

  SET_STATEMENTS(state, payload) {
    state.statements = payload
  },

  SET_STATMENTS_COUNT(state, payload){
    state.statementsCount = payload
  }
};

export const actions = {
  async fetchTransactions({ commit }, { startDate, endDate, merchantName }) {
    const { status, data} = await transactionService.fetchTransactions(
      startDate,
      endDate,
      merchantName
    );
    if (status == 200) {
      commit("SET_TRANSACTIONS", data);
    }
    return status;
  },

  async fetchStatistics({ commit }, { startDate, endDate, merchantName }) {
    const { status, data } = await transactionService.fetchStatistics(
      startDate,
      endDate,
      merchantName
    );
    if (status == 200) {
      const { periodSummary, paymentMethodSummary, merchantSummary } = data;
      if(merchantName){
        commit("SET_MERCHANT_SUMMARY", merchantSummary);
        commit("SET_MERCHANT_SUMMARIES", []);
      } else {
        commit("SET_MERCHANT_SUMMARIES", merchantSummary);
        commit("SET_MERCHANT_SUMMARY", []);
      }
      commit("SET_PAYMENT_METHOD_SUMMARIES", paymentMethodSummary);
      commit("SET_PERIOD_SUMMARIES", periodSummary);
    } 
    return status;
  },

  async fetchStatements({ commit }, { startDate, endDate, merchantId, skip, limit }){
    const { data, status } = await transactionService.fetchStatements(startDate, endDate, merchantId, skip, limit);
    if(status == 200){
      commit('SET_STATEMENTS', data.results);
      commit('SET_STATMENTS_COUNT', data.count)
    }
    return status
  }
};

export const getters = {
  failedTransactions: (state) =>
    state.transactions.filter((transaction) => transaction.jobStatus == 3),

  completedTransactions: (state) =>
    state.transactions.filter((transaction) => transaction.jobStatus == 2),

  cancelledTransactions: (state) =>
    state.transactions.filter((transaction) => transaction.jobStatus == 9),
};
