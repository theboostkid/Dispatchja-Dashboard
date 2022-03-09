import { UserService } from '../../services/user.service'

const service = new UserService();

export const state = {
  users: {}
}

export const mutations = {
  ADD_USERS(state, users) {
    state.users = users
  }
}

export const actions = {
  async getUsers({ commit }) {
    const result = await service.getUsers();
    commit('ADD_USERS', result)
    console.log(result);
  },

  async createUser({ dispatch }, { name, email, role, tookanUserId, restaurantName, isActive }) {
    const result = await service.create(name, email, role, tookanUserId, restaurantName, isActive);
    dispatch('getUsers');
    console.log(result);
  }
}

export const getters = {

}