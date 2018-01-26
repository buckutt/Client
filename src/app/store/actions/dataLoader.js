import axios from 'axios';

export const dataLoader = (store) => {
    if (!store.getters.online) {
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
            store.commit('ERROR', err.response.data);
        });
};
