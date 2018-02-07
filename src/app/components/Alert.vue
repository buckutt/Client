<template>
    <div class="b-alert" v-if="alert">
        <div class="b-alert__drop"/>
        <div class="b-alert__modal">
            <h3 class="b-alert__modal__title">Alerte</h3>
            <div class="b-alert__modal__error">
                {{ alert.content }}
            </div>
            <button class="b-alert__modal__close" v-if="timer > 0">J'ai compris ({{ timer }})</button>
            <button
                class="b-alert__modal__close b-alert__modal__close--active"
                @click="closeAlert"
                v-else>J'ai compris</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            timer: 0
        }
    },

    computed: mapState({
        alert: state => state.auth.alert
    }),

    methods: {
        tickTimer() {
            this.timer = Math.max(0, this.timer - 1);

            if (this.timer > 0) {
                setTimeout(() => this.tickTimer(), 1000);
            }
        },

        ...mapActions(['closeAlert'])
    },

    mounted() {
        this.timer = this.alert.minimumViewTime || 5;

        setTimeout(() => this.tickTimer(), 1000);
    }
};
</script>

<style scoped>
@import '../main.css';

.b-alert__drop {
    @add-mixin modal-drop;
    z-index: 1000;
}

.b-alert__modal {
    @add-mixin modal 350px;
    z-index: 10000;

    align-items: flex-start;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    width: calc(100% - 20px);
    max-width: 350px;
    min-height: 100px;
    padding: 20px;
}

.b-alert__modal__title {
    margin-top: 0;
}

.b-alert__modal__close {
    background-color: #95a5a6;
    border: 0;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    height: 36px;
    margin-top: 1em;
    padding: 0 16px;
    pointer-events: none;
    border-radius: 2px;
    font-size: 14px;
    text-transform: uppercase;
    width: 100%;

    &.b-alert__modal__close--active {
        pointer-events: all;
        background-color: #e74c3c;
    }

    &:active, &:focus, &:hover {
        background-color: color(#e74c3c a(0.9));
    }
}
</style>
