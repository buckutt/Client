<template>
    <div class="b-sidebar-reload">
        <div
            class="b-sidebar-reload__remove"
            @click="removeReloads">
        </div>
        <div class="b-sidebar-reload__amount">
            <span>Rechargement</span>&nbsp;<currency :value="amount"></currency>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import Currency from './Currency';

export default {
    components: {
        Currency
    },

    props: {
        amount: { type: Number, required: true }
    },

    methods: mapActions(['removeReloads'])
};
</script>

<style scoped>
@import '../main.css';

.b-sidebar-reload {
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 3px 2px color(var(--black) a(0.25));
    display: flex;
    font-size: 18px;
    margin: 10px;
    padding: 10px;

    &:not(:first-child) {
        margin-top: 0;
    }
}

.b-sidebar-reload__amount {
    display: flex;
    flex: 1;
    align-items: center;
}

.b-sidebar-reload__remove {
    background-color: var(--orange);
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    margin-right: 5px;
    position: relative;
    width: 30px;

    &:after {
        background-color: #fff;
        content: ' ';
        height: 3px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
    }
}
</style>
