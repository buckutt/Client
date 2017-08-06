<template>
    <span>{{ amount }}</span>
</template>

<script>
export default {
    props: {
        value: {
            type   : Number,
            default: 0
        },
        input: Array,
        showPlus: Boolean
    },

    computed: {
        amount() {
            let value = this.value / 100;

            if (this.input) {
                value = parseInt(this.input.join(''), 10) / 100;
            }

            const plus = this.showPlus && value > 0 ? '+' : '';

            return `${plus}${value.toFixed(2)}€`;
        }
    }
};
</script>
