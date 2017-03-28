import Vue  from 'vue';
import Vuex from 'vuex';

import createLogger from 'vuex/dist/logger';

import * as actions from './actions';
import * as getters from './getters';

import auth   from './modules/auth';
import items  from './modules/items';
import reload from './modules/reload';
import ui     from './modules/ui';
import basket from './modules/basket';

Vue.use(Vuex);

const debug = process.env.NODE_ENV === 'development';

export default new Vuex.Store({
    state: {
        isReloadOpen : false,
        meanOfPayment: 'card',
        paymentStatus: 'WAITING'
    },

    actions,
    getters,
    modules: {
        auth,
        items,
        reload,
        ui,
        basket
    },
    strict : debug,
    plugins: debug ? [createLogger()] : []
});
