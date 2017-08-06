<template>
    <nav class="b-lower-bar">
        <div class="b-lower-bar__tabs">
            <tab
                v-for="(tab, i) in tabs"
                v-if="!loginState && seller.canSell"
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
            <div class="b-lower-bar__device__event" v-if="loginState">
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

    computed: mapGetters(['point', 'event', 'tabs', 'loginState']),

    components: {
        Tab
    }
};
</script>

<style scoped>
@import '../main.css';

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
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: 10px;
    padding-left: 10px;
}

.b-lower-bar__device__event {
    margin-right: 10px;
}

@media (max-width: 768px) {
    .b-lower-bar__device {
        font-size: 14px;
        height: 35px;
        overflow-x: auto;
        touch-action: pan-x;
        white-space: nowrap;
        width: 100%;
    }

    .b-lower-bar__tabs {
        display: none;
    }

    .b-lower-bar__device__point,
    .b-lower-bar__device__event {
        flex: 1;
        border-left: 0;
        line-height: 35px;
        margin-left: 0;
    }

    .b-lower-bar__device__seller {
        border-left: 0;
        line-height: 35px;
        margin-left: 0;
    }
}
</style>
