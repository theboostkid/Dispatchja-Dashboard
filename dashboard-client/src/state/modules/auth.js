
export const state = {
    currentUser: sessionStorage.getItem('authUser'),
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
    logIn({ commit, dispatch, getters }, { email, password } = {}) {
    },

    // Logs out the current user.
    // eslint-disable-next-line no-unused-vars
    logOut({ commit }) {
    },

    // register the user
    // eslint-disable-next-line no-unused-vars
    resetPassword({ commit, dispatch, getters }, { email } = {}) {
    },
}

// ===
// Private helpers
// ===

function saveState(key, state) {
    window.sessionStorage.setItem(key, JSON.stringify(state))
}
