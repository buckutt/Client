import axios from 'axios';
import q     from '../../utils/q';

export const setPoint = ({ commit }, payload) => {
    commit('SET_DEVICE', payload);
};

export const login = ({ commit, dispatch }, { meanOfLogin, password }) =>
    axios
        .post(`${config.api}/services/login`, {
            meanOfLogin: config.loginMeanOfLogin,
            data       : meanOfLogin,
            pin        : password
        })
        .then((res) => {
            if (!res.data.user.canSell && !res.data.user.canReload) {
                return Promise.reject({ response: { data: { message: 'Not enough rights' } } });
            }

            commit('AUTH_SELLER', {
                id       : res.data.user.id,
                token    : res.data.token,
                firstname: res.data.user.firstname,
                lastname : res.data.user.lastname,
                canSell  : res.data.user.canSell,
                canReload: res.data.user.canReload
            });

            commit('SET_DATA_LOADED', false);

            return dispatch('dataLoader')
                .then(() => dispatch('interfaceLoader'))
                .then(() => commit('SET_DATA_LOADED', true));
        })
        .catch((err) => {
            console.log(err);
            commit('ID_SELLER', '');
            commit('SET_DATA_LOADED', null);
            commit('ERROR', err.response.data);
        });

export const logout = (store) => {
    if (store.state.auth.buyer.isAuth) {
        store.commit('SET_DATA_LOADED', false);
        store.commit('LOGOUT_BUYER');
        store.commit('SET_BASKET_STATUS', 'WAITING');
        store.dispatch('clearBasket');
        return store.dispatch('interfaceLoader')
            .then(() => store.commit('SET_DATA_LOADED', true));
    } else if (store.state.auth.seller.isAuth) {
        return store.commit('FIRST_LOGOUT_SELLER');
    } else if (store.state.auth.seller.meanOfLogin.length > 0) {
        store.commit('ID_SELLER', '');
        return store.dispatch('updatePoint', true)
            .then(() => store.dispatch('clearInterface'));
    }
};

export const pursueLogout = ({ commit, dispatch }) => {
    commit('LOGOUT_SELLER');
    commit('ID_SELLER', '');
    // Remove disconnect warning
    commit('REMOVE_LOGOUT_WARNING');

    return dispatch('updatePoint', true)
        .then(() => dispatch('clearInterface'));
};

export const cancelLogout = ({ commit }) => {
    commit('REMOVE_LOGOUT_WARNING');
};

export const buyer = (store, { cardNumber }) => {
    const token = store.getters.tokenHeaders;

    store.commit('SET_DATA_LOADED', false);

    let initialPromise = Promise.resolve();

    if (store.state.basket.basketStatus !== 'WAITING_FOR_BUYER') {
        initialPromise = store.dispatch('clearBasket');
    }

    initialPromise
        .then(() => store.dispatch('interfaceLoader', { type: config.buyerMeanOfLogin, mol: cardNumber.trim() }))
        .then(() => {
            if (store.state.basket.basketStatus === 'WAITING_FOR_BUYER') {
                return store
                    .dispatch('sendBasket')
                    .then(() => store.dispatch('logout'))
                    .then(() => store.dispatch('interfaceLoader'));
            }
        })
        .then(() => store.commit('SET_DATA_LOADED', true))
        .catch((err) => {
            store.commit('SET_DATA_LOADED', null);
            store.commit('ERROR', err);
        });
};

export const sellerId = ({ commit }, meanOfLogin) => {
    commit('ID_SELLER', meanOfLogin);
};
