const initialState = {
    opened: false,
    history: [],
    pendingCancellations: []
};

const mutations = {
    ADD_HISTORY_TRANSACTION(state, payload) {
        state.history.push(payload);
    },

    ADD_PENDING_CANCELLATION(state, payload) {
        state.pendingCancellations.push(payload);
    },

    REMOVE_FROM_HISTORY(state, payload) {
        state.history.splice(
            state.history.indexOf(payload),
            1
        );
    },

    UPDATE_HISTORY_ENTRY(state, payload) {
        // update history
        let entry;
        let index;

        for (let i = state.history.length - 1; i >= 0; i--) {
            if (state.history[i].transactionIds === payload.transactionId) {
                entry = state.history[i];
                index = i;
            }
        }

        const newHistory = {
            ...entry,
            transactionIds: payload.basketData.transactionIds
        };

        state.history.splice(index, 1, newHistory);

        // update pendingCancellations
        entry = null;
        index = null;

        for (let i = state.pendingCancellations.length - 1; i >= 0; i--) {
            if (state.pendingCancellations[i].transactionIds === payload.transactionId) {
                entry = state.history[i];
                index = i;
            }
        }

        const newPendingCancellation = {
            ...entry,
            transactionIds: payload.basketData.transactionIds
        };

        state.pendingCancellations.splice(index, 1, newHistory);
    },

    TOGGLE_HISTORY(state) {
        state.opened = !state.opened;
    }
};

export default { state: initialState, mutations };
