import { UserService } from '../../services/user.service'

const service = new UserService();

export const state = {
  users: [],
  totalUsers: 0
}

export const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },

  SET_TOTAL_USERS(state, count) {
    state.totalUsers = count;
  }
}

export const actions = {
  async getUsers({ commit }) {
    const result = await service.getUsers();
    if(result.status == 200) {
      console.log('users: ', result);
      const { data:{ results, count} } = result;
      commit('SET_USERS', results);
      commit('SET_TOTAL_USERS', count);
    }
    else {
      return result;
    }
  },
  
  async createUser({ dispatch }, { name, email, role, tookanUserId, merchantName, isActive }) {
    const result = await service.create(name, email, role, tookanUserId, merchantName, isActive);
    console.log(result);
    if(result.status == 201) 
      dispatch('getUsers');

    return result
  },

  async updateUser({ dispatch }, {userId, name, email, role, tookanUserId, merchantName, isActive}) {
    const result = await service.update(userId, name, email, role, tookanUserId, merchantName, isActive);
    dispatch('getUsers');
    console.log(result);
  },

  async deleteUser({ dispatch }, userId) {
    const result = await service.delete(userId);
    dispatch('getUsers');
    console.log(result);
  }
}

export const getters = {

}