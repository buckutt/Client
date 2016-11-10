const initialState = {
    device: {
        id   : null,
        point: {
            id  : null,
            name: null
        },
        event : null,
        config: {}
    },
    buyer: {
        isAuth   : false,
        id       : null,
        credit   : 0,
        firstname: null,
        lastname : null
    },
    seller: {
        isAuth     : false,
        meanOfLogin: '',
        id         : null,
        token      : null,
        firstname  : null,
        lastname   : null,
        canSell    : false,
        canReload  : false
    }
};

const mutations = {
    SET_DEVICE(state, payload) {
        state.device.id    = payload.id;
        state.device.point = payload.point;
        state.device.event = payload.event;
    },

    SET_FULL_DEVICE(state, payload) {
        const keys = ['alcohol', 'doubleValidation', 'realtime', 'refreshInterval', 'showCategories', 'showPicture'];

        keys.forEach((key) => {
            state.device.config[key] = payload[key];
        });
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
        state.buyer.isAuth    = true;
        state.buyer.id        = payload.id;
        state.buyer.credit    = payload.credit;
        state.buyer.firstname = payload.firstname;
        state.buyer.lastname  = payload.lastname;
    },

    LOGOUT_SELLER(state) {
        state.seller.isAuth = false;
    },

    LOGOUT_BUYER(state) {
        state.buyer.isAuth = false;
    },

    UPDATE_CREDIT(state, credit) {
        state.buyer.credit = credit;
    }
};

export default { state: initialState, mutations };
