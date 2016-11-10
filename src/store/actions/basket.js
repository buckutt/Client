import axios  from 'axios';
import config from '../../config.json';

export const addItemToBasket = (store, item) => {
    store.commit('ADD_ITEM', item);
    store.commit('UPDATE_CREDIT', store.state.auth.buyer.credit - item.price.amount);
};

export const removeItemFromBasket = ({ commit }, item) => {
    commit('REMOVE_ITEM', item);
};

export const clearBasket = ({ commit }) => {
    commit('CLEAR_BASKET');
};

export const sendBasket = (store) => {
    if (store.state.auth.device.config.doubleValidation) {
        if (store.state.basket.basketStatus !== 'DOUBLE') {
            store.commit('SET_BASKET_STATUS', 'DOUBLE');
            return;
        }
    }

    const basketToSend = [];

    let bought   = 0;
    let reloaded = 0;

    store.state.items.basket.forEach((articleId) => {
        const article = store.state.items.items.find(i => i.id === articleId);
        basketToSend.push({
            Buyer_id    : store.state.auth.buyer.id,
            Price_id    : article.price.id,
            Promotion_id: null,
            Seller_id   : store.state.auth.seller.id,
            articles    : [{
                id   : article.id,
                vat  : article.vat,
                price: article.price.id
            }],
            cost: article.price.amount,
            type: 'purchase'
        });

        bought += article.price.amount;
    });

    store.state.items.promotionsBasket.forEach((basketPromo) => {
        const promoId        = basketPromo.id;
        const articlesInside = [];
        const promo          = store.state.items.promotions.find(p => p.id === promoId);

        basketPromo.contents.forEach((articleInside) => {
            const fullArticleInside = store.state.items.items.find(i => i.id === articleInside);
            articlesInside.push({
                id   : articleInside,
                vat  : fullArticleInside.vat,
                price: fullArticleInside.price.id
            });
        });

        basketToSend.push({
            Price_id    : promo.price.id,
            Buyer_id    : store.state.auth.buyer.id,
            Fundation_id: promo.Fundation_id,
            Seller_id   : store.state.auth.seller.id,
            Promotion_id: promo.id,
            articles    : articlesInside,
            cost        : promo.price.amount,
            type        : 'purchase'
        });

        reloaded += promo.price.amount;
    });

    store.state.reload.reloads.forEach((reload) => {
        basketToSend.push({
            credit   : reload.amount,
            trace    : reload.with,
            Buyer_id : store.state.auth.buyer.id,
            Seller_id: store.state.auth.seller.id,
            type     : 'reload'
        });

        reloaded += reload.amount;
    });

    store.commit('SET_BASKET_STATUS', 'DOING');

    axios
        .post(`${config.api}/services/basket`, basketToSend, store.getters.tokenHeaders)
        .then(() => {
            store.commit('CLEAR_BASKET');
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
