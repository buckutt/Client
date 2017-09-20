export const sidebar = (state) => state.items.basket.sidebar;

export const basketAmount = (state) => {
    const basket = state.items.basket.sidebar;

    if (!state.ui.dataLoaded) {
        return 0;
    }

    const items = (basket.items || [])
        .map(item => item.price.amount)
        .reduce((a, b) => a + b, 0);

    const promotions = (basket.promotions || [])
        .map(promotion => promotion.price.amount)
        .reduce((a, b) => a + b, 0);

    return items + promotions;
};

export const reloadAmount = (state) => {
    return state.reload.reloads
        .map(reload => reload.amount)
        .reduce((a, b) => a + b, 0);
};

export const credit = (state) => {
    const initialCredit = state.auth.buyer.credit;
    const reloads       = reloadAmount(state);
    const basketCost    = basketAmount(state);

    return (initialCredit + reloads) - basketCost;
};
