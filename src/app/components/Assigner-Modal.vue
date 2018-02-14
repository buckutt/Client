<template>
    <div class="b-assigner-modal">
        <div
            class="b-assigner-modal__drop"
            @click="cancel"></div>
        <div class="b-assigner-modal__modal">
            <div class="b-assigner-modal__modal__text">
                <div>{{ name }}</div>
                <div><currency :value="credit"/></div>
                <br/>
                Approchez la carte cashless
                <span>Gardez le contact jusqu'à la validation</span>
                <h4 v-if="groups.length > 0">Groupes :</h4>
                <div class="b-assigner-modal__modal__text__groups" v-if="groups.length > 0">
                    <div class="b-assigner-modal__modal__text__groups__group" v-for="group in groups">
                        <input type="checkbox" name="group" class="b--out-of-screen" :id="group.id" v-model="activeGroups" :value="group">
                        <label :for="group.id">
                            {{ group.name }}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Currency     from './Currency';

export default {
    props: {
        name: String,
        credit: Number
    },

    components: {
        Currency
    },

    data() {
        return {
            activeGroups: []
        };
    },

    computed: mapState({
        groups: state => state.auth.groups.filter(group => group.name !== 'Défaut')
    }),

    methods: {
        cancel() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
@import '../main.css';

.b-assigner-modal__drop {
    @add-mixin modal-drop;
}

.b-assigner-modal__modal {
    @add-mixin modal 350px;

    font-size: 18px;
    font-weight: bold;
    padding: 30px 0;
    text-align: center;
}

.b-assigner-modal__modal__text > span {
    display: inline-block;
    margin: 10px 10px 0;
    font-size: 16px;
    font-weight: normal;
}

.b-assigner-modal__modal__text__groups {
    margin-top: 16px;
    background: #fff;
    border-radius: 3px;
}

.b-assigner-modal__modal__text__groups__group {
    & > label {
        display: block;
        width: 100%;
        padding: 10px;
        font-weight: 500;
    }

    & > input:checked + label {
        background-color: #2980b9;
        color: #fff;
    }
}
</style>
