import { RestaurantService } from '../../services/restaurant.service'

const service = new RestaurantService();

export const state = {
  restaurants: [],
  totalRestaurants: 0,
  restaurantMonthlyStatistics: [],
  restaurantOverallMonthlyStatistics: [],
  restaurantIndividualBreakdownStatistics: []
}

export const mutations = {
  SET_RESTAURANTS(state, restaurants) {
    state.restaurants = restaurants
  },

  SET_TOTAL_RESTAURANTS(state, count) {
    state.totalRestaurants = count
  },

  SET_RESTAURANTS_OVERALL_MONTHLY_STATISTICS(state, statistics){
    state.restaurantOverallMonthlyStatistics = statistics
  },

  SET_RESTAURANTS_INDIVIDUAL_BREAKDOWN_STATISTICS(state, statistics){
    state.restaurantIndividualBreakdownStatistics = statistics
  },

  SET_RESTAURANT_MONTHLY_STATISTICS(state, statistics){
    state.restaurantMonthlyStatistics =statistics
  }
}

export const actions = {
  async getRestaurants({ commit }) {
    const result = await service.getRestaurants();
    console.log("restaurants: ", result);
    if(result.status == 200){
      const { data: { count, results} } = result 
      commit('SET_RESTAURANTS', results);
      commit('SET_TOTAL_RESTAURANTS', count);
    }
  },
  
  async updateRestaurant({ dispatch }, { restaurantId, invoiceFrequencyInWeeks, email }) {
    const result = await service.updateRestaurantDetails(restaurantId, invoiceFrequencyInWeeks, email);
    console.log(result);
    if(result.status == 200) {
      dispatch('getRestaurants')
    }
  },

  async getRestaurantStatistics({ commit }, { restaurantName, startDate, endDate }) {
    const result = await service.getStatistics(restaurantName, startDate, endDate);
    console.log("restaurant statistics: ", result);
    if(result.status == 200) {
      if(restaurantName){
        commit('SET_RESTAURANT_MONTHLY_STATISTICS', result.data.monthlySummary)
      } else {
        commit('SET_RESTAURANTS_OVERALL_MONTHLY_STATISTICS', result.data.monthlySummary);
        commit('SET_RESTAURANTS_INDIVIDUAL_BREAKDOWN_STATISTICS', result.data.restaurantSummary);
      }
    }
  }
}