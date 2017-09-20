export default (basket, promotions) => {
    const basketPromotions = []

    let promotionsMatching;

    // loop until no promotion is matching
    do {
        promotionsMatching = 0;

        promotions.forEach((promotion) => {
            const container = new Container(basket);

            // Get articles that are in basket
            const matchArticles = promotion.articles
                .map(article => container.pickArticle(article));

            // Get sets that have one item in basket
            const matchSets = promotion.sets
                .map(set => container.pickSet(set.articles));

            // If promotion match
            if (allMatch(matchArticles) && allMatch(matchSets)) {
                // remove content from basket
                basket = container.database;

                // push to promotions array
                basketPromotions.push({
                    ...promotion,
                    content: container.content
                });

                promotionsMatching = promotionsMatching + 1;
            }
        });

    } while (promotionsMatching > 0);

    return {
        items: basket,
        promotions: basketPromotions
    };
}

class Container {
    constructor(database) {
        this.database = database.slice();
        this.content  = [];
    }

    pickArticle(article) {
        if (hasArticle(this.database, article)) {
            this.database = removeFromBasket(this.database, [ article ]);
            this.content.push(article);

            return true;
        }

        return false;
    }

    pickSet(set) {
        const articleMatched = hasSet(this.database, set);

        if (articleMatched) {
            this.database = removeFromBasket(this.database, [ articleMatched ]);
            this.content.push(articleMatched);

            return true;
        }

        return false;
    }
}

function hasArticle(basket, article) {
    // if basket contains article, returns article
    // else return null
    return basket.find(art => art.id === article.id);
}

function hasSet(basket, set) {
    // if basket has one item from set, returns article
    // else return null
    return set.find(
        article => !!hasArticle(basket, article)
    )
}

/**
 * const set = [ { id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'c' } ]
 *
 * removeFromBasket(set, [ { id: 'b' }, { id: 'c' } ])
 *
 * > [ { id: 'a' }, { id: 'd' }, { id: 'c' } ]
 */
function removeFromBasket(basket, articles) {
    const removed = {}

    articles.forEach((article) => {
        removed[article.id] = false;
    });

    return basket.filter((article) => {
        // remove if in articles and if not already removed
        if (hasArticle(articles, article) && !removed[article.id]) {
            removed[article.id] = true;

            return false;
        }

        return true;
    })
}

function allMatch(arr) {
    return arr.reduce((a, b) => a && b, true);
}
