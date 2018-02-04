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

    const fromBasket = state.items.basket.itemList
        .map(item => item.alcohol)
        .reduce((a, b) => a + b, 0);

    return fromPurchases + fromBasket;
};
