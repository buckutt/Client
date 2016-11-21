import axios  from 'axios';
import q      from '../../utils/q';
import config from '../../config';

export const setPoint = ({ commit }, payload) => {
    commit('SET_DEVICE', payload);
};

export const login = ({ commit, dispatch }, { meanOfLogin, password }) => {
    commit('SET_DATA_LOADED', false);

    return axios
        .post(`${config.api}/services/login`, {
            meanOfLogin: config.loginMeanOfLogin,
            data       : meanOfLogin,
            pin        : password
        })
        .then((res) => {
            commit('AUTH_SELLER', {
                id       : res.data.user.id,
                token    : res.data.token,
                firstname: res.data.user.firstname,
                lastname : res.data.user.lastname,
                canSell  : res.data.user.canSell,
                canReload: res.data.user.canReload
            });

            dispatch('dataLoader')
                .then(() => dispatch('filterItems'))
                .then(() => dispatch('createTabs'))
                .then(() => dispatch('createTabsItems'))
                .then(() => commit('SET_DATA_LOADED'));
        })
        .catch((err) => {
            commit('ID_SELLER', '');
            commit('ERROR', err.response.data);
        });
};

export const logout = (store) => {
    if (store.state.auth.buyer.isAuth) {
        store.commit('LOGOUT_BUYER');
    } else if (store.state.auth.seller.isAuth) {
        store.commit('LOGOUT_SELLER');
        store.commit('ID_SELLER', '');
    } else if (store.state.auth.seller.meanOfLogin.length > 0) {
        store.commit('ID_SELLER', '');
    }
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
        eq   : cardNumber.trim()
    });

    const embedUser = q({
        user: true
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
                lastname : res.data[0].user.lastname
            });
        })
        .catch((err) => {
            store.commit('ERROR', err);
        });
};

export const sellerId = ({ commit }, meanOfLogin) => {
    commit('ID_SELLER', meanOfLogin);
};
