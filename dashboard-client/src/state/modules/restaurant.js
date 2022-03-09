import { RestaurantService } from '../../services/restaurant.service'

const service = new RestaurantService();

export const state = {
  restaurants: []
}

export const mutations = {
  SET_RESTAURANTS(state, restaurants) {
    state.restaurants = restaurants
  }
}

export const actions = {
  async getRestaurants({ commit }) {
    const result = await service.getRestaurants();
    console.log(result); 
  },
  
  async updateRestaurant({ commit }, { restaurantId, invoiceFrequencyInWeeks, email }) {
    const result = await service.updateRestaurantDetails(restaurantId, invoiceFrequencyInWeeks, email);
    console.log(result);
  }
}

export const getters = {

}