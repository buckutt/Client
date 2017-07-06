<template>
    <div class="b-upper-bar">
        <div class="b-upper-bar__buyer" v-if="buyer.isAuth">
            <div class="b-upper-bar__buyer__name">
                <span class="b--capitalized">{{ buyer.firstname }}</span>
                <span class="b--capitalized">{{ buyer.lastname }}</span>
            </div>
            <div class="b-upper-bar__buyer__credit">
                crédit:
                <span :class="{ 'b-upper-bar__buyer__credit--negative': credit < 0 }">
                    <currency :value="credit"></currency>
                </span>
            </div>
        </div>
        <div class="b-upper-bar__date">
            <live-time></live-time>
        </div>
        <div class="b-upper-bar__actions">
            <div
                v-if="seller.isAuth || seller.meanOfLogin.length > 0"
                class="b-upper-bar__actions__action-eject"
                @click="logout">
                <i class="b-icon">eject</i>
            </div>
            <div
                v-if="!loginState && seller.canReload && seller.canSell"
                class="b-upper-bar__actions__action-reload"
                @click="openReloadModal">
                <i class="b-icon">attach_money</i>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Currency from './Currency';
import LiveTime from './Topbar-Upper-Time';

export default {
    props: {
        buyer : { type: Object, required: true },
        seller: { type: Object, required: true }
    },

    components: {
        Currency,
        LiveTime
    },

    computed: mapGetters(['loginState', 'credit']),

    methods: mapActions(['openReloadModal', 'logout'])
};
</script>

<style scoped>
@import '../main.css';

.b-upper-bar__buyer {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    justify-content: center;
    padding-left: 20px;
}

.b-upper-bar {
    display: flex;
    height: 65px;
}

.b-upper-bar__date {
    flex: 1;
    font-size: 32px;
    font-weight: bold;
    line-height: 65px;
    text-align: center;
}

.b-upper-bar__actions {
    display: flex;
    line-height: 65px;

    & > div .b-icon {
        font-size: 28px;
        line-height: 65px;
        margin-right: 20px;
    }
}

.b-upper-bar__actions__action-eject {
    cursor: pointer;
}

.b-upper-bar__actions__action-reload {
    cursor: pointer;
}

.b-upper-bar__buyer__credit--negative {
    color: var(--red);
    font-weight: bold;
}

@media (max-width: 768px) {
    .b-upper-bar {
        height: 45px;
    }

    .b-upper-bar__buyer {
        font-size: 13px;
        padding-left: 10px;
    }

    .b-upper-bar__date {
        font-size: 22px;
        line-height: 45px;
    }

    .b-upper-bar__actions {
        line-height: 45px;

        & > div .b-icon {
            line-height: 45px;
        }

        & > :last-child > .b-icon {
            margin-right: 10px;
        }
    }
}
</style>
