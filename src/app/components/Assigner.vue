<template>
    <div class="b-assigner">
        <div class="b-assigner__home">
            <div class="b-assigner__home__button" :class="scanClasses" @click="barcode">
                <img src="../assets/qrcode.png" height="48" width="48" />
                <h3>Scanner un billet</h3>
            </div>
            <div class="b-assigner__home__spacing"></div>
            <div class="b-assigner__home__button" :class="searchClasses" @click="subpage = 'search'">
                <i class="b-icon">person</i>
                <h3>Rentrer un nom</h3>
            </div>
            <div class="b-assigner__home__spacing"></div>
            <div class="b-assigner__home__button" :class="barcodeClasses" @click="subpage = 'barcode'">
                <i class="b-icon">create</i>
                <h3>Rentrer un code-barre</h3>
            </div>
        </div>
        <!-- <create-account v-show="subpage === 'create'"/> -->
        <search v-show="subpage === 'search'" @assign="assignModal"/>
        <barcode v-show="subpage === 'barcode'" @assign="assignModal"/>
        <modal v-show="assignModalOpened" :credit="assignModalCredit" :name="assignModalName" ref="modal" @close="closeModal"/>
        <modal-ok v-if="showOkModal"/>
    </div>
</template>

<script>
import axios                                from 'axios';
import { mapGetters, mapState, mapActions } from 'vuex';

import barcode             from '../../lib/barcode';
import AssignerOfflineData from '../../lib/assignerOfflineData';
// import CreateAccount    from './Assigner-CreateAccount';
import Barcode             from './Assigner-Barcode';
import Search              from './Assigner-Search';
import Modal               from './Assigner-Modal';
import Ok                  from './Assigner-Ok';

export default {
    components: {
        // CreateAccount,
        Search,
        Modal,
        Barcode,
        'modal-ok': Ok
    },

    data() {
        return {
            db: null,
            showOkModal: false,
            assignModalCredit: 0,
            assignModalName: '',
            assignModalId: '',
            assignModalOpened: false,
            subpage: 'search'
        }
    },

    computed: {
        scanClasses() {
            return (this.subpage === 'scan')
                ? 'b-assigner__home__button--active'
                : '';
        },

        searchClasses() {
            return (this.subpage === 'search')
                ? 'b-assigner__home__button--active'
                : '';
        },

        // createClasses() {
        //     return (this.subpage === 'create')
        //         ? 'b-assigner__home__button--active'
        //         : '';
        // },

        barcodeClasses() {
            return (this.subpage === 'barcode')
                ? 'b-assigner__home__button--active'
                : '';
        },

        ...mapState({
            online: state => state.online.status
        }),

        ...mapGetters(['tokenHeaders'])
    },

    methods: {
        assignCard() {
            const mol = {
                user_id: this.assignModalId,
                type   : 'cardId',
                data   : value,
                blocked: false
            };

            if (this.online) {
                axios
                    .post(`${config.api}/meansoflogin`, mol, this.tokenHeaders)
                    .then(() =>
                        axios.post(`${config.api}/services/assigner/groups`, {
                            user: this.assignModalId,
                            groups: this.$refs.modal.activeGroups.map(g => g.id)
                        }, this.tokenHeaders)
                    )
                    .then(() => {
                        window.nfc.write(
                            window.nfc.creditToData(this.assignModalCredit, config.signingKey)
                        );

                        this.ok();
                    })
                    .catch((err) => {
                        if (err.response.data.message === 'Duplicate Entry') {
                            // ignore duplicate entry, write to card anyway
                            window.nfc.write(
                                window.nfc.creditToData(this.assignModalCredit, config.signingKey)
                            );

                            this.ok();
                        }

                        this.$store.commit('ERROR', err.response.data);
                    });
            } else {
                this.addPendingRequest({
                    url : `${config.api}/meansoflogin`,
                    data: mol
                });

                this.addPendingRequest({
                    url: `${config.api}/services/assigner/groups`,
                    body: {
                        user: this.assignModalId,
                        groups: this.$refs.modal.activeGroups.map(g => g.id)
                    }
                });

                window.nfc.write(
                    window.nfc.creditToData(this.assignModalCredit, config.signingKey)
                );

                this.ok();
            }
        },

        ticketScanned(value) {
            if (this.online) {
                axios.get(`${config.api}/services/assigner?ticketId=${value}`, this.tokenHeaders)
                    .then((res) => {
                        if (res.data.credit) {
                            this.assignModal(res.data.credit, res.data.name, res.data.id);
                            return;
                        }

                        this.$store.commit('ERROR', { message: 'Couldn\'t find ticket' });
                    })
                    .catch((err) => {
                        console.error(err);
                        this.$store.commit('ERROR', err.response.data);
                    });
            } else  {
                this.db.findByBarcode(value)
                    .then((users) => {
                        if (users.length === 1) {
                            this.assignModal(users[0].credit, users[0].name, users[0].id);
                            return;
                        }

                        this.$store.commit('ERROR', { message: 'Couldn\'t find ticket' });
                    });
            }
        },

        closeModal() {
            this.assignModalOpened = false;
            this.assignModalCredit = 0;
            this.assignModalName   = '';
            this.assignModalId     = '';
        },

        onBarcode(value) {
            if (this.assignModalOpened) {
                this.assignCard(value);
                return;
            }

            this.ticketScanned(value);
        },

        assignModal(credit, name, id) {
            this.assignModalOpened = true;
            this.assignModalCredit = credit;
            this.assignModalName   = name;
            this.assignModalId     = id;
        },

        barcode() {
            barcode().then(value => this.onBarcode(value));
        },

        ok() {
            this.showOkModal = true;
            this.closeModal();

            setTimeout(() => {
                this.showOkModal = false;
            }, 1500);
        },

        ...mapActions(['addPendingRequest', 'updateEssentials'])
    },

    mounted() {
        this.db = new AssignerOfflineData();

        this.updateEssentials();
        this.db.init();
    }
}
</script>

<style scoped>
.b-assigner {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.b-assigner__home {
    display: flex;
    justify-content: space-around;
    min-height: 170px;
    padding: 10px;

    background-color: #f3f3f3;
}

.b-assigner__home__spacing {
    width: 10px;
}

.b-assigner__home__button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 150px;
    padding: 5px;

    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.3);
    cursor: pointer;
    text-align: center;

    &.b-assigner__home__button--active {
        border: 3px solid #2980b9;
    }

    & > i {
        color: #2980b9;
        font-size: 48px;
    }

    & > h3 {
        margin: 10px 0 0 0;
        text-transform: uppercase;
        color: rgba(0,0,0,0.6);
    }
}

@media(max-width: 768px) {
    .b-assigner__home {
        min-height: 140px;
    }

    .b-assigner__home__button {
        height: 120px;
    }

    .b-assigner__home__button > h3 {
        font-size: 14px;
    }
}
</style>
