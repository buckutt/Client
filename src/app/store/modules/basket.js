const initialState = {
    basketStatus: 'WAITING'
};

const mutations = {
    SET_BASKET_STATUS(state, status) {
        state.basketStatus = status;
    }
};

export default { state: initialState, mutations };
