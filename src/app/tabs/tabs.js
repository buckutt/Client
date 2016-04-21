import Vue from 'vue';
import { $, $$, uniq } from '../utils';

let articlesParsed = false;

export default {
    data: {
        tab       : 'none',
        categories: []
    },

    methods: {
        /**
         * Change the tab
         * @param  {MouseEvent} e The click event
         */
        onTabClick (e) {
            const target = e.target.parentElement.getAttribute('data-target');
            console.info('New tab', target);
            this.tab = target;
        }
    },

    controller: vm => {
        vm.$watch('tab', newTab => {
            console.log('tab change');
            Vue.nextTick(() => {
                $$('.mdl-tabs__panel').forEach($tab => {
                    $tab.style.display = 'none';
                });

                const $newTab = $(`#${newTab}`);

                if ($newTab) {
                    $newTab.style.display = 'flex';
                }
            });
        });

        vm.$watch('articles', function () {
            if (articlesParsed || this.articles.length === 0) {
                return;
            }
            console.info('Creating categories based on articles');
            articlesParsed = true;

            this.articles = this.articles.map(article => {
                // At this point we're sure that the article should be on the point (thanks to articles/filterPoint)
                // Getting the right category is just filtering thoses that are allowed on this point,
                // and taking the first one

                article.categories = article.categories.filter(category =>
                    category.points.some(point => point.id === this.Point_id)
                );

                article.category = article.categories[0];

                return article;
            });

            let categories = this.articles.map(a => a.category.name);

            // Reverse sort
            categories = uniq(categories).sort((a, b) => 1 - a.localeCompare(b));

            this.categories = categories;
        });
    }
};
