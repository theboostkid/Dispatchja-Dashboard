import { MerchantService } from '../../services/merchant.service'

const merchantService = new MerchantService();

export const state = {
  merchants: [],
  merchantCount: 0
}

export const mutations = {
  SET_MERCHANTS(state, payload){
    state.merchants = payload
  },

  SET_MERCHANT_COUNT(state, payload){
    state.merchantCount = payload
  }
}

export const actions = {
  async fetchMerchants({ commit }){
    const { data, status, error } = await merchantService.fetchMerchants();
    if(status == 200 ) {
      const { count, results } = data;
      commit('SET_MERCHANTS', results);
      commit('SET_MERCHANT_COUNT', count);
      return { status, data };
    } else {
      return { status, error };
    }
  },

  async createMerchant({ dispatch }, {name, merchantId, email, address, province, country, startDate, endDate, statementFrequencyInWeeks, isActive}){
    const { data, status, error } = await merchantService.createMerchant(name, merchantId, email, address, province, country, startDate, endDate, statementFrequencyInWeeks, isActive);
    if(status == 201){
      dispatch('fetchMerchants');
      return { status, data };
    } else {
      return { status, error};
    } 
  },

  async updateMerchant({ dispatch }, { id, updates } ){
    const { data, status, error } = await merchantService.updateMerchant(id, updates);
    if(status == 200) {
      dispatch('fetchMerchants');
      return { status, data }
    } else {
      return { status, error }
    }
  },

  async deleteMerchant({ dispatch }, id){
    const { data, status, error } = await merchantService.deleteMerchant(id);
    if(status == 204) {
      dispatch('fetchMerchants');
      return { status, data }
    } else {
      return { status, error }
    }
  }
}

export const getters = {}