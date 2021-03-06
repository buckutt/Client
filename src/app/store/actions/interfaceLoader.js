import axios from 'axios';

export const interfaceLoader = (store, credentials) => {
    const token = store.getters.tokenHeaders;
    let params  = '';

    if (credentials) {
        params = `?buyer=${credentials.mol.trim()}&molType=${credentials.type}`;
    }

    const initialPromise = (!store.getters.isDegradedModeActive) ?
        axios.get(`${config.api}/services/items${params}`, token) :
        Promise.resolve({ data: store.state.online.offline.defaultItems });

    return initialPromise
        .then((res) => {
            if (res.data.buyer) {
                store.commit('ID_BUYER', {
                    id       : res.data.buyer.id,
                    credit   : res.data.buyer.credit,
                    firstname: res.data.buyer.firstname,
                    lastname : res.data.buyer.lastname,
                    groups   : res.data.buyer.groups,
                    purchases: res.data.buyer.purchases
                });
            } else {
                // This will be call at least once when seller logs in
                // It will stores default items in case of disconnection
                store.dispatch('setDefaultItems', {
                    articles: res.data.articles,
                    promotions: res.data.promotions
                });
            }

            if (res.data.articles) {
                store.commit('SET_ITEMS', res.data.articles);
            }

            if (res.data.promotions) {
                store.commit('SET_PROMOTIONS', res.data.promotions);
            }

            return store.dispatch('createTabs');
        })
        .then(() => store.dispatch('createTabsItems'))
        .catch((err) => {
            if (err.message === 'Network Error') {
                store.commit('ERROR', { message: 'Server not reacheable' });
                return;
            }

            store.commit('ERROR', err.response.data);
        });
};

export const clearInterface = (store) => {
    store.commit('CLEAR_ITEMS');
    store.commit('CLEAR_TABSITEMS');
    store.commit('CLEAR_CATEGORIES');
    store.commit('CLEAR_PROMOTIONS');
};
