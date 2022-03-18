import { Http } from '../utils/http'

export class RestaurantService extends Http {
  constructor() {
    super();
  }

  async getStatistics(restaurantName, startDate, endDate) {
    let queryString =  "?";
    if(restaurantName)
      queryString += `restaurantName=${restaurantName}&`
    if(startDate)
      queryString += `startDate=${startDate}&`;
    if(endDate)
       queryString += `endDate=${endDate}&`;

    return await this.httpClient().get(`/restaurants/statistics${queryString}`);
  }

  updateRestaurantDetails(restaurantId, invoiceFrequencyInWeeks, email) {
    return this.httpClient().patch(`/restaurants/${restaurantId}`, { invoiceFrequencyInWeeks, email })
  }

  getRestaurants() {
    return this.httpClient().get(`/restaurants`);
  }

  deleteRestaurant(restaurantId) {
    return this.httpClient().delete(`/restaurants/${restaurantId}`);
  }

}