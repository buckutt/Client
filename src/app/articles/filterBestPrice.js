import Vue from 'vue';

const now = new Date();

const filterBestPrice = item => {
    item.prices = item.prices.filter(price => (new Date(price.period.start) <= now &&
                                                     now <= new Date(price.period.end)));

    let min         = Infinity;
    let chosenPrice = null;
    item.prices.forEach(price => {
        if (price.amount < min) {
            min         = price.amount;
            chosenPrice = price;
        }
    });

    Vue.set(item, 'price', chosenPrice);

    return item;
};

export default {
    methods: {
        /**
         * Filters the best article price
         */
        filterBestPrice () {
            console.info('Finding prices for articles', this.articles.length);
            this.articles.forEach(article => filterBestPrice(article));

            console.info('Finding prices for promotions', this.promotions.length);
            this.promotions.forEach(promotion => filterBestPrice(promotion));
        }
    }
};
