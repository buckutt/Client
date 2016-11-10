<template>
    <button
        class="b-sidebar-validate"
        :class="statusClasses"
        @click="validate($event)">
        <i class="b-icon" v-if="basketStatus === 'WAITING'">done_all</i>
        <i class="b-icon" v-if="basketStatus === 'DOUBLE'">sync</i>
        <i class="b-icon" v-if="basketStatus === 'DOING'">query_builder</i>
        <i class="b-icon" v-if="basketStatus === 'ERROR'">error</i>
    </button>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    computed: {
        statusClasses() {
            return {
                'b-sidebar-validate--doing': this.basketStatus === 'DOING',
                'b-sidebar-validate--error': this.basketStatus === 'ERROR'
            };
        },

        ...mapGetters(['basketStatus'])
    },

    methods: {
        validate(e) {
            e.currentTarget.blur();

            if (this.basketStatus === 'DOUBLE') {
                return;
            }

            this.sendBasket();
        },

        ...mapActions(['sendBasket', 'clearBasket'])
    }
};
</script>

<style lang="scss" scoped>
@import '../main';

.b-sidebar-validate {
    background-color: $green;
    border: 0;
    color: #fff;
    cursor: pointer;
    height: 55px;
    line-height: 0;

    > .b-icon {
        font-size: 40px;
    }

    &--doing {
        background-color: $lightorange;
    }

    &--error {
        background-color: $red;
    }
}

</style>
