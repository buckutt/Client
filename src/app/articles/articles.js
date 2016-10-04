import { parents, filterObjId } from '../utils';
import Vue from 'vue';

/**
 * Calculate the cost of the basket, including promotion.
 * @param {Vue} vm The view model
 */
const calculateCost = vm => {
    const basketCost = vm.basket
        .map(articleId =>
            filterObjId(vm.articles, articleId).price.amount
        );

    const promoCost = vm.basketPromotions
        .map(basketPromotion =>
            filterObjId(vm.promotions, basketPromotion.id).price.amount
        );

    const totalCost = basketCost
        .concat(promoCost)
        .reduce((a, b) => a + b, 0);

    vm.totalCost = totalCost;
};

export default {
    data: {
        articles        : [],
        promotions      : [],
        sets            : [],
        paymentMethods  : [],
        basket          : [],
        basketPromotions: [],
        totalCost       : 0
    },
    methods: {
        /**
         * Triggers basket change on article click
         * @param  {MouseEvent} e The click event
         */
        onArticleClick (e) {
            console.log('Click on article');
            const $target = parents(e.target, '.buckless-card-image');
            const id      = $target.getAttribute('data-id');

            this.basket.push(id);
            this.checkForPromotions();
            calculateCost(this);

            if ($target.hasAttribute('data-badge')) {
                $target.setAttribute('data-badge', String(parseInt($target.getAttribute('data-badge'), 10) + 1));
            } else {
                $target.setAttribute('data-badge', '1');
                $target.classList.add('mdl-badge');
                $target.classList.add('active');
            }
        },

        /**
         * Triggers basket change on article removal
         * @param  {MouseEvent} e The click event
         */
        onMinusClick (e) {
            console.log('Click on article removal');
            e.stopPropagation();

            const $target = parents(e.target, '.buckless-card-image');
            const badge   = parseInt($target.getAttribute('data-badge'), 10);

            this.revertPromotions();

            Vue.nextTick(() => {
                const id    = $target.getAttribute('data-id');
                const index = this.basket.indexOf(id);

                this.basket.splice(index, 1);

                Vue.nextTick(() => {
                    let check = this.basket.length;
                    while (check--) {
                        this.checkForPromotions();
                    }

                    Vue.nextTick(() => {
                        calculateCost(this);
                    });
                });
            });

            if (badge > 1) {
                $target.setAttribute('data-badge', String(badge - 1));
            } else {
                $target.removeAttribute('data-badge');
                $target.classList.remove('mdl-badge');
                $target.classList.remove('active');
            }
        }
    }
};
