import { Http } from '../utils/http'

export class RestaurantService extends Http {
  constructor() {
    super();
  }

  getStatistics(restaurantName, startDate, endDate) {
    let queryString =  "?";
    if(restaurantName)
      queryString += `restaurantName=${restaurantName}`
    if(startDate)
      queryString += `startDate=${startDate}`;
    if(endDate)
       queryString += `endDate=${endDate}`;

    return this.httpClient.get(`/restaurants/statistics${queryString}`);
  }

  updateRestaurantDetails(restaurantId, invoiceFrequencyInWeeks, email) {
    return this.httpClient.patch(`/restaurants/${restaurantId}`, { invoiceFrequencyInWeeks, email })
  }

  getRestaurant() {
    return this.httpClient.get(`/restaurants`);
  }

  deleteRestaurant(restaurantId) {
    return this.httpClient.delete(`/restaurants/${restaurantId}`);
  }

}