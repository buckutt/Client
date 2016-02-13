export default {
    data: {
        error       : false,
        errorMessage: ''
    },

    methods: {
        /**
         * Shows the error modal box
         * @param  {String} message The error message
         */
        throwError (message) {
            this.error        = true;
            this.errorMessage = message;
        },

        /**
         * Closes the error modal box
         */
        closeError () {
            this.error = false;
        }
    }
};
