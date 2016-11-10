import humanError from '../../utils/humanError';

export const basketStatus   = state => state.basket.basketStatus;
export const error          = state => humanError(state, state.ui.error);
export const items          = state => state.items.items;
export const lastUser       = state => state.ui.lastUser;
export const loaded         = state => state.ui.dataLoaded;
export const meanOfPayment  = state => state.reload.meanOfPayment;
export const meansOfPayment = state => state.reload.meansOfPayment;
export const reloadState    = state => state.reload.reloadState;
export const reloadSum      = state => state.reload.reloads.reduce((a, b) => a + b.amount, 0);
export const tab            = state => state.ui.currentTab;
export const tabs           = state => state.ui.tabs;
export const tabsItems      = state => state.items.tabsItems[state.ui.currentTab];
