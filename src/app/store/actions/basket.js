/* eslint-disable */

import axios  from 'axios';

export const addItemToBasket = ({ commit }, item) => {
    commit('ADD_ITEM', item);
};

export const removeItemFromBasket = ({ commit }, item) => {
    commit('REMOVE_ITEM', item);
};

export const clearBasket = ({ commit }) => {
    commit('CLEAR_BASKET');
    commit('REMOVE_RELOADS');
};

export const sendBasket = (store) => {
    if (!store.state.auth.device.config.doubleValidation) {
        if (store.state.basket.basketStatus !== 'WAITING_FOR_BUYER') {
            store.commit('SET_BASKET_STATUS', 'WAITING_FOR_BUYER');
            return;
        }
    }

    if (!store.state.auth.buyer.isAuth) {
        return;
    }

    if (store.getters.credit < 0) {
        store.commit('CLEAR_BASKET');
        store.commit('REMOVE_RELOADS');
        store.commit('SET_BASKET_STATUS', 'ERROR');
        store.commit('ERROR', {
            message: 'Not enough credit'
        });
        return;
    }

    const fullBasket = store.getters.cleanBasket;
    const now        = new Date();

    const basketToSend = [];

    let bought   = 0;
    let reloaded = 0;

    fullBasket.items.forEach((articleId) => {
        const article = store.state.items.items.find(i => i.id === articleId);
        basketToSend.push({
            Buyer_id    : store.state.auth.buyer.id,
            Price_id    : article.price.id,
            Promotion_id: null,
            articles    : [{
                id     : article.id,
                vat    : article.vat,
                price  : article.price.id
            }],
            alcohol: article.alcohol,
            cost   : article.price.amount,
            type   : 'purchase',
            date   : now
        });

        bought += article.price.amount;
    });

    fullBasket.promotions.forEach((basketPromo) => {
        const promoId        = basketPromo.id;
        const articlesInside = [];
        let alcohol          = 0;
        const promo          = store.state.items.promotions.find(p => p.id === promoId);

        basketPromo.contents.forEach((articleInside) => {
            const fullArticleInside = store.state.items.items.find(i => i.id === articleInside);
            articlesInside.push({
                id   : articleInside,
                vat  : fullArticleInside.vat,
                price: fullArticleInside.price.id
            });

            alcohol += fullArticleInside.alcohol;
        });

        basketToSend.push({
            Price_id    : promo.price.id,
            Buyer_id    : store.state.auth.buyer.id,
            Promotion_id: promo.id,
            articles    : articlesInside,
            cost        : promo.price.amount,
            type        : 'purchase',
            date        : now,
            alcohol
        });

        bought += promo.price.amount;
    });

    fullBasket.reloads.forEach((reload) => {
        basketToSend.push({
            credit   : reload.amount,
            trace    : reload.trace,
            Buyer_id : store.state.auth.buyer.id,
            type     : reload.type,
            date     : now
        });

        reloaded += reload.amount;
    });

    store.commit('SET_BASKET_STATUS', 'DOING');

    axios
        .post(`${config.api}/services/basket`, basketToSend, store.getters.tokenHeaders)
        .then(() => {
            store.commit('CLEAR_BASKET');
            store.commit('REMOVE_RELOADS');
            store.commit('SET_BASKET_STATUS', 'WAITING');
            store.commit('SET_LAST_USER', {
                name  : `${store.state.auth.buyer.firstname} ${store.state.auth.buyer.lastname}`,
                credit: (store.state.auth.buyer.credit - bought) + reloaded,
                reload: reloaded,
                bought
            });

            store.commit('LOGOUT_BUYER');
        })
        .catch((err) => {
            store.commit('SET_BASKET_STATUS', 'ERROR');
            store.commit('ERROR', err.response.data);
        });
};
