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
            v-if="buyer.isAuth"
            :reloadOnly="!seller.canSell && seller.canReload"></reload>
        <loading v-if="loaded === false"></loading>
        <alcohol-warning></alcohol-warning>
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

import Items           from './components/Items';
import Topbar          from './components/Topbar';
import Sidebar         from './components/Sidebar';
import Reload          from './components/Reload';
import Login           from './components/Login';
import Loading         from './components/Loading';
import Error           from './components/Error';
import AlcoholWarning  from './components/AlcoholWarning';
import WaitingForBuyer from './components/WaitingForBuyer';

const UPDATE_TEXT = 'Une mise à jour a été effectuée. Recharger pour mettre à jour ? (cela entraînera une déconnexion)';

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
            const value = this.inputValue;
            this.inputValue = '';

            if (this.waitingForBuyer) {
                this.$refs.login.validate(value);
                this.sendBasket();
                return;
            }

            if (!this.buyer.isAuth || !this.buyer.isAuth) {
                this.$refs.login.validate(value);
            }
        },

        ...mapActions(['sendBasket'])
    },

    mounted() {
        if (IS_ELECTRON) {
            const NFC = require('./nfc');
            const nfc = new NFC();

            nfc.on('log', (data) => {
                console.log(data);
            });

            nfc.on('data', (data) => {
                this.inputValue = data.data;
                this.validate();
            });

            nfc.on('error', (err) => {
                console.error(err);
            });

            require('electron').remote.getCurrentWindow().updater.on('update', () => {
                if (window.confirm(UPDATE_TEXT)) {
                    nfc.restartNFC();
                    require('child_process').execSync('yarn install');
                    location.reload(true);
                }
            });
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
