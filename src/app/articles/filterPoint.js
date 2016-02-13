import { filterObjId } from '../utils';

export default {
    methods: {
        /**
         * Filters the most accurate point
         */
        filterPoint () {
            console.info('Filtering articles', this.articles.length);

            this.articles = this.articles.filter(article =>
                filterObjId(article.points, this.pointId)
            );
        }
    }
};
