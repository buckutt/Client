import axios from 'axios';

const cancelUrl = `${config.api}/services/cancelTransaction`;

export const toggleHistory = ({ commit }) => {
    commit('TOGGLE_HISTORY');
};

export const removeFromHistory = ({ commit }, payload) => {
    commit('REMOVE_FROM_HISTORY', payload);
};

export const cancelEntry = (store, payload) => {
    if (typeof payload.transactionIds === 'string') {
        store.commit('ADD_PENDING_CANCELLATION', payload);
    } else {
        // request made online

        const cancelPurchases = payload.transactionIds.purchases.map((id) => ({
            rawType: 'purchase',
            id
        }));

        const cancelReloads = payload.transactionIds.reloads.map((id) => ({
            rawType: 'reload',
            id
        }));


        if (store.state.online.status) {
            // we're still online

            const reqs = cancelPurchases
                .concat(cancelReloads)
                .map(body => axios.post(cancelUrl, body, store.getters.tokenHeaders));

            return Promise.all(reqs)
        } else {
            // we're offline

            cancelPurchases
                .concat(cancelReloads)
                .map(body => store.dispatch('addPendingRequest', {
                    url: cancelUrl,
                    body
                }));

            return Promise.resolve();
        }
    }
};

export const sendValidCancellations = (store) => {
    const cancellations = store.state.history.pendingCancellations
        .filter((pending) => typeof pending.transactionIds === 'object')
        .map((pending) => {
            const cancelPurchases = pending.transactionIds.purchases.map((id) => ({
                rawType: 'purchase',
                id
            }));

            const cancelReloads = pending.transactionIds.reloads.map((id) => ({
                rawType: 'reload',
                id
            }));

            return cancelPurchases.concat(cancelReloads);
        })
        .map((bodys) => {
            return Promise.all(bodys.map(body => axios.post(cancelUrl, body, store.getters.tokenHeaders)));
        });

    return Promise
        .all(cancellations)
        .then(() => {
            store.state.history.pendingCancellations
                .filter((pending) => typeof pending.transactionIds === 'object')
                .forEach((pending) => {
                    store.dispatch('REMOVE_FROM_HISTORY', pending);
                });
        });
};
