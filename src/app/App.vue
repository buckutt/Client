<template>
    <div
        id="app"
        @click="refocus">
        <topbar :buyer="buyer" :seller="seller" />
        <main class="b-main">
            <login v-show="loginState" ref="login" />
            <history v-if="!loginState && history" ref="history" />
            <items v-if="!loginState && seller.canSell && !history" />
            <sidebar v-if="!loginState && seller.canSell && !history" />
            <assigner v-if="!loginState && seller.canAssign && !history" ref="assign" />
        </main>
        <reload
            v-if="!loginState"
            :reloadOnly="!seller.canSell && seller.canReload" />
        <transition name="b--fade">
            <loading v-if="loaded === false" />
        </transition>
        <alcohol-warning />
        <disconnect-warning :seller="seller" />
        <error />
        <alert v-if="alert" />
        <offline />
        <waiting-for-buyer />
        <Ticket v-if="lastUser.credit && !loginState && !doubleValidation" :user="lastUser" />
        <input
            class="b--out-of-screen"
            type="text"
            ref="input"
            v-model="inputValue"
            :disabled="isCordova"
            @focus="hideVirtualKeyboard"
            autofocus
            @keyup.enter="validate" />
    </div>
</template>

<script>
/* global IS_ELECTRON */
import 'normalize.css';
import { mapActions, mapGetters, mapState } from 'vuex';

import hasEssentials from './utils/offline/hasEssentials';

import Items             from './components/Items';
import Topbar            from './components/Topbar';
import Sidebar           from './components/Sidebar';
import Reload            from './components/Reload';
import Login             from './components/Login';
import Loading           from './components/Loading';
import Error             from './components/Error';
import Alert             from './components/Alert';
import Offline           from './components/Offline';
import Assigner          from './components/Assigner';
import AlcoholWarning    from './components/AlcoholWarning';
import DisconnectWarning from './components/DisconnectWarning';
import WaitingForBuyer   from './components/WaitingForBuyer';
import Ticket            from './components/Ticket';
import History           from './components/History';

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
        Alert,
        Offline,
        Assigner,
        AlcoholWarning,
        DisconnectWarning,
        WaitingForBuyer,
        Ticket,
        History
    },

    data() {
        return {
            inputValue: '',
            isCordova: process.env.TARGET === 'cordova'
        };
    },

    computed: {
        ...mapState({
            buyer           : state => state.auth.buyer,
            seller          : state => state.auth.seller,
            basketStatus    : state => state.basket.basketStatus,
            loaded          : state => state.ui.dataLoaded,
            waitingForBuyer : state => state.basket.basketStatus === 'WAITING_FOR_BUYER',
            lastUser        : state => state.ui.lastUser,
            doubleValidation: state => state.auth.device.config.doubleValidation,
            useCardData     : state => state.auth.device.event.config.useCardData,
            online          : state => state.online.status,
            history         : state => state.history.opened,
            alert           : state => state.auth.alert
        }),

        ...mapGetters(['loginState'])
    },

    methods: {
        refocus() {
            this.$refs.input.focus();
        },

        validate(credit = null) {
            const value = this.inputValue;
            this.inputValue = '';

            if (this.waitingForBuyer || !this.buyer.isAuth) {
                if (this.history) {
                    this.$refs.history.onCard(value, credit);
                } else if (this.seller.canAssign) {
                    this.$refs.assign.onBarcode(value);
                } else {
                    this.$refs.login.validate(value, credit);
                }
            }
        },

        hideVirtualKeyboard() {
            if (process.env.TARGET === 'cordova') {
                setTimeout(() => Keyboard.hide())
            }
        },

        ...mapActions([
            'setupSocket',
            'setSellers',
            'setPoint',
            'setMeansOfPayment',
            'setFullDevice',
            'setEvent',
            'setDefaultItems',
            'setPendingRequests',
            'updateEssentials'
        ])
    },

    mounted() {
        this.setupSocket();

        if (hasEssentials()) {
            this.setPoint(JSON.parse(window.localStorage.getItem('headers')));
            this.setSellers(JSON.parse(window.localStorage.getItem('sellers')));

            if (window.localStorage.hasOwnProperty('meansOfPayment')) {
                this.setMeansOfPayment(JSON.parse(window.localStorage.getItem('meansOfPayment')));
            }

            if (window.localStorage.hasOwnProperty('fullDevice')) {
                this.setFullDevice(JSON.parse(window.localStorage.getItem('fullDevice')));
            }

            if (window.localStorage.hasOwnProperty('event')) {
                this.setEvent(JSON.parse(window.localStorage.getItem('event')));
            }

            if (window.localStorage.hasOwnProperty('defaultItems')) {
                this.setDefaultItems(JSON.parse(window.localStorage.getItem('defaultItems')));
            }
        }

        this.updateEssentials();

        setInterval(() => {
            if (!this.seller.isAuth) {
                this.updateEssentials(true);
            } else {
                this.updateEssentials();
            }
        }, this.seller.canAssign ? 3 * 60 * 1000 : 60 * 1000);

        if (window.localStorage.getItem('pendingRequests')) {
            this.setPendingRequests(JSON.parse(window.localStorage.getItem('pendingRequests')));
        }

        let uid = null;
        let nfc = {
            on() {}
        };

        if (process.env.TARGET === 'electron') {
            const remote = require('electron').remote.getCurrentWindow();
            nfc = remote.nfc;
        } else {
            const NFC = require('../lib/nfc');
            nfc = new NFC();
        }

        window.nfc = nfc;

        if (this.useCardData) {
            nfc.on('uid', (data) => {
                uid = data.toString();
            });

            nfc.on('data', (data) => {
                console.log('nfc-data', nfc.dataToCredit(data.toLowerCase(), config.signingKey));
                // set input value to previous uid
                this.inputValue = uid;
                // adds data/credit to validate
                this.validate(nfc.dataToCredit(data.toLowerCase(), config.signingKey));
            });
        } else {
            nfc.on('uid', (data) => {
                this.inputValue = data;
                this.validate();
            });
        }

        nfc.on('error', (err) => {
            console.error(err);
        });

        window.scan = (inputValue) => {
            this.inputValue = '' + inputValue;
            this.validate();
        };
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
    font-family: 'Roboto';
    src: url(./assets/fonts/Roboto-Medium.woff2) format('woff2');
    font-weight: 500;
    font-style: italic;
}

@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(./assets/icons/MaterialIcons-Regular.woff2) format('woff2');
}
</style>
