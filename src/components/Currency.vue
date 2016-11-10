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
        input: Array
    },

    computed: {
        amount() {
            let value = this.value / 100;

            if (this.input) {
                value = parseInt(this.input.join(''), 10) / 100;
            }

            return `${value.toFixed(2)}€`;
        }
    }
};
</script>
