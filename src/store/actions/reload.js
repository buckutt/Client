export const openReloadModal = ({ commit }) => {
    commit('OPEN_RELOAD_MODAL');
};

export const confirmReloadModal = ({ commit }) => {
    commit('CONFIRM_RELOAD_MODAL');
};

export const cancelReloadModal = ({ commit }) => {
    commit('CANCEL_RELOAD_MODAL');
};

export const closeReloadModal = ({ commit }) => {
    commit('CLOSE_RELOAD_MODAL');
    commit('CHANGE_MEAN_OF_PAYMENT', 'card');
};

export const changeMeanOfPayment = ({ commit }, meanOfPayment) => {
    commit('CHANGE_MEAN_OF_PAYMENT', meanOfPayment);
};

export const addReload = (store, reload) => {
    store.commit('UPDATE_CREDIT', store.state.auth.buyer.credit + reload.amount);
    store.commit('ADD_RELOAD', reload);
};

export const removeReloads = ({ commit }) => {
    commit('REMOVE_RELOADS');
};
