import axios                    from 'axios';
import q                        from '../../utils/q';
import filterIsRemovedRecursive from '../../utils/filterIsRemovedRecursive';

const notRemoved = q({ field: 'isRemoved', eq: false });

const articlesJoin = {
    categories: { points: true },
    prices    : {
        fundation: true,
        group    : true,
        period   : true,
        point    : true,
        promotion: true
    }
};

const promotionsJoin = {
    prices: {
        group : true,
        period: true,
        point : true
    },
    articles: true,
    sets    : { articles: true }
};

const setsJoin = { promotion: true, articles: true };

export const dataLoader = (store) => {
    const token      = store.getters.tokenHeaders;
    const isReloader = !store.getters.seller.canSell && store.getters.seller.canReload;

    const articlesQuery = isReloader ? Promise.resolve() : axios
        .get(`${config.app.api}/articles/search?q=${notRemoved}&embed=${q(articlesJoin)}`, token)
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
            store.commit('SET_ITEMS', res.data.map(article => filterIsRemovedRecursive(article, articlesJoin)));
        });

    const setsQuery = isReloader ? Promise.resolve() : axios
        .get(`${config.app.api}/sets/search?q=${notRemoved}&embed=${q(setsJoin)}`, token)
        .then((res) => {
            store.commit('SET_SETS', res.data.map(set => filterIsRemovedRecursive(set, setsJoin)));
        });

    const meansOfPaymentQuery = axios
        .get(`${config.app.api}/meansofpayment/search?q=${notRemoved}`, token)
        .then((res) => {
            store.commit('SET_MEANS_OF_PAYMENT', res.data);
        });

    const devicesQuery = axios
        .get(`${config.app.api}/devices/search?q=${notRemoved}`, token)
        .then(res => res.data);

    const promotionsQuery = isReloader ? Promise.resolve() : axios
        .get(`${config.app.api}/promotions/search?q=${notRemoved}&embed=${q(promotionsJoin)}`, token)
        .then((res) => {
            store.commit('SET_PROMOTIONS', res.data
                .map(promotion => filterIsRemovedRecursive(promotion, promotionsJoin)
            ));
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
