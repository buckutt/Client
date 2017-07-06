<<<<<<< HEAD:src/app/components/Sidebar-Reload.vue
<template>
    <div class="b-sidebar-reload">
        <div class="b-sidebar-reload__amount">
            <span>Rechargement</span>&nbsp;<currency :value="amount"></currency>
        </div>
        <div
            class="b-sidebar-reload__remove"
            @click="removeReloads">
            <i class="b-icon">delete</i>
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
    background-color: var(--green);
    border-radius: 2px;
    box-shadow: 0 3px 2px color(var(--black) a(0.25));
    color: #fff;
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
    cursor: pointer;
    line-height: 0;
}
</style>
=======
<template>
    <div class="b-sidebar-reload">
        <div class="b-sidebar-reload__amount">
            <span>Rechargement</span>&nbsp;<currency :value="amount"></currency>
        </div>
        <div
            class="b-sidebar-reload__remove"
            @click="removeReloads">
            <i class="b-icon">delete</i>
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
@import '../main';

.b-sidebar-reload {
    background-color: var(--green);
    border-radius: 2px;
    box-shadow: 0 3px 2px color(var(--black) a(0.25));
    color: #fff;
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
    cursor: pointer;
    line-height: 0;
}
</style>
>>>>>>> master:src/components/Sidebar-Reload.vue
