import isMobile from '../../utils/isMobile';

export const tabsItems = (state) => {
    if (isMobile()) {
        // flatten all tabs on mobile
        return [].concat(...state.items.tabsItems);
    }

    let items = state.items.tabsItems[state.ui.currentTab];

    if (items) {
        items = items.slice().sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
};

export const basketAmount = (state) => {
    const basket = state.items.basket.sidebar;

    if (!basket.items && !basket.promotions) {
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
