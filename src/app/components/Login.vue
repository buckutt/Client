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
        <div v-if="seller.isAuth && doubleValidation" class="b-login__card b-login__card--buyerId">
            En attente d'un client
            <Ticket v-if="lastUser.name" :inline="true" :user="lastUser"></Ticket>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Ticket         from './Ticket';
import NumericalInput from './NumericalInput';

export default {
    components: {
        NumericalInput,
        Ticket
    },

    data() {
        return {
            authingSeller: false,
            passwordMask : ''
        };
    },

    computed: mapState({
        buyer           : state => state.auth.buyer,
        seller          : state => state.auth.seller,
        lastUser        : state => state.ui.lastUser,
        doubleValidation: state => state.auth.device.config.doubleValidation,
        point           : state => state.auth.device.point.name
    }),

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

        validate(cardNumber, credit) {
            if (!this.seller.isAuth && this.seller.meanOfLogin.length === 0) {
                this.sellerId(cardNumber);
            }

            console.log('login-validate', cardNumber, credit)
            if (this.seller.isAuth) {
                if (Number.isInteger(credit)) {
                    this.setBuyer({
                        cardNumber,
                        credit
                    });
                } else {
                    this.setBuyer({
                        cardNumber
                    });
                }
            }
        },

        sellerPasswordValidate(password) {
            if (this.authingSeller) {
                return;
            }

            this.authingSeller = true;
            this.passwordMask  = '';

            this
                .login({
                    meanOfLogin: this.seller.meanOfLogin,
                    password
                })
                .then(() => {
                    this.authingSeller = false;
                });
        },

        ...mapActions({
            sellerId        : 'sellerId',
            setBuyer        : 'buyer',
            login           : 'login'
        })
    },

    mounted() {
        this.timeout = 0;

        document.body.addEventListener('click', this.refocus, false);
    }
};
</script>

<style scoped>
@import '../main.css';

.b-login {
    flex: 1;
    font-size: 28px;
    text-align: center;
    background-color: #f3f3f3;

    & > input {
        opacity: 0.5;
        cursor: default;
    }
}

.b-login__card {
    background-color: #fff;
    box-shadow: 0 2px 4px color(var(--black) a(0.3));
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
    border: 1px solid color(var(--black) a(0.2));
    height: 45px;
    line-height: 45px;
    margin: 20px 0;
}

@media (max-width: 768px) {
    .b-login {
        font-size: 22px;
    }

    .b-login__card {
        margin: 20px auto;
        max-width: 280px;
        min-height: 80px;
        padding: 15px;

        &--sellerId, &--buyerId {
            line-height: 80px;
        }
    }

    .b-login__card__password {
        height: 25px;
        font-size: 18px;
        line-height: 25px;
        margin: 10px 0;
    }
}
</style>
