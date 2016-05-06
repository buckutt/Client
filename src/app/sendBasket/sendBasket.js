import { filterObjId } from '../utils';
import config          from '../config';
import OfflineRequest  from '../OfflineRequest';
import namify          from '../filters/namify';

export default {
    data: {
        loadingBasket  : false,
        notEnoughCredit: false,
        lastCredit     : '',
        lastReload     : '',
        lastUser       : '',
        lastAmount     : ''
    },

    methods: {
        /**
         * Sends the basket to the API
         * @param {Boolean} revalidated Sends basket after correct revalidation
         */
        sendBasket (revalidated) {
            const basketToSend = [];

            if (this.loadingBasket) {
                return;
            }

            if (this.doubleValidation) {
                // revalidated may be a MouseEvent
                if (revalidated !== true) {
                    console.info('Entering double validation mode');
                    this.inputIsForDoubleValidation = true;

                    return;
                }
            }

            this.loadingBasket = true;

            if (this.currentUser.credit + this.totalReload - this.totalCost < 0) {
                setTimeout(() => {
                    this.loadingBasket   = false;
                    this.notEnoughCredit = true;

                    setTimeout(() => {
                        this.notEnoughCredit = false;
                    }, 1000);
                }, 1000);

                return;
            }

            this.basket.forEach(articleId => {
                const article = filterObjId(this.articles, articleId);
                basketToSend.push({
                    Buyer_id    : this.currentUser.id,
                    Price_id    : article.price.id,
                    Promotion_id: null,
                    Seller_id   : this.currentSeller.id,
                    articles    : [article.id],
                    cost        : article.price.amount,
                    type        : 'purchase'
                });
            });

            this.basketPromotions.forEach(basketPromo => {
                const promoId        = basketPromo.id;
                const articlesInside = basketPromo.contents;
                const promo          = filterObjId(this.promotions, promoId);

                basketToSend.push({
                    Price_id    : promo.price.id,
                    Buyer_id    : this.currentUser.id,
                    Fundation_id: promo.Fundation_id,
                    Seller_id   : this.currentSeller.id,
                    Promotion_id: promo.id,
                    articles    : articlesInside,
                    cost        : promo.price.amount,
                    type        : 'purchase'
                });
            });

            this.detailedReloads.forEach(reload => {
                basketToSend.push({
                    credit   : reload.amount,
                    trace    : reload.with,
                    Buyer_id : this.currentUser.id,
                    Seller_id: this.currentSeller.id,
                    type     : 'reload'
                });
            });

            console.info('Basket sending', basketToSend);
            OfflineRequest
                .post(`${config.baseURL}/services/basket`, basketToSend)
                .then(response => {
                    this.loadingBasket = false;

                    if (response.hasOwnProperty('newCredit')) {
                        this.lastCredit = this.totalCost;
                        this.lastReload = this.totalReload;
                        this.lastAmount = this.currentUser.credit - this.totalCost + this.totalReload;
                        this.lastUser   = `${namify(this.currentUser.firstname)} ${namify(this.currentUser.lastname)}`;

                        this.onEject();
                    } else {
                        let error = 'Impossible d\'enregistrer les achats ou de déduire le crédit de l\'utilisateur.' +
                            '<br>';
                        error    += 'Si un rechargement par carte a été effectué, le débit a eu lieu.<br>';
                        error    += 'Vous pouvez réessayer l\'achat ou concacter l\'équipe gérant Buckless.';
                        this.throwError(error);
                    }
                });
        }
    }
};
