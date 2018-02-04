import humanError from '../../utils/humanError';

export const error     = state => humanError(state, state.ui.error);
export const reloadSum = state => state.reload.reloads.reduce((a, b) => a + b.amount, 0);
export const tabs      = state => state.ui.tabs.slice().sort((a, b) => a.name.localeCompare(b.name));
