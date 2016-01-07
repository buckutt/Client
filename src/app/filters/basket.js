import { $ } from '../utils';
import Vue from '../../bower_components/vue/dist/vue';

Vue.filter('basket', function () {
    let basket    = {};
    let promotion = {};

    // Articles display
    this.basket.forEach(item => {
        let fullItem = this.articles.filterObjId(item);

        if (!fullItem) {
            return;
        }

        basket[fullItem.name] = (basket.hasOwnProperty(fullItem.name)) ? basket[fullItem.name] + 1 : 1;
    });

    // Promotions display
    this.basketPromotions.forEach(promo => {
        let promotionId        = promo.id;
        let promotionsArticles = promo.contents;

        let fullItem = this.promotions.filterObjId(promotionId);

        if (!fullItem) {
            return;
        }

        // Store more complex structure for promotions
        if (!promotion.hasOwnProperty(fullItem.name)) {
            promotion[fullItem.name] = {
                count   : 0,
                articles: [],
                name    : fullItem.name
            };
        }

        promotion[fullItem.name].count++;
        promotion[fullItem.name].articles.push(...promotionsArticles);
    });

    // Stringify promotions
    promotion = Object.keys(promotion)
        .map(item => {
            let fullName = `${promotion[item].name} x${promotion[item].count}`;
            let template = `<button class="mdl-button mdl-js-button promotionButton" @click="onPromotionExpand">
                                ${fullName}
                            </button>
                            <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect">`;

            template += promotion[item].articles
                .map(articleId => this.articles.filterObjId(articleId))
                .filerUndefined()
                .map(article => `<li class="mdl-menu__item">${article.name}</li>`)
                .join('\n');

            template += '</ul>';

            return template;
        })
        .join(', ');

    // Stringify basket
    basket = Object.keys(basket)
        .map(item => `${item} x${basket[item]}`)
        .join(', ');

    Vue.nextTick(() => {
        let $node = $('.mdl-layout-spacer');

        if ($node) {
            this.$compile($node);
        }
    });

    if (basket === '' && promotion === '') {
        return 'vide';
    }

    let total = '';
    total += (promotion.length > 0) ? promotion : '';
    total += (basket.length > 0) ? basket : '';

    return total;
});
