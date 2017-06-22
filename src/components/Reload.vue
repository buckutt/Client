<template>
    <div
        v-if="reloadState !== 'closed' || reloadOnly"
        class="b-reload"
        :class="{ 'b-reload--reloadOnly': reloadOnly }">
        <div
            class="b-reload__drop"
            v-if="!reloadOnly"></div>
        <div class="b-reload__modal">
            <div class="b-reload__modal__topbar">
                <h3 class="b-reload__modal__topbar__title">Rechargement</h3>
                <h3
                    class="b-reload__modal__topbar__cancel"
                    v-if="!reloadOnly"
                    @click="closeReload">
                    Annuler
                </h3>
            </div>
            <div class="b-reload__modal__methods">
                <methods :disabled="reloadState === 'confirm'"></methods>
            </div>
            <div class="b-reload__modal__currency">
                <currency :value="reloadAmount"></currency>
            </div>
            <div v-show="reloadState === 'opened' || reloadOnly">
                <div class="b-reload__modal__numerical-input">
                    <numerical-input
                        @changed="updateCurrency"
                        @validate="confirmReloadModal"
                        ref="input"></numerical-input>
                </div>
            </div>
            <div
                class="b-reload__modal__buttons"
                v-show="reloadState === 'confirm'">
                <button @click="reload">Paiement accepté</button>
                <button @click="cancelReloadModal">Paiement refusé</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Currency       from './Currency';
import Methods        from './Reload-Methods';
import NumericalInput from './NumericalInput';

export default {
    props: {
        reloadOnly: { type: Boolean, required: false, default: false }
    },

    components: {
        Currency,
        Methods,
        NumericalInput
    },

    data() {
        return {
            reloadAmount: 0
        };
    },

    computed: mapGetters(['reloadState']),

    methods: {
        updateCurrency(amount) {
            this.reloadAmount = parseInt(amount || 0, 10);
        },

        closeReload() {
            this.$refs.input.clear();
            this.closeReloadModal();
        },

        reload() {
            this.$store.dispatch('addReload', {
                amount: this.reloadAmount,
                type  : this.$store.state.reload.meanOfPayment,
                trace : ''
            });

            this.closeReload();
        },

        ...mapActions(['confirmReloadModal', 'closeReloadModal', 'addReload', 'cancelReloadModal'])
    }
};
<template>
    <div
        v-if="reloadState !== 'closed' || reloadOnly"
        class="b-reload"
        :class="{ 'b-reload--reloadOnly': reloadOnly }">
        <div
            class="b-reload__drop"
            v-if="!reloadOnly"></div>
        <div class="b-reload__modal">
            <div class="b-reload__modal__topbar">
                <h3 class="b-reload__modal__topbar__title">Rechargement</h3>
                <h3
                    class="b-reload__modal__topbar__cancel"
                    v-if="!reloadOnly"
                    @click="closeReload">
                    Annuler
                </h3>
            </div>
            <div class="b-reload__modal__methods">
                <methods :disabled="reloadState === 'confirm'"></methods>
            </div>
            <div class="b-reload__modal__currency">
                <currency :value="reloadAmount"></currency>
            </div>
            <div v-show="reloadState === 'opened' || reloadOnly">
                <div class="b-reload__modal__numerical-input">
                    <numerical-input
                        @changed="updateCurrency"
                        @validate="confirmReloadModal"
                        ref="input"></numerical-input>
                </div>
            </div>
            <div
                class="b-reload__modal__buttons"
                v-show="reloadState === 'confirm'">
                <button @click="reload">Paiement accepté</button>
                <button @click="cancelReloadModal">Paiement refusé</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Currency       from './Currency';
import Methods        from './Reload-Methods';
import NumericalInput from './NumericalInput';

export default {
    props: {
        reloadOnly: { type: Boolean, required: false, default: false }
    },

    components: {
        Currency,
        Methods,
        NumericalInput
    },

    data() {
        return {
            reloadAmount: 0
        };
    },

    computed: mapGetters(['reloadState']),

    methods: {
        updateCurrency(amount) {
            this.reloadAmount = parseInt(amount || 0, 10);
        },

        closeReload() {
            this.$refs.input.clear();
            this.closeReloadModal();
        },

        reload() {
            this.$store.dispatch('addReload', {
                amount: this.reloadAmount,
                type  : this.$store.state.reload.meanOfPayment,
                trace : ''
            });

            this.closeReload();
        },

        ...mapActions(['confirmReloadModal', 'closeReloadModal', 'addReload', 'cancelReloadModal'])
    }
};
</script>

<style scoped>
@import '../main';

.b-reload--reloadOnly {
    & .b-reload__modal {
        transform: scale(1.2);
        transform-origin: top;
    }
}

.b-reload__drop {
    @add-mixin modal-drop;
}

.b-reload__modal {
    @add-mixin modal 450px;
}

.b-reload__modal__topbar {
    display: flex;
    align-items: center;
    padding: 15px;
}

.b-reload__modal__topbar__title {
    flex: 1;
    font-size: 16px;
    font-weight: normal;
    margin: 0;
}

.b-reload__modal__topbar__cancel {
    color: var(--lightblue);
    cursor: pointer;
    flex: 0;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    text-transform: uppercase;
}

.b-reload__modal__methods {
    margin: 15px auto;
    width: 360px;
}

.b-reload__modal__currency {
    color: color(var(--black) a(0.65));
    font-size: 25px;
    margin-bottom: 15px;
    text-align: center;
}

.b-reload__modal__numerical-input {
    margin: 0 auto 20px auto;
    width: 90%;
}

.b-reload__modal__buttons {
    display: flex;
    flex-direction: column;
    padding: 0 40px 20px 40px;

    & > button {
        border: 0;
        background-color: var(--green);
        border-radius: 2px;
        box-shadow: 0 2px 4px color(var(--black) a(0.25));
        color: #fff;
        cursor: pointer;
        height: 45px;
        text-transform: uppercase;
    }

    & > button:last-child {
        background-color: var(--lightorange);
        margin: 10px 0;
    }
}

@media (max-width: 768px) {
    .b-reload__modal {
        max-width: 310px;
    }

    .b-reload__modal__methods {
        flex-wrap: wrap;
        width: 100%;
    }
}

</style>
