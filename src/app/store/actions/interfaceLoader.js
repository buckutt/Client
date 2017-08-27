import axios from 'axios';

export const interfaceLoader = (store, buyerId) => {
    const token = store.getters.tokenHeaders;
    let params  = '';
    if (buyerId) {
        params = `?buyer=${buyerId}`;
    }

    return axios
        .get(`${config.api}/services/items${params}`, token)
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
            }

            if (res.data.articles) {
                store.commit('SET_ITEMS', res.data.articles);
            }

            if (res.data.promotions) {
                store.commit('SET_PROMOTIONS', res.data.promotions);
            }

            return store.dispatch('createTabs');
        })
        .then(() => store.dispatch('createTabsItems'));
};

export const clearInterface = (store) => {
    store.commit('CLEAR_ITEMS');
    store.commit('CLEAR_TABSITEMS');
    store.commit('CLEAR_CATEGORIES');
    store.commit('CLEAR_PROMOTIONS');
};
