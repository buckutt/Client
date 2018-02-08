const initialState = {
    alert: null,
    device: {
        id   : null,
        point: {
            id  : null,
            name: null
        },
        event: {
            id    : null,
            name  : null,
            config: {}
        },
        config: {
            alcohol: null,
            doubleValidation: null,
            showPicture: null
        },
        DefaultGroup_id: null
    },
    buyer: {
        isAuth     : false,
        id         : null,
        credit     : 0,
        firstname  : null,
        lastname   : null,
        groups     : [],
        purchases  : [],
        meanOfLogin: ''
    },
    seller: {
        isAuth           : false,
        meanOfLogin      : '',
        pin              : null,
        id               : null,
        token            : null,
        firstname        : null,
        lastname         : null,
        canSell          : false,
        canReload        : false,
        canAssign        : false,
        disconnectWarning: false
    },
    groups: []
};

const mutations = {
    SET_DEVICE(state, payload) {
        state.device.id         = payload.id;
        state.device.point      = payload.point;
        state.device.event.id   = payload.event.id;
        state.device.event.name = payload.event.name;
    },

    SET_FULL_DEVICE(state, payload) {
        const keys = ['alcohol', 'doubleValidation', 'showPicture'];

        keys.forEach((key) => {
            state.device.config[key] = payload[key];
        });

        state.device.DefaultGroup_id = payload.DefaultGroup_id
    },

    DISABLE_DOUBLE_VALIDATION(state) {
        state.device.config.doubleValidation = false;
    },

    SET_EVENT(state, payload) {
        const keys = ['maxAlcohol', 'maxPerAccount', 'minReload', 'useCardData'];

        keys.forEach((key) => {
            state.device.event.config[key] = payload[key];
        });
    },

    ID_SELLER(state, meanOfLogin) {
        state.seller.meanOfLogin = meanOfLogin;
    },

    SET_BUYER_MOL(state, payload) {
        state.buyer.meanOfLogin = payload;
    },

    AUTH_SELLER(state, payload) {
        state.seller.isAuth      = true;
        state.seller.meanOfLogin = payload.meanOfLogin;
        state.seller.pin         = payload.pin;
        state.seller.id          = payload.id;
        state.seller.token       = payload.token;
        state.seller.firstname   = payload.firstname;
        state.seller.lastname    = payload.lastname;
        state.seller.canSell     = payload.canSell;
        state.seller.canReload   = payload.canReload;
        state.seller.canAssign   = payload.canAssign;
    },

    SET_GROUPS(state, groups) {
        state.groups = groups;
    },

    UPDATE_TOKEN(state, token) {
        state.seller.token = token;
    },

    ID_BUYER(state, payload) {
        state.buyer.isAuth       = true;
        state.buyer.id           = payload.id;
        state.buyer.credit       = payload.credit;
        state.buyer.firstname    = payload.firstname;
        state.buyer.lastname     = payload.lastname;
        state.buyer.groups       = payload.groups;
        state.buyer.purchases    = payload.purchases;
    },

    LOGOUT_SELLER(state) {
        state.seller.isAuth = false;
    },

    FIRST_LOGOUT_SELLER(state) {
        state.seller.disconnectWarning = true
    },

    REMOVE_LOGOUT_WARNING(state) {
        state.seller.disconnectWarning = false
    },

    LOGOUT_BUYER(state) {
        state.buyer.isAuth = false;
    },

    SET_ALERT(state, alert) {
        state.alert = alert;
    },

    CLOSE_ALERT(state) {
        state.alert = null;
    }
};

export default { state: initialState, mutations };
