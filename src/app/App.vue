<template>
    <div
        id="app"
        @click="refocus">
        <topbar :buyer="buyer" :seller="seller"></topbar>
        <main class="b-main">
            <login v-show="loginState" ref="login"></login>
            <items v-if="!loginState && seller.canSell"></items>
            <sidebar v-if="!loginState && seller.canSell"></sidebar>
        </main>
        <reload
            v-if="!loginState"
            :reloadOnly="!seller.canSell && seller.canReload"></reload>
        <transition name="b--fade">
            <loading v-if="loaded === false"></loading>
        </transition>
        <alcohol-warning></alcohol-warning>
        <disconnect-warning :seller="seller"></disconnect-warning>
        <error></error>
        <waiting-for-buyer></waiting-for-buyer>
        <input
            class="b--out-of-screen"
            type="text"
            ref="input"
            v-model="inputValue"
            autofocus
            @keyup.enter="validate"/>
    </div>
</template>

<script>
/* global IS_ELECTRON */
import 'normalize.css';
import { mapActions, mapGetters } from 'vuex';

import Items             from './components/Items';
import Topbar            from './components/Topbar';
import Sidebar           from './components/Sidebar';
import Reload            from './components/Reload';
import Login             from './components/Login';
import Loading           from './components/Loading';
import Error             from './components/Error';
import AlcoholWarning    from './components/AlcoholWarning';
import DisconnectWarning from './components/DisconnectWarning';
import WaitingForBuyer   from './components/WaitingForBuyer';

export default {
    name: 'App',

    components: {
        Items,
        Topbar,
        Sidebar,
        Reload,
        Login,
        Loading,
        Error,
        AlcoholWarning,
        DisconnectWarning,
        WaitingForBuyer
    },

    data() {
        return {
            inputValue: ''
        };
    },

    computed: mapGetters(['buyer', 'seller', 'basketStatus', 'loaded', 'loginState', 'waitingForBuyer']),

    methods: {
        refocus() {
            this.$refs.input.focus();
        },

        validate() {
            const value = this.inputValue.slice(0, 13);
            this.inputValue = '';

            if (this.waitingForBuyer || !this.buyer.isAuth) {
                this.$refs.login.validate(value);
            }
        },

        ...mapActions(['sendBasket'])
    },

    mounted() {
        // TODO : require('./lib/nfc')
        if (process.env.TARGET === 'electron') {
            const remote = require('electron').remote.getCurrentWindow();

            const nfc = remote.nfc.pcsc;

            nfc.on('log', (data) => {
                console.log(data);
            });

            nfc.on('data', (data) => {
                this.inputValue = data;
                this.validate();
            });

            nfc.on('error', (err) => {
                console.error(err);
            });

            // remote.updater.init(); TODO
        }
    }
};
</script>

<style>
@import './app.css';

@font-face {
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-Light.woff2) format('woff2');
    font-weight: 300;
    font-style: normal;
}

@font-face {
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-LightItalic.woff2) format('woff2');
    font-weight: 300;
    font-style: italic;
}

@font-face {
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-Regular.woff2) format('woff2');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-RegularItalic.woff2) format('woff2');
    font-weight: 400;
    font-style: italic;
}

@font-face {
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-Bold.woff2) format('woff2');
    font-weight: 700;
    font-style: normal;
}

@font-face {
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-BoldItalic.woff2) format('woff2');
    font-weight: 700;
    font-style: italic;
}

@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(./assets/icons/MaterialIcons-Regular.woff2) format('woff2');
}
</style>
