export const online              = (state) => state.online.status;
export const defaultOfflineItems = (state) => state.online.defaultItems;
export const pendingRequests     = (state) => state.online.pendingRequests;
export const syncing             = (state) => state.online.syncing;
export const syncProgress        = (state) => state.online.syncProgress;
export const offlineDate         = (state) => state.online.dateToSend;
export const offlineSeller       = (state) => state.online.offline.seller;
export const deviceSellers       = (state) => state.online.offline.sellers;
