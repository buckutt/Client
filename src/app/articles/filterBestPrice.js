import Vue from 'vue';
import { uniq } from '../utils';

const now = new Date();

const filterBestPrice = item => {
    item.prices = item.prices.filter(price =>
        (new Date(price.period.start) <= now && now <= new Date(price.period.end) &&
         !price.isRemoved)
    );

    let min         = Infinity;
    let chosenPrice = null;
    item.prices.forEach(price => {
        if (price.amount < min) {
            min         = price.amount;
            chosenPrice = price;
        }
    });

    console.log('SET PRICE TO', chosenPrice);

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

            this.articles = this.articles.filter(article => article.price);

            console.info('Finding prices for promotions', this.promotions.length);
            this.promotions.forEach(promotion => filterBestPrice(promotion));
        },

        filterCategories () {
            let categories = this.articles
                .filter(a => a.category)
                .map(a => a.category.name);

            // Reverse sort
            categories = uniq(categories).sort((a, b) => 1 - a.localeCompare(b));

            this.categories = categories;
        }
    }
};
