import countBy from 'lodash.countby';

/**
 * Sanitizes a promotions array to keep only what's need for the algorithm
 * @param  {Array} promotions Array of promotions loaded by AJAX
 * @return {Array} Array sanitized
 */
function sanitizePromotions(promotions) {
    return promotions
        .slice()
        .filter(promotion => !promotion.isRemoved)
        .map((promotion) => {
            promotion.articles = promotion.articles || [];
            promotion.sets     = promotion.sets || [];

            return {
                id      : promotion.id,
                articles: promotion.articles.map(article => article.id),
                sets    : promotion.sets.map(set => set.id)
            };
        });
}

/**
 * Checks if the basket contains article
 * @param  {Array}  basketCopy Basket
 * @param  {String} article    Article id
 * @return {Number} Index of article in basketCopy
 */
function containsArticle(basketCopy, article) {
    return basketCopy.indexOf(article);
}

/**
 * Returns true if article has set; false if article has not the set
 * @param  {Object} state     The view model
 * @param  {String} articleId Article id
 * @param  {String} setId     Set id
 * @return {Boolean} True if article is in the given set
 */
function articleIsFromSet(state, articleId, setId) {
    let found = false;

    const fullSet = state.items.sets.find(set => set.id === setId);

    fullSet.articles.forEach((article) => {
        if (article.id === articleId) {
            found = true;
        }
    });

    return found;
}

/**
 * Check if an article is in the basket with the specified set
 * @param  {Object} state      The view model
 * @param  {Array}  basketCopy Basket
 * @param  {String} set        Set id
 * @return {Number} Index of article in basketCopy
 */
function containsArticleFromSet(state, basketCopy, set) {
    for (let i = 0; i < basketCopy.length; i += 1) {
        const article = basketCopy[i];

        if (articleIsFromSet(state, article, set)) {
            return i;
        }
    }

    return -1;
}

export const sidebar = (state) => {
    let basket        = state.items.basket.slice();
    const promotions_ = sanitizePromotions(state.items.promotions.slice());

    if (promotions_.length === 0) {
        return { items: [], promotions: [] };
    }

    const basketPromotions       = state.items.promotionsBasket.slice();
    let promotionsThatDidntMatch = 0;
    let i                        = 0;

    // Check the first promotion and continues while they all stop matching (promotionsThatDidntMatch)
    do {
        const promotion   = promotions_[i];
        const basketCopy  = basket.slice();
        const basketPromo = [];


        // Count what needs to be found
        let still = promotion.articles.length + promotion.sets.length;

        console.log('Promotion', promotion.id, 'containing', still, 'items');

        // First check if basket contains articles (more precise)
        for (let j = 0; j < promotion.articles.length; j += 1) {
            const articlePromotion = promotion.articles[j];
            const position         = containsArticle(basketCopy, articlePromotion);

            if (position > -1) {
                console.log(`${articlePromotion} is present`);
                // Remove from the temporary basket
                basketCopy.splice(position, 1);
                // And add to the temporary basket for this promotion
                basketPromo.push(articlePromotion);
                still -= 1;
            }
        }

        // Then check if basket contains article that matches set
        for (let j = 0; j < promotion.sets.length; j += 1) {
            const setPromotion = promotion.sets[j];
            const position     = containsArticleFromSet(state, basketCopy, setPromotion);

            if (position > -1) {
                console.log(`${setPromotion} has the good set`);
                // Get back the article id
                const articlePromotion = basketCopy[position];
                // Remove from the temporary basket
                basketCopy.splice(position, 1);
                // And add to the temporary basket for this promotion
                basketPromo.push(articlePromotion);
                still -= 1;
            }
        }

        // still = 0 => everything has been found
        if (still === 0) {
            console.log('Promotion matches');
            basket = basketCopy;
            basketPromotions.push({
                id      : promotion.id,
                contents: basketPromo
            });
        } else {
            console.log('Promotion didnt match');
            promotionsThatDidntMatch += 1;
        }

        // Increases or resets i
        i = (i + 1) % promotions_.length;
    } while (promotionsThatDidntMatch < promotions_.length);

    const basketNames = basket.map(id => state.items.items.find(item => item.id === id).name);

    const namedBasketPromotions = basketPromotions.map(basketPromotion => (
        {
            name: state.items.promotions
                .find(promotion => promotion.id === basketPromotion.id)
                .name,
            items: basketPromotion.contents
                .map(itemId => state.items.items.find(item => item.id === itemId).name)
        }
    ));

    return {
        items     : countBy(basketNames),
        full      : basket,
        promotions: namedBasketPromotions,
        basketPromotions
    };
};

export const cleanBasket = (state) => {
    const sidebarResult = sidebar(state);

    const basket = {
        items     : sidebarResult.full,
        promotions: sidebarResult.basketPromotions,
        reloads   : state.reload.reloads
    };

    return basket;
};

export const credit = (state) => {
    const initialCredit = state.auth.buyer.credit;
    const basket        = cleanBasket(state);

    const items = basket.items
        .map(item => state.items.items.find(i => i.id === item))
        .map(item => item.price.amount)
        .reduce((a, b) => a + b, 0);

    const promotions = basket.promotions
        .map(promo => state.items.promotions.find(p => p.id === promo.id))
        .map(promo => promo.price.amount)
        .reduce((a, b) => a + b, 0);

    const reloads = basket.reloads
        .map(reload => reload.amount)
        .reduce((a, b) => a + b, 0);

    return (initialCredit + reloads) - items - promotions;
};
