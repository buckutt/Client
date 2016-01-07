import Vue from '../../bower_components/vue/dist/vue';

const now = new Date();

const filterBestPriceArticle = article => {
    article.prices = article.prices.filter(price => (new Date(price.period.start) <= now &&
                                                     now <= new Date(price.period.end)));

    let min         = Infinity;
    let chosenPrice = null;
    article.prices.forEach(price => {
        if (price.amount < min) {
            min         = price.amount;
            chosenPrice = price;
        }
    });

    Vue.set(article, 'price', chosenPrice);

    return article;
};

export default {
    methods: {
        /**
         * Filters the best article price
         */
        filterBestPrice() {
            console.info('Finding prices', this.articles.length);
            this.articles.forEach(article => filterBestPriceArticle(article));
        }
    }
};
