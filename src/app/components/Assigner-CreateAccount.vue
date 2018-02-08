<template>
    <div class="b-assigner-create-account">
        <form @submit.prevent="createAccount">
            <h4>Informations personnelles :</h4>
            <input
                type="text"
                name="Prénom"
                @focus="keepFocus"
                @blur="giveFocusBack"
                class="b-assigner-create-account__input"
                placeholder="Prénom"
                autocomplete="off"
                v-model="firstname">
            <input
                type="text"
                name="Nom"
                @focus="keepFocus"
                @blur="giveFocusBack"
                class="b-assigner-create-account__input"
                placeholder="Nom"
                autocomplete="off"
                v-model="lastname">
            <h4>Groupes :</h4>
            <div class="b-assigner-create-account__groups">
                <div class="b-assigner-create-account__groups__group" v-for="group in groups">
                    <input type="checkbox" name="group" class="b--out-of-screen" :id="group.id" v-model="groups" :value="activeGroups">
                    <label :for="group.id" @click.prevent.stop="select($event)">
                        {{ group.name }}
                    </label>
                </div>
            </div>
            <button @click.prevent="createAccount">Valider</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import bcrypt from 'bcryptjs';
import pad from 'lodash.padstart';
import { mapState, mapGetters } from 'vuex';

export default {
    data() {
        return {
            firstname: '',
            lastname: '',
            activeGroups: []
        }
    },

    computed: {
        ...mapState({
            groups: state => state.auth.groups.filter(group => group.name !== 'Défaut')
        }),

        ...mapGetters(['tokenHeaders'])
    },

    methods: {
        createAccount()  {
            const pin = pad(Math.floor(Math.random() * 10000), 4, '0');
            const hash = bcrypt.hashSync(pin, 10);

            alert(`Code PIN de l'utilisateur : ${pin}`)

            if (this.firstname.length < 2 || this.lastname.length < 2) {
                return;
            }

            let user;

            axios
                .post(`${config.api}/users`, {
                    firstname: this.firstname,
                    lastname : this.lastname,
                    pin      : hash,
                    password : 'none'
                }, this.tokenHeaders)
                .then((res) => {
                    user = res.data;

                    return Promise.all(this.activeGroups.map((group) => {
                        return axios.post(`${config.api}/users/${user.id}/groups/${group.id}`, {}, this.tokenHeaders);
                    }));
                });
        },

        select(e) {
            // avoid scrolling top
            e.currentTarget.previousElementSibling.checked = !e.currentTarget.previousElementSibling.checked;
        },

        keepFocus() {
            document.querySelector('#app > input').disabled = true;
        },

        giveFocusBack() {
            document.querySelector('#app > input').disabled = false;
        }
    }
}
</script>

<style scoped>
@import '../main.css';

.b-assigner-create-account {
    background-color: #f3f3f3;
    flex: 1;
}

.b-assigner-create-account > form {
    width: 50%;
    max-width: 500px;
    margin: 40px auto;
}

.b-assigner-create-account h4 {
    text-transform: uppercase;
    color: rgba(0,0,0,.7);
}

.b-assigner-create-account__input {
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

.b-assigner-create-account__groups {
    margin-top: 16px;
    background: #fff;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 3px;
}

.b-assigner-create-account__groups__group {
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

.b-assigner-create-account button {
    margin: 32px 0;
    background-color: var(--green);
    color: #fff;
    cursor: pointer;
    border: 0;
    width: 100%;
    font-size: 1.2rem;
    text-transform: uppercase;
    height: 50px;
    border-radius: 25px;
}

@media(max-width: 768px) {
    .b-assigner-create-account > form {
        width: calc(100% - 20px);
        margin: 10px auto;
    }
}
</style>
