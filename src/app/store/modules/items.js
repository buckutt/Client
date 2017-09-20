import promotions from '../../utils/promotions';

const initialState = {
    categories      : [],
    items           : [],
    tabsItems       : [],
    promotions      : [],
    basket          : {
        itemList: [],
        sidebar: {
            items: [],
            promotions: []
        }
    }
};

const mutations = {
    SET_CATEGORIES(state, payload) {
        state.categories = payload;
    },

    SET_ITEMS(state, payload) {
        state.items = payload;
    },

    SET_PROMOTIONS(state, payload) {
        state.promotions = payload;
    },

    ADD_ITEM(state, item) {
        state.basket.itemList.push(item);

        state.basket.sidebar = promotions(state.basket.itemList.slice(), state.promotions.slice());
    },

    REMOVE_ITEM(state, { id }) {
        const index = state.basket.itemList.findIndex(item => item.id === id);

        state.basket.itemList.splice(index, 1);

        state.basket.sidebar = promotions(state.basket.itemList.slice(), state.promotions.slice());
    },

    CLEAR_ITEMS(state) {
        state.items = [];
    },

    CLEAR_CATEGORIES(state) {
        state.categories = [];
    },

    CLEAR_TABSITEMS(state) {
        state.tabsItems = [];
    },

    CLEAR_PROMOTIONS(state) {
        state.promotions = [];
    },

    CLEAR_BASKET(state) {
        state.basket = {
            itemList: [],
            sidebar: {
                items: [],
                promotions: []
            }
        };
    },

    LOGOUT_BUYER(state) {
        state.basket = {
            itemList: [],
            sidebar: {
                items: [],
                promotions: []
            }
        };
    },

    SET_TABS_ITEMS(state, tabsItems) {
        state.tabsItems = tabsItems;
    }
};

export default { state: initialState, mutations };
