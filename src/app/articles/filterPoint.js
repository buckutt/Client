import { filterObjId } from '../utils';

export default {
    methods: {
        /**
         * Filters the most accurate point
         */
        filterPoint () {
            console.info('Filtering articles', this.articles.length);

            this.articles = this.articles.map(article => {
                article.points = article.prices
                    .map(price => price.point)
                    .filter(point => !point.isRemoved);

                return article;
            });

            this.articles = this.articles.filter(article =>
                filterObjId(article.points, this.Point_id)
            );
        }
    }
};
