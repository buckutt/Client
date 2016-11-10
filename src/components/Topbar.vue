<template>
    <header class="b-header">
        <div class="b-header__user-image" v-if="buyer.isAuth && showBuyerPicture">
            <img src="../assets/placeholder.jpg" height="112" width="112" />
        </div>
        <upper :buyer="buyer" :seller="seller"></upper>
        <div class="b-header__separator"></div>
        <lower :buyer="buyer" :seller="seller"></lower>
    </header>
</template>

<script>
import { mapGetters } from 'vuex';

import Lower from './Topbar-Lower';
import Upper from './Topbar-Upper';

export default {
    props: {
        buyer : { type: Object, required: true },
        seller: { type: Object, required: true }
    },

    components: {
        Lower,
        Upper
    },

    computed: mapGetters(['showBuyerPicture'])
};
</script>

<style lang="scss" scoped>
@import '../main';

.b-header {
    background-color: $blue;
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
</style>
