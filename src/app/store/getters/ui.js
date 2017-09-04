import humanError from '../../utils/humanError';
import isMobile   from '../../utils/isMobile';

export const basketStatus    = state => state.basket.basketStatus;
export const error           = state => humanError(state, state.ui.error);
export const items           = state => state.items.items;
export const lastUser        = state => state.ui.lastUser;
export const loaded          = state => state.ui.dataLoaded;
export const meanOfPayment   = state => state.reload.meanOfPayment;
export const meansOfPayment  = state => state.reload.meansOfPayment;
export const reloadState     = state => state.reload.reloadState;
export const reloadSum       = state => state.reload.reloads.reduce((a, b) => a + b.amount, 0);
export const tab             = state => state.ui.currentTab;
export const tabs            = state => state.ui.tabs;
export const waitingForBuyer = state => state.basket.basketStatus === 'WAITING_FOR_BUYER';
export const tabsItems       = (state) => {
    if (isMobile()) {
        // flatten all tabs on mobile
        return [].concat(...state.items.tabsItems);
    }

    let items = state.items.tabsItems[state.ui.currentTab];

    if (items) {
        items = items.sort((a, b) => {
            console.log(a, b);
            return a.name.localeCompare(b.name);
        });
    }

    return items;
};

export const loginState = (state) => {
    if (state.auth.device.config.doubleValidation) {
        return !state.auth.buyer.isAuth;
    } else if (!state.auth.seller.isAuth) {
        return true;
    } else {
        return false;
    }
}
