import axios from 'axios';

export const dataLoader = (store) => {
    if (store.getters.isDegradedModeActive) {
        return Promise.resolve();
    }

    const token    = store.getters.tokenHeaders;
    const deviceId = store.state.auth.device.id;
    const eventId  = store.state.auth.device.event.id;

    const meansOfPaymentQuery = axios
        .get(`${config.api}/meansofpayment`, token)
        .then((res) => {
            const device = {
                id   : res.headers.device,
                point: {
                    id  : res.headers.point,
                    name: res.headers.pointname
                },
                event : { name: res.headers.eventname, id: res.headers.event },
                config: {}
            };

            store.dispatch('setPoint', device);
            store.dispatch('setMeansOfPayment', res.data);
        });

    const deviceQuery = axios
        .get(`${config.api}/devices/${deviceId}`, token)
        .then(res => res.data);

    const eventQuery = axios
        .get(`${config.api}/events/${eventId}`, token)
        .then((res) => {
            store.dispatch('setEvent', res.data);
        });

    return Promise
        .all([
            deviceQuery,
            eventQuery,
            meansOfPaymentQuery
        ])
        .then(([device]) => {
            store.dispatch('setFullDevice', device);
        })
        .catch((err) => {
            if (err.message === 'Network Error') {
                commit('ERROR', { message: 'Server not reacheable' });
                return;
            }

            store.commit('ERROR', err.response.data);
        });
};

export const loadGroups = (store) => {
    if (!store.state.online.status) {
        if (window.localStorage.hasOwnProperty('groups')) {
            store.commit('SET_GROUPS', JSON.parse(window.localStorage.getItem('groups')));
            return Promise.resolve();
        }

        return Promise.resolve();
    }

    const token = store.getters.tokenHeaders;

    axios
        .get(`${config.api}/groups`, token)
        .then((res) => {
            store.commit('SET_GROUPS', res.data);
            window.localStorage.setItem('groups', JSON.stringify(res.data));
        });
};

export const loadEvent = (store) => {
    if (!store.state.online.status) {
        if (window.localStorage.hasOwnProperty('event')) {
            store.commit('SET_EVENT', JSON.parse(window.localStorage.getItem('event')));
            return Promise.resolve();
        }

        return Promise.resolve();
    }

    const token = store.getters.tokenHeaders;

    axios
        .get(`${config.api}/events/${store.state.auth.device.event.id}`, token)
        .then((res) => {
            store.commit('SET_EVENT', res.data);
            window.localStorage.setItem('event', JSON.stringify(res.data));
        });
};
