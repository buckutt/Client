<template>
    <div class="b-alcohol-warning" v-if="warnAlcohol">
        Alcool : {{ alcoholAmount }} UA
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: mapGetters(['warnAlcohol', 'alcoholAmount'])
};
</script>

<style scoped>
.b-alcohol-warning {
    align-items: center;
    background-color: #f1c40f;
    bottom: 0;
    color: #d35400;
    display: flex;
    font-size: 32px;
    font-weight: bold;
    height: 55px;
    justify-content: center;
    right: 260px;
    position: absolute;
    width: 250px;
}

@media (max-width: 768px) {
    .b-alcohol-warning {
        width: 100%;
        bottom: 55px;
        right: 0;
    }
}
</style>
