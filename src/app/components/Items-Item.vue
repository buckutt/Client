<template>
    <div
        class="b-item"
        :class="{ 'b-item--selected': selectedItem > 0 }"
        @click="add(item)">
        <div class="b-item__image">
            <img draggable="false" height="100%" width="100%" />
        </div>
        <div class="b-item__price">
            <currency :value="item.price.amount"></currency>
        </div>
        <div
            class="b-item__count"
            v-if="selectedItem > 0">{{ selectedItem }}</div>
        <div
            class="b-item__minus"
            v-if="selectedItem > 0"
            @click.stop="remove(item)">
        </div>
        <div class="b-item__text">{{ item.name }}</div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import Currency from './Currency';

export default {
    props: {
        item: Object
    },

    components: {
        Currency
    },

    computed: {
        selectedItem() {
            return this.$store.state.items
                .basket
                .filter(id => id === this.item.id)
                .length;
        }
    },

    methods: mapActions({
        add   : 'addItemToBasket',
        remove: 'removeItemFromBasket'
    }),

    mounted() {
        this.$el.querySelector('img').src = this.item.image;
    },

    updated() {
        this.$el.querySelector('img').src = this.item.image;
    }
};
</script>

<style scoped>
@import '../main.css';

.b-item {
    box-shadow: 0 0 2px color(var(--black) a(0.25)),
                0 2px 3px color(var(--black) a(0.25));
    border-radius: 2px;
    cursor: pointer;
    height: 150px;
    margin: 10px;
    position: relative;
    width: 150px;

    &--selected {
        border: 4px solid var(--lightblue);
    }
}

.b-item__image {
    & > img {
        &:before {
            background-image: url('../assets/placeholder.jpg');
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}

.b-item__count, .b-item__minus {
    background-color: var(--red);
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: -15px;
    text-align: center;
    top: -15px;
    width: 30px;
}

.b-item__minus {
    background-color: var(--orange);
    top: calc(50% - 15px);
    z-index: 2;

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

.b-item__text {
    background-color: rgba(255, 255, 255, 0.6);
    bottom: 0;
    height: 33px;
    line-height: 33px;
    overflow: hidden;
    padding: 0 10px;
    position: absolute;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}

.b-item__price {
    background: var(--green);
    border-bottom-right-radius: 2px;
    color: #000;
    left: 0;
    padding: 5px;
    position: absolute;
    top: 0;
}

@media (max-width: 768px) {
    .b-item {
        height: 90px;
        margin: 0;
        margin-bottom: 10px;
        width: 90px;

        &:not(:nth-child(3n + 1)) {
            margin-left: calc(10px + 10px / 3);
        }
    }

    .b-item__price {
        padding: 1px 2px;
        font-size: 14px;
    }
}
</style>
