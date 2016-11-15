function addPointsAndPrices(pointId, pricesStore, pointsStore) {
    const now = new Date();

    return function iterator(obj, index) {
        /* Filter obj price */
        const prices = obj.prices
            .filter(p => p &&
                new Date(p.period.start) <= now &&
                now <= new Date(p.period.end)
            );

        let min         = Infinity;
        let chosenPrice = null;
        prices.forEach((p) => {
            if (p.amount < min) {
                min         = p.amount;
                chosenPrice = p;
            }
        });

        pricesStore.push({
            index,
            price: chosenPrice
        });

        /* Filter obj point */
        console.log(prices, pointId);
        const point = prices
            .map(p => p.point)
            .find(p => p && !p.isRemoved && p.id === pointId);

        pointsStore.push({
            index,
            point
        });
    };
}

export const filterItems = (store) => {
    const pointId = store.state.auth.device.point.id;

    const itemsPrices = [];
    const itemsPoints = [];

    store.state.items
        .items
        .forEach(addPointsAndPrices(pointId, itemsPrices, itemsPoints));

    const promotionsPrices = [];
    const promotionsPoints = [];

    store.state.items
        .promotions
        .forEach(addPointsAndPrices(pointId, promotionsPrices, promotionsPoints));

    store.commit('SET_ITEMS_PRICES', itemsPrices);
    store.commit('SET_ITEMS_POINTS', itemsPoints);
    store.commit('SET_PROMOTIONS_PRICES', promotionsPrices);
    store.commit('SET_PROMOTIONS_POINTS', promotionsPoints);
};
