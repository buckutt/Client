import Vue from 'vue';

function extract(objs) {
    return objs.map((obj) => {
        const clone = {};

        Object.keys(obj).forEach((key) => {
            clone[key] = obj[key];
        });

        return clone;
    });
}

function addPointsAndPrices(pointId, groups) {
    const now = new Date();

    return function iterator(obj, index, arr) {
        /* Filter obj price */
        const prices = obj.prices
            .filter(p => p &&
                new Date(p.period.start) <= now &&
                now <= new Date(p.period.end)
            )
            .filter(p => groups.indexOf(p.Group_id) > -1);

        let min         = Infinity;
        let chosenPrice = null;
        prices.forEach((p) => {
            if (p.amount < min) {
                min         = p.amount;
                chosenPrice = p;
            }
        });

        Vue.set(arr[index], 'price', chosenPrice);

        /* Filter obj point */
        const point = prices
            .map(p => p.point)
            .find(p => p && !p.isRemoved && p.id === pointId);

        Vue.set(arr[index], 'point', point || null);

        return arr[index];
    };
}

export const filterItems = (store) => {
    const now     = new Date();
    const pointId = store.state.auth.device.point.id;
    const buyer   = store.state.auth.buyer;

    const groups = buyer.groups
        .filter(group => group &&
            new Date(group._through.period.start) <= now &&
            now <= new Date(group._through.period.end)
        )
        .map(group => group.id);

    const items = extract(store.state.items.items)
        .map(addPointsAndPrices(pointId, groups))
        .filter(item => item.price && item.point);

    const promotions = extract(store.state.items.promotions)
        .map(addPointsAndPrices(pointId, groups))
        .filter(promotion => promotion.price && promotion.point);

    store.commit('SET_ITEMS', items);
    store.commit('SET_PROMOTIONS', promotions);
};
