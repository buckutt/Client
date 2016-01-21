export default {
    methods: {
        /**
         * Filters the most accurate point
         */
        filterPoint() {
            console.info('Filtering articles', this.articles.length);

            this.articles = this.articles.filter(article => article.points.filterObjId(this.pointId))
        }
    }
}
