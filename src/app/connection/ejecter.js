export default {
    methods: {
        /**
         * Resets variables when user/seller disconnects
         */
        onEject() {
            if (!this.userConnected) {
                console.info('-> Eject seller');
                this.currentSeller       = {};
                this.sellerConnected     = false;
                this.sellerPasswordInput = '';
                this.sellerAuth          = false;

                return;
            }

            console.info('-> Eject user');
            this.currentUser      = {};
            this.userConnected    = false;
            this.basket           = [];
            this.basketPromotions = [];
            this.totalCost        = 0;
            this.totalReload      = 0;
            this.detailedReloads  = [];
            this.reloadMethod     = 'card';
            this.tab              = null;
        }
    }
};
