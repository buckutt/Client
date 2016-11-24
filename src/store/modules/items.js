const initialState = {
    categories      : [],
    sets            : [],
    items           : [],
    tabsItems       : [],
    promotions      : [],
    basket          : [],
    promotionsBasket: []
};

const mutations = {
    SET_CATEGORIES(state, payload) {
        state.categories = payload;
    },

    SET_SETS(state, payload) {
        state.sets = payload;
    },

    SET_ITEMS(state, payload) {
        state.items = payload;
    },

    SET_PROMOTIONS(state, payload) {
        state.promotions = payload;
    },

    ADD_ITEM(state, { id }) {
        state.basket.push(id);
    },

    REMOVE_ITEM(state, { id }) {
        const index = state.basket.indexOf(id);
        state.basket.splice(index, 1);
    },

    CLEAR_BASKET(state) {
        state.basket = [];
    },

    ADD_PROMOTION(state, payload) {
        state.promotionsBasket.push(payload);
    },

    REMOVE_PROMOTION(state, { id }) {
        const index = state.basket
            .map(promo => promo.id)
            .indexOf(id);

        state.promotionsBasket.splice(index, 1);
    },

    LOGOUT_BUYER(state) {
        state.basket           = [];
        state.promotionsBasket = [];
    },

    SET_TABS_ITEMS(state, tabsItems) {
        state.tabsItems = tabsItems;
    }
};

export default { state: initialState, mutations };
