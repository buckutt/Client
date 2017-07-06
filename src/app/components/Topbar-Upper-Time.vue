<template>
    <span>{{ hours }}:{{ minutes }}</span>
</template>

<script>
function p2(n) {
    return (n < 10) ? `0${n}` : n.toString();
}

export default {
    data() {
        const now = new Date();

        return {
            hours  : p2(now.getHours()),
            minutes: p2(now.getMinutes())
        };
    },

    mounted() {
        this.update();
    },

    methods: {
        update() {
            const now = new Date();

            this.live = setTimeout(() => this.update(), 1000);

            this.hours   = p2(now.getHours());
            this.minutes = p2(now.getMinutes());
        }
    }
};
</script>
