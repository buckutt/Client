<template>
    <div class="b-error" v-if="error">
        <div
            class="b-error__drop"
            @click="clearError"></div>
        <div class="b-error__modal">
            <h3 class="b-error__modal__title">Erreur</h3>
            <div class="b-error__modal__error">
                {{ error }}
            </div>
            <button
                class="b-error__modal__close"
                @click="clearError">Fermer</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: mapGetters(['error']),

    methods: {
        clearError() {
            // Show green button after error

            this.$store.commit('SET_BASKET_STATUS', 'WAITING');
            this.$store.commit('ERROR', '');
        }
    }
};
</script>

<style scoped>
@import '../main.css';

.b-error__drop {
    @add-mixin modal-drop;
    z-index: 999999;
}

.b-error__modal {
    @add-mixin modal 350px;
    z-index: 9999999;

    align-items: flex-start;
    display: flex;
    flex-direction: column;
    min-height: 100px;
    padding: 20px;
}

.b-error__modal__title {
    margin-top: 0;
}

.b-error__modal__close {
    background-color: #fff;
    border: 0;
    cursor: pointer;
    font-weight: bold;
    height: 36px;
    margin-top: 1em;
    padding: 0 16px;
    border-radius: 2px;
    font-size: 14px;
    text-transform: uppercase;
    width: 100%;

    &:active, &:focus, &:hover {
        background-color: color(var(--black) a(0.3));
    }
}
</style>
