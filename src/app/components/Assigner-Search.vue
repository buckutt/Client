<template>
    <div class="b-assigner-search">
        <form>
            <input
                type="text"
                name="search"
                @focus="keepFocus"
                @blur="giveFocusBack"
                @keyup="search"
                class="b-assigner-search__input"
                placeholder="Nom"
                v-model="name">

            <h4>Résultats :</h4>
            <div class="b-assigner-search__results" v-show="matches.length > 0">
                <div
                    class="b-assigner-search__results__result"
                    v-for="match in matches"
                    v-if="matches[0].firstname"
                    @click="selectUser(match)">{{ match.firstname }} {{ match.lastname }}</div>
                <div
                    class="b-assigner-search__results__result"
                    v-for="match in matches"
                    v-if="matches[0].name"
                    @click="selectUser(match)">{{ match.name }}</div>
            </div>
            <p v-show="matches.length === 0 && name.length === 0">Cherchez un utilisateur par son nom et son prénom. Trois caractères minimums.</p>
            <p v-show="matches.length === 0 && name.length > 2">Aucun résultat.</p>
        </form>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import debounce from 'lodash.debounce';
import axios from 'axios';

import AssignerOfflineData from '../../lib/assignerOfflineData';

export default {
    data() {
        return {
            db: null,
            name: '',
            matches: []
        };
    },

    computed: {
        ...mapState({
            online: state => state.online.status
        }),

        ...mapGetters(['tokenHeaders'])
    },

    methods: {
        search: debounce(function () {
            if (this.name.length <= 2) {
                return;
            }

            if (this.online) {
                axios.get(`${config.api}/services/manager/searchuser?name=${this.name}`, this.tokenHeaders)
                    .then((res) => {
                        this.matches = res.data;
                    });
            } else {
                this.db.findByName(this.name)
                    .then((users) => {
                        this.matches = users;
                    });
            }
        }, 500),

        selectUser(user) {
            if (this.online) {
                axios.get(`${config.api}/users/${user.id}`, this.tokenHeaders)
                    .then((res) => {
                        this.$emit('assign', res.data.credit, `${res.data.firstname} ${res.data.lastname}`, res.data.id);
                    });
            } else {
                this.$emit('assign', user.credit, user.name, user.id);
            }
        },

        keepFocus() {
            document.querySelector('#app > input').disabled = true;
        },

        giveFocusBack() {
            document.querySelector('#app > input').disabled = false;
        }
    },

    mounted() {
        this.db = new AssignerOfflineData();

        this.db.init();
    }
}
</script>

<style scoped>
@import '../main.css';

.b-assigner-search {
    background-color: #f3f3f3;
    flex: 1;
}

.b-assigner-search h4 {
    text-transform: uppercase;
    color: rgba(0,0,0,.7);
    font-size: 14px;
}

.b-assigner-search > form {
    width: 50%;
    max-width: 500px;
    margin: 40px auto;
}

.b-assigner-search__input {
    display: block;
    width: 100%;
    padding: 10px;
    border-radius: 42px;
    border: 1px solid rgba(0,0,0,.2);

    &:not(:first-child) {
        margin-top: 16px;
    }

    &:focus {
        outline: 0;
        border: 1px solid #2980b9;
    }
}

.b-assigner-search__results {
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 3px;
    margin: 16px 0;
}

.b-assigner-search__results__result {
    padding: 10px;
    cursor: pointer;
}

@media(max-width: 768px) {
    .b-assigner-search > form {
        width: calc(100% - 20px);
        margin: 10px auto;
    }
}
</style>
