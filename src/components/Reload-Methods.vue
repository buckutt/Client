<template>
    <div class="b-reload-methods">
        <div
            v-for="mean in meansOfPayment"
            class="b-reload-methods__method"
            :class="buttonClasses(mean)"
            @click="changeMeanOfPayment(mean.slug)">
            {{ mean.name }}
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        disabled: { type: Boolean, default: false }
    },

    computed: mapGetters(['meansOfPayment', 'meanOfPayment']),

    methods: {
        buttonClasses(mean) {
            return {
                'b-reload-methods__method--active'  : this.meanOfPayment === mean.slug,
                'b-reload-methods__method--disabled': this.disabled
            };
        },

        ...mapActions(['changeMeanOfPayment'])
    }
};
</script>

<style lang="scss" scoped>
@import '../main';

.b-reload-methods {
    display: flex;
    justify-content: space-around;
}

.b-reload-methods__method {
    border-radius: 2px;
    color: $lightblue;
    cursor: pointer;
    font-size: 14px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    text-transform: uppercase;

    &--disabled {
        box-shadow: none;
        color: rgba($black, 0.35);
        pointer-events: none;
    }

    &--active {
        color: #fff;
        cursor: default;
        background-color: $lightblue
    }
}

.b-reload-methods__method--active.b-reload-methods__method--disabled {
    background-color: rgba($black, 0.2);
    color: rgba($black, 0.35);
}
</style>
