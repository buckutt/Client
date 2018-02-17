<template>
    <div class="b-history">
        <div class="b-history__text" v-if="cardNumber.length === 0">
            Approchez la carte cashless
            <div>Pour visualiser les derniers achats sur cette borne</div>
        </div>
        <div v-else>
            <div class="b-history__text" v-if="entries.length === 0">
                <div>
                    Aucun entrée pour cette carte. Vous pouvez essayer sur une autre carte.
                    <br/>
                    <a href="#" @click.prevent="toggleHistory">Retour au mode vente</a>
                </div>
            </div>
            <div class="b-history__list" v-else>
                <div class="b-history__list__entry" v-for="entry in entries">
                    <span class="b-history__list__entry__date">
                        {{ entry.date }}
                    </span>
                    <span class="b-history__list__entry__reload" v-if="entry.reload">
                        <currency :value="entry.reload" showPlus />
                    </span>
                    <span class="b-history__list__entry__cost">
                        -<currency :value="entry.cost" />
                    </span>
                    <span class="b-history__list__entry__content">
                        <span v-if="entry.firstItem">{{ entry.firstItem }}</span><span v-if="entry.more">, ...</span>
                    </span>
                    <div style="flex: 1;"></div>
                    <button class="b-history__list__entry__button" @click.prevent="selectedEntry = entry">Annuler</button>
                </div>
            </div>
        </div>
        <modal v-if="selectedEntry" ref="modal" @cancel="selectedEntry = null"/>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Modal                    from './History-Modal';
import Currency                 from './Currency';

export default {
    components: {
        Modal,
        Currency
    },

    data() {
        return {
            selectedEntry: null,
            cardNumber: ''
        }
    },

    computed: {
        entries() {
            return this.$store.state.history.history
                .filter(e => e.cardNumber === this.cardNumber)
                .map(e => this.resume(e));
        },

        ...mapState({
            useCardData: state => state.auth.device.event.config.useCardData
        })
    },

    methods: {
        onCard(value, credit) {
            if (this.cardNumber.length === 0) {
                this.cardNumber = value;
                return;
            }

            if (!this.selectedEntry) {
                return;
            }

            if (!Number.isInteger(credit)) {
                credit = 0;
            }

            this
                .cancelEntry(this.selectedEntry)
                .then(() => {
                    if (!credit) {
                        return;
                    }

                    const newCredit = credit + this.creditDifference(this.selectedEntry);

                    if (newCredit < 0) {
                        this.$store.commit('ERROR', { message: 'Not enough credit' });
                        return;
                    }

                    this.removeFromHistory(this.selectedEntry);

                    if (this.useCardData) {
                        window.nfc.write(
                            window.nfc.creditToData(newCredit, config.signingKey)
                        );
                    }

                    this.$refs.modal.ok();

                    setTimeout(() => {
                        this.selectedEntry = null;
                    }, 1500);
                });
        },

        resume(entry) {
            const cost   = entry.basketToSend.filter(e => e.cost).map(e => e.cost).reduce((a, b) => a + b, 0);
            const reload = entry.basketToSend.filter(e => e.credit).map(e => e.credit).reduce((a, b) => a + b, 0);
            const more   = entry.basketToSend.filter(e => e.cost).length > 0;

            let firstItem = entry.basketToSend.find(e => e.cost)

            if (firstItem.promotion_id) {
                firstItem = this.$store.state.items.promotions
                    .find(p => p.id === firstItem.promotion_id)
                    .name;
            } else {
                firstItem = this.$store.state.items.items
                    .find(p => p.id === firstItem.articles[0].id)
                    .name;
            }

            const p = n => n < 10 ? `0${n}` : n.toString();

            let date = `${p(entry.date.getDate())}/${p(entry.date.getMonth() + 1)}`;
            date += '-';
            date += `${p(entry.date.getHours())}:${p(entry.date.getMinutes())}`;

            return {
                cost,
                reload,
                firstItem,
                more,
                date,
                transactionIds: entry.transactionIds
            };
        },

        creditDifference(entry) {
            return -1 * (entry.reload - entry.cost);
        },

        ...mapActions(['toggleHistory', 'cancelEntry', 'removeFromHistory'])
    }
};
</script>

<style>
@import '../main.css';

.b-history {
    background-color: #f3f3f3;
    width: 100vw;
}

.b-history__text {
    font-size: 18px;
    font-weight: bold;
    padding: 30px 5px;
    text-align: center;
}

.b-history__text > div {
    font-size: 16px;
    font-weight: normal;
}

.b-history__text a {
    display: inline-block;
    color: var(--red);
    margin-top: 16px;
    text-decoration: none;
}

.b-history__list {
    margin: 15px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12);
}

.b-history__list__entry {
    display: flex;
    padding: 20px 15px;
    align-items: center;

    &:not(:last-child) {
        border-bottom: 1px solid rgba(0,0,0,.12);
    }
}

.b-history__list__entry__date {
    font-weight: bold;
}

.b-history__list__entry__reload,
.b-history__list__entry__cost,
.b-history__list__entry__content {
    margin-left: 5px;
}

.b-history__list__entry__reload {
    font-weight: bold;
    color: var(--green);
}

.b-history__list__entry__cost {
    font-weight: bold;
    color: var(--orange);
}

.b-history__list__entry__button {
    background: var(--red);
    color: #fff;
    cursor: pointer;
    padding: 5px 10px;
    border: 0;
    border-radius: 3px;
}
</style>
