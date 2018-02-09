/* eslint-disable */

import axios    from 'axios';
import uniqueId from 'lodash.uniqueid';

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

export const sendBasket = (store, payload = {}) => {
    // avoid sending multiple requests
    if (store.state.basket.basketStatus === 'DOING') {
        return;
    }

    // quick mode = wait for card for writing
    if (!store.state.auth.device.config.doubleValidation) {
        if (store.state.basket.basketStatus !== 'WAITING_FOR_BUYER') {
            store.commit('SET_BASKET_STATUS', 'WAITING_FOR_BUYER');
            return;
        }
    }

    // no buyer = can't send request
    if (!store.state.auth.buyer.isAuth && !payload.cardNumber) {
        return;
    }

    // !useCardData = checked by the API
    if (store.state.auth.device.event.config.useCardData && store.getters.credit < 0) {
        return Promise.reject({ response: { data: { message: 'Not enough credit' } } });
    }

    const now        = payload.now || new Date();
    const cardNumber = payload.cardNumber || store.state.auth.buyer.meanOfLogin;

    store.commit('SET_BASKET_STATUS', 'DOING');

    const basket  = store.state.items.basket.sidebar;
    const reloads = store.state.reload.reloads;

    const basketToSend = [];

    let bought   = store.getters.basketAmount;
    let reloaded = store.getters.reloadAmount;

    basket.items.forEach((article) => {
        basketToSend.push({
            price_id    : article.price.id,
            promotion_id: null,
            articles    : [{
                id   : article.id,
                vat  : article.vat,
                price: article.price.id
            }],
            alcohol: article.alcohol,
            cost   : article.price.amount,
            type   : 'purchase'
        });
    });

    basket.promotions.forEach((promotion) => {
        const articlesInside = [];
        let alcohol          = 0;

        promotion.content.forEach((articleInside) => {
            articlesInside.push({
                id   : articleInside.id,
                vat  : articleInside.vat,
                price: articleInside.price.id
            });

            alcohol += articleInside.alcohol;
        });

        basketToSend.push({
            price_id    : promotion.price.id,
            promotion_id: promotion.id,
            articles    : articlesInside,
            cost        : promotion.price.amount,
            type        : 'purchase',
            alcohol
        });
    });

    reloads.forEach((reload) => {
        basketToSend.push({
            credit   : reload.amount,
            trace    : reload.trace,
            type     : reload.type
        });
    });

    const transactionToSend = {
        buyer  : cardNumber,
        molType: config.buyerMeanOfLogin,
        date   : now,
        basket : basketToSend
    };

    let initialPromise;

    if (store.getters.isDegradedModeActive) {
        const transactionIds = uniqueId('offline-transaction-id');

        transactionToSend.seller = store.state.auth.seller.id;
        transactionToSend.offlineTransactionId = transactionIds;

        store.dispatch('addPendingRequest', {
            url: `${config.api}/services/basket?offline=1`,
            data: transactionToSend
        });

        initialPromise = Promise.resolve({
            data: {
                transactionIds,
                pendingCardUpdates: 0,
                credit: store.getters.credit
            }
        });
    } else {
        initialPromise = axios.post(`${config.api}/services/basket`, transactionToSend, store.getters.tokenHeaders);
    }

    return initialPromise
        .then((lastBuyer) => {
            // store last lastBuyer + transactionIds
            store.commit('ADD_HISTORY_TRANSACTION', {
                cardNumber,
                basketToSend,
                date: new Date(),
                transactionIds: lastBuyer.data.transactionIds
            });

            store.commit('ID_BUYER', {
                id    : lastBuyer.data.id,
                credit: store.state.auth.device.event.config.useCardData
                    ? store.getters.credit + lastBuyer.data.pendingCardUpdates
                    : lastBuyer.data.credit,
                firstname: lastBuyer.data.firstname,
                lastname : lastBuyer.data.lastname
            });
            store.commit('CLEAR_BASKET');
            store.commit('REMOVE_RELOADS');
            store.commit('SET_BASKET_STATUS', 'WAITING');
            store.commit('SET_LAST_USER', {
                name  : (store.state.auth.buyer.firstname) ?
                    `${store.state.auth.buyer.firstname} ${store.state.auth.buyer.lastname}` :
                    null,
                credit: store.state.auth.buyer.credit,
                reload: reloaded,
                bought
            });

            store.commit('LOGOUT_BUYER');
        })
        .catch((err) => {
            console.log(err);
            store.commit('SET_BASKET_STATUS', 'ERROR');

            if (err.message === 'Network Error') {
                store.commit('ERROR', { message: 'Server not reacheable' });
            } else {
                store.commit('ERROR', err.response.data);
            }

            return Promise.reject(err);
        });
};
