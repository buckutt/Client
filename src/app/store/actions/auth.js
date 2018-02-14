import axios        from 'axios';
import cloneDeep    from 'lodash.clonedeep';
import q            from '../../utils/q';
import offlineLogin from '../../utils/offline/login';

export const setPoint = ({ commit }, payload) => {
    window.localStorage.setItem('headers', JSON.stringify(payload));
    commit('SET_DEVICE', payload);
};

export const setFullDevice = ({ commit }, payload) => {
    window.localStorage.setItem('fullDevice', JSON.stringify(payload));
    commit('SET_FULL_DEVICE', payload);
};

export const setEvent = ({ commit }, payload) => {
    window.localStorage.setItem('event', JSON.stringify(payload));
    commit('SET_EVENT', payload);
};

export const login = ({ commit, dispatch, state, getters }, { meanOfLogin, password }) => {
    const credentials = {
        meanOfLogin: config.loginMeanOfLogin,
        data       : meanOfLogin,
        pin        : password
    };

    const initialPromise = (!getters.isDegradedModeActive) ?
        axios.post(`${config.api}/services/login`, credentials) :
        offlineLogin(state.online.offline.sellers, credentials);

    return initialPromise
        .then((res) => {
            if (!res.data.user.canSell && !res.data.user.canReload && !res.data.user.canAssign) {
                return Promise.reject({ response: { data: { message: 'Not enough rights' } } });
            }

            commit('AUTH_SELLER', {
                id         : res.data.user.id,
                meanOfLogin,
                pin        : password,
                token      : res.data.token,
                firstname  : res.data.user.firstname,
                lastname   : res.data.user.lastname,
                canSell    : res.data.user.canSell,
                canReload  : res.data.user.canReload,
                canAssign  : res.data.user.canAssign
            });

            if (!res.data.user.canAssign) {
                commit('SET_DATA_LOADED', false);

                return dispatch('dataLoader')
                    .then(() => dispatch('interfaceLoader'))
                    .then(() => commit('SET_DATA_LOADED', true));
            } else {
                return dispatch('loadGroups')
                    .then(() => dispatch('loadEvent'))
            }
        })
        .then(() => dispatch('setupSocket', state.auth.seller.token))
        .catch((err) => {
            console.error(err);

            commit('ID_SELLER', '');
            commit('SET_DATA_LOADED', null);

            if (err.message === 'Network Error') {
                commit('ERROR', { message: 'Server not reacheable' });
                return;
            }

            commit('ERROR', err.response.data);
        });
};

export const logout = (store) => {
    if (store.state.auth.buyer.isAuth) {
        store.commit('LOGOUT_BUYER');
        store.dispatch('setupSocket');
        return store.dispatch('clearBasket')
            .then(() => store.dispatch('interfaceLoader'));
    } else if (store.state.auth.seller.isAuth) {
        store.commit('FIRST_LOGOUT_SELLER');
    }

    return Promise.resolve();
};

export const pursueLogout = ({ commit, dispatch }) => {
    commit('LOGOUT_SELLER');
    commit('ID_SELLER', '');
    // Remove disconnect warning
    commit('REMOVE_LOGOUT_WARNING');

    return dispatch('clearBasket')
        .then(() => dispatch('updateEssentials', true))
        .then(() => dispatch('clearInterface'));
};

export const cancelLogout = ({ commit }) => {
    commit('REMOVE_LOGOUT_WARNING');
};

export const buyer = (store, { cardNumber, credit }) => {
    console.trace(credit);
    const token = store.getters.tokenHeaders;

    store.commit('SET_DATA_LOADED', false);

    let initialPromise = Promise.resolve();

    if (store.state.auth.seller.canAssign) {
        store.commit('SET_DATA_LOADED', true);
        return;
    }

    let interfaceLoaderCredentials;
    let shouldSendBasket = false;
    let shouldWriteCredit = false;
    let shouldClearBasket = false;

    if (!store.state.auth.device.config.doubleValidation) {
        shouldClearBasket = true;
        // First time: sendBasket will active "WAITING_FOR_BUYER" and return
        shouldSendBasket = true;

        if (store.state.basket.basketStatus === 'WAITING_FOR_BUYER') {
            shouldWriteCredit = true;
        } else {
            interfaceLoaderCredentials = { type: config.buyerMeanOfLogin, mol: cardNumber };
        }
    } else {
        if (store.state.auth.buyer.isAuth) {
            shouldSendBasket = true;
            shouldClearBasket = true;
        } else {
            interfaceLoaderCredentials = { type: config.buyerMeanOfLogin, mol: cardNumber };
        }
    }

    if (shouldSendBasket) {
        if (credit) {
            store.commit('OVERRIDE_BUYER_CREDIT', credit);
        }

        initialPromise = initialPromise
            .then(() => store.dispatch('sendBasket', { cardNumber }))
            .then(() => store.commit('SET_BASKET_STATUS', 'WAITING'));
    } else {
        initialPromise = initialPromise
            .then(() => store.commit('SET_BUYER_MOL', cardNumber));
    }

    if (shouldWriteCredit && store.state.auth.device.event.config.useCardData) {
        initialPromise = initialPromise.then(() => {
            window.nfc.write(
                window.nfc.creditToData(store.state.ui.lastUser.credit, config.signingKey)
            );
        });
    }

    if (shouldClearBasket) {
        initialPromise = initialPromise.then(() => store.dispatch('clearBasket'));
    }

    initialPromise = initialPromise
        .then(() => store.dispatch('interfaceLoader', interfaceLoaderCredentials))
        .then(() => {
            if (credit && store.state.auth.device.event.config.useCardData) {
                store.commit('OVERRIDE_BUYER_CREDIT', credit);
            }
        })
        .catch((err) => {
            console.log(err);

            if (err.message === 'Network Error') {
                store.commit('ERROR', { message: 'Server not reacheable' });
                return;
            }

            store.commit('ERROR', err.response.data);
        })
        .then(() => store.commit('SET_DATA_LOADED', true));

    return initialPromise;
};

export const sellerId = ({ commit }, meanOfLogin) => {
    commit('ID_SELLER', meanOfLogin);
};

export const alert = ({ commit }, alert) => {
    commit('ALERT', alert);
};

export const closeAlert = ({ commit }) => {
    commit('CLOSE_ALERT');
};
