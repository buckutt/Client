const initialState = {
    reloadState   : 'closed',
    meanOfPayment : 'card',
    meansOfPayment: [],
    reloads       : []
};

const mutations = {
    SET_MEANS_OF_PAYMENT(state, payload) {
        state.meansOfPayment = payload;
    },

    OPEN_RELOAD_MODAL(state) {
        state.reloadState = 'opened';
    },

    CANCEL_RELOAD_MODAL(state) {
        state.reloadState = 'opened';
    },

    CONFIRM_RELOAD_MODAL(state) {
        state.reloadState = 'confirm';
    },

    CLOSE_RELOAD_MODAL(state) {
        state.reloadState = 'closed';
    },

    CHANGE_MEAN_OF_PAYMENT(state, meanOfPayment) {
        state.meanOfPayment = meanOfPayment;
    },

    ADD_RELOAD(state, payload) {
        state.reloads.push(payload);
    },

    REMOVE_RELOADS(state) {
        state.reloads = [];
    },

    LOGOUT_BUYER(state) {
        state.meanOfPayment = 'card';
        state.reloads       = [];
    }
};

export default { state: initialState, mutations };
