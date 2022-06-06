import { TransactionService } from '../../services/transaction.service'

const transactionService = new TransactionService();

export const state = {
  transactions: [],
  transactionPeriodSummary: [],
  merchantSummaries: [],
  paymentMethodSummaries: [],
  periodSummaries: [],
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
};

export const actions = {
  async fetchTransactions({ commit }, { startDate, endDate, merchantName }) {
    const { status, data, error } = await transactionService.fetchTransactions(
      startDate,
      endDate,
      merchantName
    );
    if (status == 200) {
      commit("SET_TRANSACTIONS", data);
      return status;
    } else {
      const { message, title } = error;
      return { status, message, title };
    }
  },

  async fetchStatistics({ commit }, { startDate, endDate, merchantName }) {
    const { status, data, error } = await transactionService.fetchStatistics(
      startDate,
      endDate,
      merchantName
    );
    console.log(data);
    if (status == 200) {
      const { periodSummary, paymentMethodSummary, merchantSummary } = data;
      commit("SET_MERCHANT_SUMMARIES", merchantSummary);
      commit("SET_PAYMENT_METHOD_SUMMARIES", paymentMethodSummary);
      commit("SET_PERIOD_SUMMARIES", periodSummary);
      return status;
    } else {
      const { message, title } = error;
      return { status, message, title };
    }
  },
};

export const getters = {
  failedTransactions: (state) =>
    state.transactions.filter((transaction) => transaction.jobStatus == 3),

  completedTransactions: (state) =>
    state.transactions.filter((transaction) => transaction.jobStatus == 2),

  cancelledTransactions: (state) =>
    state.transactions.filter((transaction) => transaction.jobStatus == 9),
};
