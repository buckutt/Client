export const filterItems = (store) => {
    const pointId = store.state.auth.device.point.id;
    const now     = new Date();

    const itemsPrices = [];
    const itemsPoints = [];

    store.state.items
        .items
        .forEach((item, index) => {
            /* Filter item price */
            const prices = item.prices
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

            itemsPrices.push({
                index,
                price: chosenPrice
            });

            /* Filter item point */
            const point = prices
                .map(p => p.point)
                .find(p => p && !p.isRemoved && p.id === pointId);

            itemsPoints.push({
                index,
                point
            });
        });

    store.commit('SET_ITEMS_PRICES', itemsPrices);
    store.commit('SET_ITEMS_POINTS', itemsPoints);
};
