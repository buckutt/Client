<template>
    <div
        class="b-login">
        <div v-if="!seller.isAuth">
            <div v-if="seller.meanOfLogin.length > 0" class="b-login__card b-login__card--sellerPassword">
                <div class="b-login__card__title">
                    Connexion vendeur
                </div>
                <div class="b-login__card__password">&nbsp;{{ passwordMask }}&nbsp;</div>
                <div class="b-login__card__input">
                    <numerical-input
                        @changed="maskPassword"
                        @validate="sellerPasswordValidate"></numerical-input>
                </div>
            </div>
            <div v-if="seller.meanOfLogin.length === 0">
                <div class="b-login__card b-login__card--sellerId">
                    En attente d'un vendeur<br/>
                </div>
            </div>
        </div>
        <div v-if="seller.isAuth" class="b-login__card b-login__card--buyerId">
            En attente d'un client
            <div
                class="b-login__card__lastUser"
                v-if="lastUser.name">
                <hr/>
                Dernier client: <strong><span class="b--capitalized">{{ lastUser.name }}</span></strong><br/>
                Achats: <strong><currency :value="lastUser.bought || 0"></currency></strong><br/>
                Rechargement: <strong><currency :value="lastUser.reload || 0"></currency></strong>
            </div>
        </div>
    </div>
</template>

<script>
import axios                      from 'axios';
import { mapActions, mapGetters } from 'vuex';

import Currency                   from './Currency';
import NumericalInput             from './NumericalInput';

export default {
    components: {
        Currency,
        NumericalInput
    },

    data() {
        return {
            authingSeller: false,
            passwordMask : ''
        };
    },

    computed: mapGetters(['buyer', 'seller', 'lastUser']),

    methods: {
        maskPassword(t) {
            clearTimeout(this.timeout);

            if (t.length === 0) {
                this.passwordMask = '';
                return;
            }

            this.passwordMask = '*'.repeat(t.length - 1) + t.slice(-1);

            this.timeout = setTimeout(() => {
                this.passwordMask = '*'.repeat(this.passwordMask.length);
            }, 500);
        },

        validate(cardNumber) {
            if (!this.seller.isAuth && this.seller.meanOfLogin.length === 0) {
                this.sellerId(cardNumber);
            }

            if (this.seller.isAuth) {
                this.setBuyer({
                    cardNumber
                });
            }
        },

        sellerPasswordValidate(password) {
            if (this.authingSeller) {
                return;
            }

            this.authingSeller = true;
            this.passwordMask  = '';

            this.login({
                meanOfLogin: this.seller.meanOfLogin,
                password
            })
            .then(() => {
                this.authingSeller = false;
            });
        },

        ...mapActions({
            sellerId: 'sellerId',
            setBuyer: 'buyer',
            login   : 'login',
            setPoint: 'setPoint'
        })
    },

    mounted() {
        this.timeout = 0;

        axios
            .get(config.api)
            // Not found error
            .catch((err) => {
                console.log(err);
                if (err.message === 'Network Error') {
                    this.$store.commit('ERROR', {
                        message: 'Server not reacheable'
                    });
                    return;
                }

                if (err.response && err.response.data.message === 'Device not found') {
                    this.$store.commit('ERROR', {
                        message: 'Device not found'
                    });
                }

                this.setPoint({
                    id   : err.response.headers.device,
                    point: {
                        id  : err.response.headers.point,
                        name: err.response.headers.pointname
                    },
                    event: {
                        id  : err.response.headers.event,
                        name: err.response.headers.eventname
                    }
                });
            });

        document.body.addEventListener('click', this.refocus, false);
    }
};
</script>

<style lang="scss" scoped>
@import '../main';

.b-login {
    flex: 1;
    font-size: 28px;
    text-align: center;

    > input {
        opacity: 0.5;
        cursor: default;
    }
}

.b-login__card {
    box-shadow: 0 6px 10px rgba($black, 0.3);
    margin: 40px auto;
    max-width: 500px;
    min-height: 100px;

    &--sellerPassword {
        padding: 30px;
    }

    &--sellerId, &--buyerId {
        line-height: 100px;
    }
}

.b-login__card__password {
    border: 1px solid rgba($black, 0.2);
    height: 45px;
    line-height: 45px;
    margin: 20px 0;
}

.b-login__card__lastUser {
    font-size: 18px;
    line-height: 1.5;
    text-align: left;
    padding: 40px;

    > hr {
        border: 0;
        border-top: 1px solid rgba($black, 0.2);
        position: relative;
        top: -35px;
        width: 50px;
    }
}
</style>
