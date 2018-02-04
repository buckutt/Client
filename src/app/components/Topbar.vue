<template>
    <header class="b-header">
        <div class="b-header__user-image" v-if="buyer.isAuth && showPicture">
            <img src="../assets/placeholder.jpg" height="112" width="112" />
        </div>
        <upper :buyer="buyer" :seller="seller"></upper>
        <div class="b-header__separator"></div>
        <lower :buyer="buyer" :seller="seller"></lower>
        <reload v-if="isMobile"></reload>
    </header>
</template>

<script>
import { mapState } from 'vuex';

import isMobile from '../utils/isMobile';

console.log(isMobile)

import Lower from './Topbar-Lower';
import Upper from './Topbar-Upper';
import Reload from './Topbar-Reload';

export default {
    props: {
        buyer : { type: Object, required: true },
        seller: { type: Object, required: true }
    },

    components: {
        Lower,
        Upper,
        Reload
    },

    computed: {
        isMobile() {
            return isMobile();
        },

        ...mapState({
            showPicture: state => state.auth.device.config.showPicture
        })
    }
};
</script>

<style scoped>
@import '../main.css';

.b-header {
    background-color: var(--blue);
    color: #fff;
    height: 112px;
    width: 100%;
}

.b-header__user-image {
    float: left;
    height: 100%;
    width: 112px;
}

.b-header__separator {
    background-color: #fff;
    height: 1px;
    opacity: .1;
}

@media (max-width: 768px) {
    .b-header {
        min-height: 81px;
        height: auto;
    }
}
</style>
