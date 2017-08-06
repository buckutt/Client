<template>
    <button
        class="b-sidebar-validate"
        :class="statusClasses"
        @click="validate($event)">
        <span class="b-sidebar-validate__amount">
            <currency :value="-1 * basketAmount + reloadAmount" :showPlus="true"></currency>
        </span>
        <i class="b-icon" v-if="basketStatus === 'WAITING'">done_all</i>
        <i class="b-icon" v-if="basketStatus === 'DOING' || basketStatus === 'WAITING_FOR_BUYER'">query_builder</i>
        <i class="b-icon" v-if="basketStatus === 'ERROR'">error</i>
    </button>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Currency from './Currency';

export default {
    components: {
        Currency
    },

    computed: {
        statusClasses() {
            return {
                'b-sidebar-validate--doing': this.basketStatus === 'DOING' || this.basketStatus === 'WAITING_FOR_BUYER',
                'b-sidebar-validate--error': this.basketStatus === 'ERROR'
            };
        },

        ...mapGetters(['basketStatus', 'basketAmount', 'reloadAmount'])
    },

    methods: {
        validate(e) {
            e.currentTarget.blur();

            this.sendBasket();
        },

        ...mapActions(['sendBasket', 'clearBasket'])
    }
};
</script>

<style scoped>
@import '../main.css';

.b-sidebar-validate {
    align-items: center;
    background-color: var(--green);
    border: 0;
    color: #000;
    cursor: pointer;
    display: flex;
    height: 55px;
    justify-content: center;
    line-height: 0;

    & > .b-icon {
        font-size: 40px;
    }

    &--doing {
        background-color: var(--lightorange);
    }

    &--error {
        background-color: var(--red);
    }
}

.b-sidebar-validate__amount {
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
}

@media (max-width: 768px) {
    .b-sidebar-validate {
        bottom: 0;
        left: 0;
        position: fixed;
        width: 100%;
    }
}
</style>
