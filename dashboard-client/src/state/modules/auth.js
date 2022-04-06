import { AuthService } from '../../services/auth.service'

const service = new AuthService();

export const state = {
    currentUser: JSON.parse(sessionStorage.getItem('auth.currentUser')),
}

export const mutations = {
    SET_CURRENT_USER(state, newValue) {
        state.currentUser = newValue
        saveState('auth.currentUser', newValue)
    }
}

export const getters = {
    // Whether the user is currently logged in.
    loggedIn(state) {
        return !!state.currentUser
    }
}

export const actions = {

    // Logs in the current user.
    // eslint-disable-next-line no-unused-vars
    async logIn({ commit, dispatch, getters }, { email, password } = {}) {
      const result = await service.login(email, password);
      console.log(result);
      if(result.status == 200) {
        const { data, status } = result;
        commit('SET_CURRENT_USER', data.user)
        return {message: 'Successfull', status}
      } else {
        return result;
      }
    },

    // Logs out the current user.
    // eslint-disable-next-line no-unused-vars
    async logOut({ commit }, userId) {
      const result = await service.logout(userId);
      if(result.status == 204){
        commit('SET_CURRENT_USER', null);
      }
    },

    //eslint-disable-next-line
    async requestPasswordChange({}, email){
      const result = await service.requestPasswordChange(email);
      return result;
    },

    // eslint-disable-next-line no-unused-vars
    async verifyPasswordChange({ commit }, { token }) {
      const result = await service.verifyPasswordChange(token);
      console.log(result);
      return result
    }
}

// ===
// Private helpers
// ===

function saveState(key, state) {
    window.sessionStorage.setItem(key, JSON.stringify(state))
}
