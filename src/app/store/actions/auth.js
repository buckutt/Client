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

            return dispatch('dataLoader', true)
                .then(() => dispatch('filterItems'))
                .then(() => dispatch('createTabs'))
                .then(() => dispatch('createTabsItems'))
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
        store.commit('LOGOUT_BUYER');
        store.commit('SET_BASKET_STATUS', 'WAITING');
    } else if (store.state.auth.seller.isAuth) {
        store.commit('FIRST_LOGOUT_SELLER');
    } else if (store.state.auth.seller.meanOfLogin.length > 0) {
        store.commit('ID_SELLER', '');
    }

    return store.dispatch('clearBasket');
};

export const pursueLogout = ({ commit }) => {
    commit('LOGOUT_SELLER');
    commit('ID_SELLER', '');
    // Remove disconnect warning
    commit('REMOVE_LOGOUT_WARNING');
};

export const cancelLogout = ({ commit }) => {
    commit('REMOVE_LOGOUT_WARNING');
};

export const buyer = (store, { cardNumber }) => {
    const molSearchIsRemoved = q({
        field: 'isRemoved',
        eq   : false
    });

    const molSearchType = q({
        field: 'type',
        eq   : config.buyerMeanOfLogin
    });

    const molSearchData = q({
        field: 'data',
        eq   : cardNumber.trim().slice(0, 13)
    });

    const embedUser = q({
        user: {
            groups: {
                _through: {
                    period: true
                }
            },
            purchases: {
                price: {
                    period: true
                }
            }
        }
    });

    const querySearch = `q[]=${molSearchIsRemoved}&q[]=${molSearchType}&q[]=${molSearchData}`;

    const token = store.getters.tokenHeaders;

    axios
        .get(`${config.api}/meansoflogin/search?${querySearch}&embed=${embedUser}`, token)
        .then((res) => {
            if (res.data.length === 0) {
                store.commit('ERROR', { message: 'User not found' });
                return;
            }

            store.commit('ID_BUYER', {
                id       : res.data[0].user.id,
                credit   : res.data[0].user.credit,
                firstname: res.data[0].user.firstname,
                lastname : res.data[0].user.lastname,
                groups   : res.data[0].user.groups,
                purchases: res.data[0].user.purchases
            });

            store.commit('SET_DATA_LOADED', false);

            store.dispatch('dataLoader', false)
                .then(() => store.dispatch('filterItems'))
                .then(() => store.dispatch('createTabs'))
                .then(() => store.dispatch('createTabsItems'))
                .then(() => {
                    if (store.state.basket.basketStatus === 'WAITING_FOR_BUYER') {
                        return store
                            .dispatch('sendBasket')
                            .then(() => store.dispatch('logout'));
                    }
                })
                .then(() => store.commit('SET_DATA_LOADED', true));
        })
        .catch((err) => {
            store.commit('SET_DATA_LOADED', null);
            store.commit('ERROR', err);
        });
};

export const sellerId = ({ commit }, meanOfLogin) => {
    commit('ID_SELLER', meanOfLogin);
};
