import slug               from 'slug';
import config             from './config';
import { q, filterObjId } from './utils';
import OfflineRequest     from './OfflineRequest';

export default {
    data: {
        articlesLoaded      : false,
        setsLoaded          : false,
        paymentMethodsLoaded: false,
        promotionsLoaded    : false,
        deviceLoaded        : false,
        Point_id             : '',
        deviceId            : '',
        doubleValidation    : false,
        offlineSupport      : false
    },

    methods: {
        /**
         * Loads JSON data
         */
        loadData () {
            this.startedLoading = true;

            // Get the device id and point id from the headers

            const notRemoved = {
                field: 'isRemoved',
                eq   : false
            };

            const articlesJoin = {
                category: true,
                points  : true,
                prices  : {
                    fundation: true,
                    group    : true,
                    period   : true,
                    promotion: true
                }
            };

            const promotionsJoin = {
                price   : true,
                articles: true,
                sets    : {
                    articles: true
                }
            };

            const setsJoin = {
                promotion: true,
                articles : true
            };

            OfflineRequest
                .get(`${config.baseURL}/articles/search?q=${q(notRemoved)}&embed=${q(articlesJoin)}`)
                .then(response => {
                    if (response.status === 401) {
                        throw new Error('Pas de droits vendeurs');
                    }

                    this.deviceId = OfflineRequest.deviceId;
                    this.Point_id  = OfflineRequest.Point_id;

                    this.articlesLoaded = true;
                    this.articles       = response.map(article => {
                        const slugName = slug(article.name, { lower: true, remove: /[.]/g });
                        article.image = `../images/${slugName}.jpg`;
                        return article;
                    });
                    this.filterBestPrice();
                    this.filterPoint();

                    return OfflineRequest.get(`${config.baseURL}/promotions/search?q=${q(notRemoved)}` +
                        `&embed=${q(promotionsJoin)}`);
                })
                .then(response => {
                    this.promotionsLoaded = true;
                    this.promotions       = response;

                    return OfflineRequest.get(`${config.baseURL}/sets/search?q=${q(notRemoved)}&embed=${q(setsJoin)}`);
                })
                .then(response => {
                    this.setsLoaded = true;
                    this.sets       = response;

                    return OfflineRequest.get(`${config.baseURL}/meansofpayment/search?q=${q(notRemoved)}`);
                })
                .then(response => {
                    this.paymentMethodsLoaded = true;
                    this.paymentMethods       = response;

                    return OfflineRequest.get(`${config.baseURL}/devices/search?q=${q(notRemoved)}`);
                })
                .then(response => {
                    this.deviceLoaded = true;
                    this.device       = filterObjId(response, this.deviceId);
                })
                .then(() => {
                    this.startedLoading = false;
                })
                .catch(err => {
                    this.throwError(err.message);
                    this.onEject();
                    setTimeout(() => {
                        this.startedLoading = false;
                    }, 1000);
                });
        }
    }
};
