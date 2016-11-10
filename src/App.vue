<template>
    <div
        id="app"
        @click="refocus">
        <topbar :buyer="buyer" :seller="seller"></topbar>
        <main class="b-main">
            <login v-if="!buyer.isAuth" ref="login"></login>
            <items v-if="buyer.isAuth && seller.canSell"></items>
            <sidebar v-if="buyer.isAuth && seller.canSell"></sidebar>
        </main>
        <reload
            v-if="buyer.isAuth || (!seller.canSell && seller.canReload)"
            :reloadOnly="!seller.canSell && seller.canReload"></reload>
        <transition name="b--fade">
            <loading v-if="loaded === false"></loading>
        </transition>
        <error></error>
        <input
            class="b--out-of-screen"
            type="text"
            ref="input"
            autofocus
            @keyup.enter="validate"/>
    </div>
</template>

<script>
import 'normalize.css';
import { mapActions, mapGetters } from 'vuex';

import Items   from './components/Items';
import Topbar  from './components/Topbar';
import Sidebar from './components/Sidebar';
import Reload  from './components/Reload';
import Login   from './components/Login';
import Loading from './components/Loading';
import Error   from './components/Error';

export default {
    name: 'App',

    components: {
        Items,
        Topbar,
        Sidebar,
        Reload,
        Login,
        Loading,
        Error
    },

    computed: mapGetters(['buyer', 'seller', 'basketStatus', 'loaded']),

    methods: {
        refocus() {
            this.$refs.input.focus();
        },

        validate() {
            const value = this.$refs.input.value;
            this.$refs.input.value = '';

            if (this.basketStatus === 'DOUBLE') {
                this.sendBasket();
                return;
            }

            if (!this.buyer.isAuth || !this.buyer.isAuth) {
                this.$refs.login.validate(value);
            }
        },

        ...mapActions(['sendBasket'])
    }
};
</script>

<style lang="scss">
@import 'app';
</style>
