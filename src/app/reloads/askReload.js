import { $, parents } from '../utils';

export default {
    data: {
        reloadCreditOpened  : false,
        waitingForValidation: false,
        reloadMethod        : 'card',
        creditToReload      : 0,
        totalReload         : 0,
        detailedReloads     : []
    },

    methods: {
        /**
         * Open the reload modal
         */
        askReload () {
            this.reloadCreditOpened = true;
        },

        /**
         * Closes the reload modal
         */
        closeReloadCredit () {
            this.reloadCreditOpened = false;

            if (this.waitingForValidation) {
                // Fake the event
                this.invalidPayment({
                    target: $('.buttonsGrid').children[0]
                });
            }

            this.waitingForValidation = false;
        },

        /**
         * Selects the payment method
         * @param  {String} slug The method name
         */
        selectReloadMethod (slug) {
            this.reloadMethod = slug;
        },

        /**
         * Clears the reload amount
         */
        onCreditToReloadClearInput () {
            this.creditToReload = 0;
        },

        /**
         * Adds a number to the reload amount (credit card terminal like)
         * @param  {MouseEvent} e The click event
         */
        onCreditToReloadInput (e) {
            const value          = parseInt(parents(e.target, '.mdl-cell').textContent.trim(), 10);
            let creditToReload = this.creditToReload;

            creditToReload = creditToReload * 10 + value * 0.01;
            creditToReload = Math.min(100, creditToReload);
            creditToReload = Math.max(0, creditToReload);

            this.creditToReload = creditToReload;
        },

        /**
         * Validates the amount
         * @param  {MouseEvent} e The click event
         */
        onCreditToReloadValidateInput (e) {
            const grid = parents(e.target, '.mdl-grid');
            this.waitingForValidation              = true;
            grid.style.height                    = 0;
            grid.nextElementSibling.style.height = '122px';
        },

        /**
         * Clears the payment
         * @param  {MouseEvent} e The click event
         */
        invalidPayment (e) {
            const grid = parents(e.target, '.mdl-grid');
            grid.style.height                        = 0;
            grid.previousElementSibling.style.height = '242px';
            this.waitingForValidation                  = false;
        },

        /**
         * Validates the reload
         * @param  {MouseEvent} e The click event
         */
        validateReload (e) {
            const grid = parents(e.target, '.mdl-grid');
            grid.style.height                        = 0;
            grid.previousElementSibling.style.height = '242px';

            this.waitingForValidation = false;
            this.totalReload          = this.totalReload + (this.creditToReload * 100);

            this.detailedReloads.push({
                with  : this.paymentMethods.filter(payment => payment.slug === this.reloadMethod)[0].text,
                amount: this.creditToReload * 100
            });

            setTimeout(() => {
                $('.userCredit').classList.add('showBadge');
            }, 300);

            this.creditToReload     = 0;
            this.reloadCreditOpened = false;
        }
    }
};
