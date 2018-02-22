import axios          from 'axios';
import merge          from 'lodash.merge';
import ioClient       from 'socket.io-client';
import { sendBasket } from './basket';
import q              from '../../utils/q';

let socket = null;

export const setupSocket = (store, token) => {
    if (socket) {
       socket.off('disconnect');
       socket.close();
    }

    let opts = {};

    if (token) {
        opts = {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        };
    }

    if (process.env.TARGET === 'electron') {
        socket = require('electron').remote.getCurrentWindow().io(opts);
    } else {
        socket = ioClient(config.api, { rejectUnauthorized: false, ...opts });
    }

    socket.on('connect', () => {
        store.commit('SET_ONLINE');
        store.dispatch('updateEssentials');
        store.dispatch('reconnect');
        socket.emit('alert');
    });

    socket.on('alert', (alert) => {
        store.commit('SET_ALERT', alert);
    });

    socket.on('disconnect', () => {
        store.commit('SET_OFFLINE');
        store.commit('ERROR', {
            message: 'Server not reacheable'
        });
    });
};

export const reconnect = (store) => {
    if (!store.state.auth.seller.isAuth || !store.state.auth.device.event.config.useCardData) {
        return;
    }

    const storedRequests = store.state.online.pendingRequests;
    const offlineDate    = store.state.online.dateToSend;
    const failedRequests = [];

    store.commit('SET_SYNCING', true);

    const credentials = {
        meanOfLogin: config.loginMeanOfLogin,
        data       : store.state.auth.seller.meanOfLogin,
        pin        : store.state.auth.seller.pin
    };

    let promise = (store.state.auth.seller.token) ?
        Promise.resolve() :
        axios.post(`${config.api}/services/login`, credentials, store.getters.tokenHeaders)
            .then(res => store.commit('UPDATE_TOKEN', res.data.token));

    storedRequests.forEach((request) => {
        promise = promise
            .then(() =>
                axios.post(request.url, request.body, store.getters.tokenHeaders)
            )
            .then((res) => {
                if (request.body.offlineTransactionId) {
                    const transactionId = request.body.offlineTransactionId;

                    store.commit('UPDATE_HISTORY_ENTRY', {
                        transactionId,
                        basketData: res.data
                    });
                }
            })
            .then(() => new Promise((resolve) => {
                    setTimeout(() => resolve(), 150);
                })
            )
            .catch((err) => {
                failedRequests.push(request);
                console.error('Error while resending basket : ', err);
            // })
            // .then(() => {
            //     store.commit('PUSH_REQUEST');
            });
    });

    promise = promise.then(() => store.dispatch('sendValidCancellations'));

    promise = promise.then(() => {
        store.commit('SET_SYNCING', false);
        store.dispatch('setPendingRequests', failedRequests);

        if (failedRequests.length > 0) {
            setTimeout(() => store.dispatch('reconnect'), 3000);
        }
    });

    return promise;
};

export const setSellers = (store, payload) => {
    window.localStorage.setItem('sellers', JSON.stringify(payload));
    store.commit('SET_SELLERS', payload);
};

export const setDefaultItems = (store, payload) => {
    window.localStorage.setItem('defaultItems', JSON.stringify(payload));
    store.commit('SET_DEFAULT_ITEMS', payload);
};

export const addPendingRequest = (store, payload) => {
    store.commit('ADD_PENDING_REQUEST', payload);
    window.localStorage.setItem('pendingRequests', JSON.stringify(store.state.online.pendingRequests));
};

export const setPendingRequests = (store, payload) => {
    if (payload.length > 0) {
        store.commit('SET_PENDING_REQUESTS', payload);
    } else {
        store.commit('CLEAR_PENDING_REQUESTS');
    }

    window.localStorage.setItem('pendingRequests', JSON.stringify(store.state.online.pendingRequests));
};
