<template>
    <div class="b-ticket" :class="{ 'b-ticket--modal': !inline }">
        <div class="b-ticket__modal">
            <hr v-if="inline"/>

            Dernier client :
            <strong v-if="user.name"><span class="b--capitalized">{{ user.name }}</span></strong>

            <br/>

            Achats :
            <strong><currency :value="user.bought || 0"></currency></strong>

            <br/>

            Rechargement :
            <strong><currency :value="user.reload || 0"></currency></strong>

            <br/>

            Nouveau crédit :
            <strong><currency :value="user.credit || 0"></currency></strong>
        </div>
        <div class="b-ticket__drop" @click="close"></div>
    </div>
</template>

<script>
import Currency from './Currency';

export default {
    props: {
        inline: Boolean,
        user: {
            type: Object,
            required: true
        }
    },

    components: {
        Currency
    },

    methods: {
        close() {
            this.$store.commit('SET_LAST_USER', {
                name: '',
                credit: 0,
                reload: 0,
                bought: 0
            });
        }
    }
}
</script>

<style scoped>
@import '../main.css';

.b-ticket__modal {
    font-size: 18px;
    line-height: 1.5;
    text-align: left;
    padding: 40px !important;

    & > hr {
        border: 0;
        border-top: 1px solid color(var(--black) a(0.2));
        position: relative;
        top: -35px;
        width: 50px;
    }
}

.b-ticket--modal {
    & .b-ticket__modal {
        @add-mixin modal 400px;
    }

    & .b-ticket__drop {
        @add-mixin modal-drop;
    }
}
</style>
