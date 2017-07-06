const initialState = {
    dataLoaded  : null,
    inputStream : [],
    tabs        : [],
    currentTab  : 0,
    currentTabId: null,
    lastUser    : {
        name  : null,
        bought: 0,
        reload: 0,
        credit: 0
    },
    error: null
};

const mutations = {
    SET_DATA_LOADED(state, loaded = true) {
        state.dataLoaded = loaded;
    },

    APPEND_INPUT_STREAM(state, { key }) {
        state.inputStream.push(key);
    },

    CLEAR_INPUT_STREAM(state) {
        state.inputStream = [];
    },

    SET_TABS(state, payload) {
        state.tabs = payload;
    },

    CHANGE_TAB(state, { tab, index }) {
        state.currentTab   = index;
        state.currentTabId = tab;
    },

    SET_LAST_USER(state, payload) {
        state.lastUser = payload;
    },

    ERROR(state, err) {
        state.dataLoaded = null;
        state.error      = err;
    }
};

export default { state: initialState, mutations };
