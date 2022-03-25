export const state = {
    type: null,
    message: null,
    title: null,
    isActive: false
};

export const mutations = {
    success(state, message) {
        state.type = 'bg-success';
        state.message = message.message;
        state.title = message.title;
        state.isActive = true;
    },
    error(state, message) {
        state.type = 'bg-danger';
        state.message = message.message;
        state.title = message.title;
        state.isActive = true;
    },
    clear(state) {
        state.type = null;
        state.message = null;
        state.title = null
        state.isActive = false;
    }
};

export const actions = {
    success({ commit }, { title, message}) {
        commit('success', { message, title});
    },
    error({ commit }, { message, title}) {
        commit('error', { message, title});
    },
    clear({ commit }) {
        commit('clear');
    }
};
