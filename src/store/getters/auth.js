export const buyer  = state => state.auth.buyer;
export const seller = state => state.auth.seller;
export const point  = state => state.auth.device.point.name;
export const event  = state => state.auth.device.event.name;

export const doubleValidation = state => state.auth.device.config.doubleValidation;
export const showBuyerPicture = state => state.auth.device.config.showPicture;
export const defaultGroup     = state => state.auth.device.config.defaultGroup;

export const tokenHeaders = state => ({
    headers: {
        Authorization: `Bearer ${state.auth.seller.token}`
    }
});

export const warnAlcohol = (state) => {
    if (!state.auth.buyer.id || !state.auth.seller.id) {
        return false;
    }

    const maxAlcohol = state.auth.device.event.config.maxAlcohol;

    if (!maxAlcohol) {
        return false;
    }

    const fromPurchases = state.auth.buyer.purchases
        .filter(p => p.price.period.Event_id === state.auth.device.event.id)
        .map(p => p.alcohol)
        .reduce((a, b) => a + b, 0);

    const fromBasket = state.items.basket
        .map(id => state.items.items.find(item => item.id === id).alcohol)
        .reduce((a, b) => a + b, 0);

    return fromPurchases + fromBasket > maxAlcohol;
};

export const alcoholAmount = (state) => {
    if (!state.auth.buyer.id || !state.auth.seller.id) {
        return false;
    }

    const fromPurchases = state.auth.buyer.purchases
        .filter(p => p.price.period.Event_id === state.auth.device.event.id)
        .map(p => p.alcohol)
        .reduce((a, b) => a + b, 0);

    const fromBasket = state.items.basket
        .map(id => state.items.items.find(item => item.id === id).alcohol)
        .reduce((a, b) => a + b, 0);

    return fromPurchases + fromBasket;
};
