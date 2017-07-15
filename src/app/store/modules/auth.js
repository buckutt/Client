const initialState = {
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
            showPicture: null,
            defaultGroup: null
        }
    },
    buyer: {
        isAuth   : false,
        id       : null,
        credit   : 0,
        firstname: null,
        lastname : null,
        groups   : [],
        purchases: []
    },
    seller: {
        isAuth           : false,
        meanOfLogin      : '',
        id               : null,
        token            : null,
        firstname        : null,
        lastname         : null,
        canSell          : false,
        canReload        : false,
        disconnectWarning: false
    }
};

const mutations = {
    SET_DEVICE(state, payload) {
        state.device.id         = payload.id;
        state.device.point      = payload.point;
        state.device.event.id   = payload.event.id;
        state.device.event.name = payload.event.name;
    },

    SET_FULL_DEVICE(state, payload) {
        const keys = ['alcohol', 'doubleValidation', 'showPicture', 'defaultGroup'];

        keys.forEach((key) => {
            state.device.config[key] = payload[key];
        });
    },

    SET_EVENT(state, payload) {
        state.device.event.config = payload.config;
    },

    ID_SELLER(state, meanOfLogin) {
        state.seller.meanOfLogin = meanOfLogin;
    },

    AUTH_SELLER(state, payload) {
        state.seller.isAuth    = true;
        state.seller.id        = payload.id;
        state.seller.token     = payload.token;
        state.seller.firstname = payload.firstname;
        state.seller.lastname  = payload.lastname;
        state.seller.canSell   = payload.canSell;
        state.seller.canReload = payload.canReload;
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
    }
};

export default { state: initialState, mutations };
