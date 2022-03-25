import { Http } from '../utils/http'

export class UserService extends Http {
  constructor() {
    super()
  }

  async create(name, email, role, tookanUserId, restaurantName, isActive) {
    return await this.httpClient().post('/users', { name, email, role, tookanUserId, restaurantName, isActive});
  }

  async getUsers( search, restaurant, paginated, skip, limit ) {
    let queryString = "?"
    if(search)
      queryString += `search=${search}&`
    if(restaurant)
      queryString += `restaurant=${restaurant}&`
    if(paginated)
      queryString += `paginated=${paginated}&`
    if(skip)
      queryString += `skip=${skip}&`  
    if(limit)
      queryString += `limit=${limit}&`

    return await this.httpClient().get(`/users${queryString}`, );
  }

  async changePassword(userId, newPassword) {
    return await this.httpClient().patch(`users/${userId}/change-password`, newPassword);
  }

  async generatePassword(userId) {
    return await this.httpClient().patch(`users/${userId}/generate-new-password`);
  }

  async update(userId, name, email, role, tookanUserId, restaurantName, isActive) {
    return await this.httpClient().put(`users/${userId}`, {name, email, role, tookanUserId, restaurantName, isActive})
  }

  async delete(userId) {
    return await this.httpClient().delete(`users/${userId}`)
  }
} 