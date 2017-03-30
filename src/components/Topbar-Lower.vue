<template>
    <nav class="b-lower-bar">
        <div class="b-lower-bar__tabs">
            <tab
                v-for="(tab, i) in tabs"
                v-if="buyer.isAuth && seller.canSell"
                :name="tab.name"
                :id="tab.id"
                :key="tab.id"
                :index="i"></tab>
        </div>
        <div class="b-lower-bar__device">
            <div
                v-if="seller.isAuth"
                class="b-lower-bar__device__seller">
                <strong>Vendeur: </strong>
                <span class="b--capitalized">{{ seller.firstname }}</span>
                <span class="b--capitalized">{{ seller.lastname }}</span>
            </div>
            <div class="b-lower-bar__device__point">
                <strong>Point: </strong>
                <span>{{ point }}</span>
            </div>
            <div class="b-lower-bar__device__event">
                <strong>Événement: </strong>
                <span>{{ event }}</span>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex';

import Tab from './Topbar-Lower-Tab';

export default {
    props: {
        buyer : { type: Object, required: true },
        seller: { type: Object, required: true }
    },

    computed: mapGetters(['point', 'event', 'tabs']),

    components: {
        Tab
    }
};
</script>

<style lang="scss" scoped>
@import '../main';

.b-lower-bar {
    display: flex;
    flex-direction: row;
}

.b-lower-bar__tabs {
    display: flex;
    flex: 1;
    height: 46px;
    padding-left: 60px;
}

.b-lower-bar__device {
    align-items: center;
    display: flex;
}

.b-lower-bar__device__seller,
.b-lower-bar__device__point,
.b-lower-bar__device__event {
    height: 100%;
    line-height: 46px;
    border-left: 1px solid rgba(#fff, 0.1);
    margin-left: 10px;
    padding-left: 10px;
}

.b-lower-bar__device__event {
    margin-right: 10px;
}
</style>
