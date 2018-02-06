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
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        disabled: { type: Boolean, default: false }
    },

    computed: mapState({
        meanOfPayment : state => state.reload.meanOfPayment,
        meansOfPayment: state => state.reload.meansOfPayment
    }),

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

<style scoped>
@import '../main.css';

.b-reload-methods {
    display: flex;
    justify-content: space-around;
}

.b-reload-methods__method {
    border-radius: 2px;
    color: var(--lightblue);
    cursor: pointer;
    font-size: 14px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    text-transform: uppercase;

    &--disabled {
        box-shadow: none;
        color: color(var(--black) a(0.35));
        pointer-events: none;
    }

    &--active {
        color: #fff;
        cursor: default;
        background-color: var(--lightblue)
    }
}

.b-reload-methods__method--active.b-reload-methods__method--disabled {
    background-color: color(var(--black) a(0.2));
    color: color(var(--black) a(0.35));
}

@media (max-width: 768px) {
    .b-reload-methods__method {
        padding: 0 10px;
    }
}
</style>
