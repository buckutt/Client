import axios from 'axios';
import q     from '../../utils/q';

const notRemoved = q({ field: 'isRemoved', eq: false });

const articlesJoin = q({
    categories: { points: true },
    prices    : {
        fundation: true,
        group    : true,
        period   : true,
        point    : true,
        promotion: true
    }
});

const promotionsJoin = q({
    prices: {
        group : true,
        period: true,
        point : true
    },
    articles: true,
    sets    : { articles: true }
});

const setsJoin = q({ promotion: true, articles: true });

export const dataLoader = (store) => {
    const token = store.getters.tokenHeaders;

    const articlesQuery = axios
        .get(`${config.app.api}/articles/search?q=${notRemoved}&embed=${articlesJoin}`, token)
        .then((res) => {
            const device = {
                id   : res.headers.device,
                point: {
                    id  : res.headers.point,
                    name: res.headers.pointname
                },
                event : res.headers.eventname,
                config: {}
            };

            store.commit('SET_DEVICE', device);
            store.commit('SET_ITEMS', res.data);
        });

    const setsQuery = axios
        .get(`${config.app.api}/sets/search?q=${notRemoved}&embed=${setsJoin}`, token)
        .then((res) => {
            store.commit('SET_SETS', res.data);
        });

    const meansOfPaymentQuery = axios
        .get(`${config.app.api}/meansofpayment/search?q=${notRemoved}`, token)
        .then((res) => {
            store.commit('SET_MEANS_OF_PAYMENT', res.data);
        });

    const devicesQuery = axios
        .get(`${config.app.api}/devices/search?q=${notRemoved}`, token)
        .then(res => res.data);

    const promotionsQuery = axios
        .get(`${config.app.api}/promotions/search?q=${notRemoved}&embed=${promotionsJoin}`, token)
        .then((res) => {
            store.commit('SET_PROMOTIONS', res.data);
        });

    return Promise
        .all([
            devicesQuery,
            articlesQuery,
            setsQuery,
            meansOfPaymentQuery,
            promotionsQuery
        ])
        .then(([devices]) => {
            const device = devices.find(d => d.id === store.state.auth.device.id);

            store.commit('SET_FULL_DEVICE', device);
        })
        .catch((err) => {
            store.commit('ERROR', err.response.data);
        });
};
