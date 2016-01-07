import Vue from '../../bower_components/vue/dist/vue';

/**
 * Calculate the cost of the basket, including promotion.
 * @param {Vue} vm The view model
 */
const calculateCost = vm => {
    let basketCost = vm.basket
        .map(articleId =>
            vm.articles
                .filterObjId(articleId)
                .price
                .amount
        );

    let promoCost = vm.basketPromotions
        .map(basketPromotion =>
            vm.promotions
                .filterObjId(basketPromotion.id)
                .price.amount
        );

    let totalCost = [0] // There must be at least one value to reduce
        .concat(basketCost)
        .concat(promoCost)
        .reduce((a, b) => a + b);

    vm.totalCost = totalCost;
};

export default {
    data  : {
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
        onArticleClick(e) {
            console.log('Click on article');
            let $target = e.target.parents('.buckutt-card-image');
            let id      = $target.getAttribute('data-id');

            this.basket.push(id);
            this.checkForPromotions();
            calculateCost(this);

            if ($target.hasAttribute('data-badge')) {
                $target.setAttribute('data-badge', parseInt($target.getAttribute('data-badge'), 10) + 1 + '');
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
        onMinusClick(e) {
            console.log('Click on article removal');
            e.stopPropagation();

            let $target = e.target.parents('.buckutt-card-image');
            let badge   = parseInt($target.getAttribute('data-badge'), 10);

            this.revertPromotions();

            Vue.nextTick(() => {
                let id      = $target.getAttribute('data-id');
                let index   = this.basket.indexOf(id);

                this.basket.splice(index, 1);
                Vue.nextTick(() => {
                    calculateCost(this);
                });
            });

            if (badge > 1) {
                $target.setAttribute('data-badge', badge - 1 + '');
            } else {
                $target.removeAttribute('data-badge');
                $target.classList.remove('mdl-badge');
                $target.classList.remove('active');
            }
        }
    }
};
