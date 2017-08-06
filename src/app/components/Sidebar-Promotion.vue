<template>
    <div class="b-sidebar-promotion" @click="toggleDetails">
        <div class="b-sidebar-promotion__row">
            <div class="b-sidebar-promotion__minus"
                 @click.stop="remove()"></div>
            <div class="b-sidebar-promotion__row__name">
                {{ name }}
            </div>
            <div class="b-sidebar-promotion__row__show-details">
                <i class="b-icon" v-if="!toggled">add</i>
                <i class="b-icon" v-if="toggled">remove</i>
            </div>
        </div>
        <div
            class="b-sidebar-promotion__row__details"
            v-if="toggled">
            <div
                v-for="item of items"
                class="b-sidebar-promotion__row__details__item">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        name : { type: String, required: true },
        items: { type: Array, required: true },
        id   : { type: String, required: true }
    },

    data() {
        return { toggled: false };
    },

    methods: {
        toggleDetails() {
            this.toggled = !this.toggled;
        },

        remove() {
            this.items.forEach((content) => {
                this.removeItemFromBasket(content.id);
            });
        },


        ...mapActions(['removeItemFromBasket'])
    }
};
</script>

<style scoped>
@import '../main.css';

.b-sidebar-promotion {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 3px 2px color(var(--black) a(0.25));
    font-size: 18px;
    margin: 10px;
    padding: 10px;

    &:not(:first-child) {
        margin-top: 0;
    }
}

.b-sidebar-promotion__row {
    display: flex;
}

.b-sidebar-promotion__row__name {
    flex: 1;
    line-height: 30px;
}

.b-sidebar-promotion__row__show-details {
    align-items: center;
    background-color: color(var(--orange) a(0.75));
    color: #fff;
    cursor: pointer;
    display: flex;
    height: 30px;
    justify-content: center;
    line-height: 30px;
    text-align: center;
    width: 30px;
}

.b-sidebar-promotion__minus {
    background-color: var(--orange);
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
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

.b-sidebar-promotion__row__details__item {
    padding-top: 10px;
    color: color(var(--black) a(0.8));
}
</style>
