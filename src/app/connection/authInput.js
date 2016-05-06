import OfflineRequest from '../OfflineRequest';
import config         from '../config';
import { parents }    from '../utils';

let authingUser = false;

export default {
    data: {
        sellerPasswordInput: '',
        wrongSellerPassord : false
    },
    methods: {
        /**
         * Adds value to password input when key is pressed
         * @param  {KeyboardEvent} e The key press event
         */
        onPasswordInput (e) {
            console.log('Password key input');
            const value              = parents(e.target, '.mdl-cell').textContent.trim();
            this.sellerPasswordInput = this.sellerPasswordInput + value;
        },

        /**
         * Clears password input when clear button is pressed
         */
        onClearInput () {
            console.log('Password clear input');
            this.sellerPasswordInput = '';
        },

        /**
         * Checks the seller when validating password
         */
        onValidateInput () {
            if (authingUser) {
                return;
            }

            authingUser = true;

            console.log('Password validate input');

            OfflineRequest
                .post(`${config.baseURL}/services/login`, {
                    meanOfLogin: config.loginMol,
                    data       : this.sellerCardNum.trim(),
                    pin        : this.sellerPasswordInput
                })
                .then(response => {
                    authingUser = false;

                    if (response.status === 404) {
                        this.throwError('Vendeur inconnu');

                        return this.onEject();
                    } else if (response.status === 401) {
                        this.sellerPasswordInput = '';

                        return this.throwError('Mot de passe invalide');
                    }

                    this.currentSeller = response.user;
                    OfflineRequest.setBearer(response.token);

                    this.sellerCardNum       = '';
                    this.sellerPasswordInput = '';
                    this.sellerConnected     = true;
                    this.sellerCanReload     = true;
                    this.sellerAuth          = true;

                    this.loadData();
                })
                .catch(e => {
                    if (e.type === 'error') {
                        this.throwError('Impossible de se connecter');

                        return this.onEject();
                    }
                });
        }
    }
};
