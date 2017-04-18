<template>
    <div class="b-alcohol-warning" v-if="warnAlcohol">
        Alerte alcool : {{ alcoholAmount }} UA
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: mapGetters(['warnAlcohol', 'alcoholAmount'])
};
</script>

<style lang="scss" scoped>
.b-alcohol-warning {
    -webkit-text-stroke-color: #c0392b;
    -webkit-text-stroke-width: 1px;
    align-items: center;
    background-color: #f1c40f;
    bottom: 0;
    color: #d35400;
    display: flex;
    font-size: 32px;
    font-weight: bold;
    height: 55px;
    justify-content: center;
    left: 0;
    position: absolute;
    width: calc(100% - 260px);
}
</style>
