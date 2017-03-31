import axios  from 'axios';

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
    if (store.state.auth.seller.canReload && !store.state.auth.seller.canSell) {
        const basketToSend = [
            {
                credit   : reload.amount,
                trace    : reload.trace,
                Buyer_id : store.state.auth.buyer.id,
                Seller_id: store.state.auth.seller.id,
                type     : reload.type
            }
        ];

        axios
            .post(`${config.app.api}/services/basket`, basketToSend, store.getters.tokenHeaders)
            .then(() => {
                store.commit('REMOVE_RELOADS');
                store.commit('SET_LAST_USER', {
                    name  : `${store.state.auth.buyer.firstname} ${store.state.auth.buyer.lastname}`,
                    credit: store.state.auth.buyer.credit + reload.amount,
                    reload: reload.amount,
                    bought: 0
                });

                store.commit('LOGOUT_BUYER');
            });
    } else {
        store.commit('ADD_RELOAD', reload);
    }
};

export const removeReloads = ({ commit }) => {
    commit('REMOVE_RELOADS');
};
