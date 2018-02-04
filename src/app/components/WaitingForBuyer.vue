<template>
    <div class="b-waiting-for-buyer" v-if="waitingForBuyer">
        <div
            class="b-waiting-for-buyer__drop"
            @click="cancelBuy"></div>
        <div class="b-waiting-for-buyer__modal">
            <div class="b-waiting-for-buyer__modal__text">
                Approchez la carte cashless
                <span>Gardez le contact jusqu'à la validation du paiement</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: mapState({
        waitingForBuyer: state => state.basket.basketStatus === 'WAITING_FOR_BUYER'
    }),

    methods: {
        cancelBuy() {
            this.$store.dispatch('clearBasket').then(() =>
                this.$store.commit('SET_BASKET_STATUS', 'WAITING')
            );
        }
    }
}
</script>

<style scoped>
@import '../main.css';

.b-waiting-for-buyer__drop {
    @add-mixin modal-drop;
}

.b-waiting-for-buyer__modal {
    @add-mixin modal 350px;

    font-size: 18px;
    font-weight: bold;
    padding: 30px 0;
    text-align: center;
}

.b-waiting-for-buyer__modal__text > span {
    display: inline-block;
    margin: 10px 10px 0;
    font-size: 16px;
    font-weight: normal;
}
</style>
