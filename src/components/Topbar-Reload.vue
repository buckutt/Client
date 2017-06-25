<template>
    <div>
        <div class="b-lower-bar__reload" v-if="reloadSum > 0">
            <div class="b-lower-bar__reload__chip">
                Rechargement:&nbsp;<currency :value="reloadSum"></currency>
                <span
                    class="b-lower-bar__reload__chip__remove"
                    @click="removeReloads">
                    <i class="b-icon">delete</i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Currency from './Currency';

export default {
    components: {
        Currency
    },

    computed: mapGetters(['reloadSum']),

    methods: mapActions(['removeReloads'])
}
</script>

<style scoped>
@import '../main';

.b-lower-bar__reload {
    align-items: center;
    border-top: 1px solid color(#fff a(0.1));
    display: flex;
    justify-content: center;
    height: 40px;
    line-height: 40px;
}

.b-lower-bar__reload__chip {
    align-items: center;
    background-color: var(--green);
    border-radius: 2px;
    box-shadow: 0 3px 2px color(var(--black) a(0.25));
    color: #000;
    display: flex;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
}

.b-lower-bar__reload__chip__remove {
    height: 26px;
}
</style>
