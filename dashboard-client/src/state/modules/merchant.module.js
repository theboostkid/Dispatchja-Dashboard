import { MerchantService } from '../../services/merchant.service'

const service = new MerchantService();

export const state = {
  allAgents: [],

  totalMerchants: [],
  allMerchants: [],

  overallMerchantSummaries: [],
  overallMerchantPeriodSummaries: [],
  
  singleMerchantSummary: [],
  singleMerchantPeriodSummaries:[]
}

export const mutations = {
  SET_MERCHANTS(state, merchants) {
    state.allMerchants = merchants
  },

  SET_TOTAL_MERCHANTS(state, count) {
    state.totalMerchants = count
  },

  SET_OVERALL_MERCHANT_SUMMARIES(state, statistics){
    state.overallMerchantSummaries = statistics
  },

  SET_OVERALL_MERCHANT_PERIOD_SUMMARY(state, statistics){
    state.overallMerchantPeriodSummaries = statistics
  },

  SET_SINGLE_MERCHANT_SUMMARY(state, statistics){
    state.singleMerchantSummary =statistics
  },

  SET_SINGLE_MERCHANT_PERIOD_SUMMARY(state, statistics){
    state.singleMerchantPeriodSummaries =statistics
  }
}

export const actions = {
  async createMerchant({ dispatch }, { name, merchantId, email, address, province, country, startDate, endDate, statementFrequencyInWeeks, isActive}) {
    console.log(merchantId);
    const result = await service.createMerchant(
      name,
      merchantId,
      email,
      address,
      province,
      country,
      startDate,
      endDate,
      statementFrequencyInWeeks,
      isActive
    );
    console.log("save merchant: ", result);
    if(result.status == 201) {
      dispatch('getMerchants'); 
    }
    return result;
  },

  async getMerchants({ commit }) {
    const result = await service.getMerchants();
    console.log("merchants: ", result);
    if(result.status == 200){
      const { data: { count, results} } = result 
      commit('SET_MERCHANTS', results);
      commit('SET_TOTAL_MERCHANTS', count);
    }
  },
  
  async updateMerchant({ dispatch }, { name, id, email, address, province, country, startDate, endDate, statementFrequencyInWeeks, isActive}) {
    const result = await service.updateMerchant(name, id, email, address, province, country, startDate, endDate, statementFrequencyInWeeks, isActive);
    
    if(result.status == 200) {
      dispatch('getMerchants')
    }
    return result;
  },

  async getMerchantStatistics({ commit }, { merchantName, startDate, endDate }) {
    const result = await service.getStatistics(merchantName, startDate, endDate);
    console.log("merchant statistics: ", result);
    if(result.status == 200) {
      if(merchantName){
        commit('SET_SINGLE_MERCHANT_SUMMARY', result.data.merchantSummary);
        commit('SET_SINGLE_MERCHANT_PERIOD_SUMMARY', result.data.periodSummary);
      } else {
        commit('SET_OVERALL_MERCHANT_SUMMARIES', result.data.merchantSummary);
        commit('SET_OVERALL_MERCHANT_PERIOD_SUMMARY', result.data.periodSummary);
      }
    }
  },

  async deleteMerchant({ dispatch }, id){
    const result = await service.deleteMerchant(id);
    if(result.status == 204) {
      dispatch('getMerchants')
    }
  }
}