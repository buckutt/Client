<template>
    <div class="b-items">
        <item
            v-for="item in tabsItems"
            :item="item"
            :key="item.id"></item>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Item from './Items-Item';

export default {
    computed: mapGetters(['tabsItems']),

    components: {
        Item
    }
};
</script>

<style lang="scss" scoped>
.b-items {
    align-content: flex-start;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    padding: 10px;
}
</style>
