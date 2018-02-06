const initialState = {
    status         : false,
    syncing        : false,
    syncProgress   : 0,
    dateToSend     : null,
    pendingRequests: [],
    offline        : {
        sellers     : [],
        defaultItems: {
            articles  : [],
            promotions: []
        }
    }
};

const mutations = {
    SET_ONLINE(state) {
        state.status = true;
    },

    SET_OFFLINE(state) {
        state.status     = false;
        state.dateToSend = new Date();
    },

    SET_SYNCING(state, payload) {
        state.syncing = payload;
    },

    SET_SELLERS(state, payload) {
        state.offline.sellers = payload;
    },

    SET_DEFAULT_ITEMS(state, payload) {
        state.offline.defaultItems = payload;
    },

    PUSH_REQUEST(state) {
        state.syncProgress += 1 / state.pendingRequests.length;

        // round at 0.1
        state.syncProgress = Math.round(state.syncProgress * 10) / 10;
    },

    ADD_PENDING_REQUEST(state, payload) {
        state.pendingRequests.push(payload);
    },

    SET_PENDING_REQUESTS(state, payload) {
        state.pendingRequests = payload;
    },

    CLEAR_PENDING_REQUESTS(state) {
        state.pendingRequests = [];
    }
};

export default { state: initialState, mutations };
