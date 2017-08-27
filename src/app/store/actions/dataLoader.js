import axios from 'axios';
import q     from '../../utils/q';

const notRemoved = q({ field: 'isRemoved', eq: false });

export const dataLoader = (store) => {
    const token   = store.getters.tokenHeaders;
    const eventId = store.state.auth.device.event.id;

    const meansOfPaymentQuery = axios
        .get(`${config.api}/meansofpayment/search?q=${notRemoved}`, token)
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

            store.commit('SET_DEVICE', device);

            store.commit('SET_MEANS_OF_PAYMENT', res.data);
        });

    const devicesQuery = axios
        .get(`${config.api}/devices/search?q=${notRemoved}`, token)
        .then(res => res.data);

    const eventQuery = axios
        .get(`${config.api}/events/${eventId}`, token)
        .then((res) => {
            store.commit('SET_EVENT', res.data);
        });

    return Promise
        .all([
            devicesQuery,
            eventQuery,
            meansOfPaymentQuery
        ])
        .then(([devices]) => {
            const device = devices.find(d => d.id === store.state.auth.device.id);

            store.commit('SET_FULL_DEVICE', device);
        })
        .catch((err) => {
            store.commit('ERROR', err.response.data);
        });
};
