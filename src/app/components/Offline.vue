<template>
    <div class="b-offline" :class="syncingClass" v-if="!online || syncing">
        <div class="b-offline__progress" :style="width"></div>
        <i class="b-icon b-offline__icon">signal_wifi_off</i>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        width() {
            return {
                width: `${this.syncProgress * 100}%`
            }
        },

        syncingClass() {
            return this.syncing ? { 'b-offline-syncing': true } : {}
        },

        ...mapGetters([
            'online',
            'syncing',
            'syncProgress'
        ])
    }
}
</script>

<style scoped>
@import '../main.css';

.b-offline {
    background-color: color(var(--red) a(0.9));
    border-radius: 3px;
    height: 20px;
    left: 3px;
    position: absolute;
    text-align: center;
    top: 3px;
    width: 40px;
}

.b-offline-syncing {
    background-color: color(var(--orange) a(0.9));
}

.b-offline__icon {
    color: #fff;
    font-size: 18px;
    margin-top: 1px;
}

.b-offline__progress {
    background-color: color(#fff a(0.3));
    border-radius: 3px;
    display: inline-block;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 50%;
}
</style>
