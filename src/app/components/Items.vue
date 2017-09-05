<template>
    <div
        :class="draggingClass"
        @mousedown="down"
        @mousemove="move"
        @mouseup="up">
        <item
            v-for="item in tabsItems"
            :item="item"
            :key="item.id"></item>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Item from './Items-Item';

export default {
    components: {
        Item
    },

    data() {
        return {
            mousedown: false,
            wasDragging: false,
            initialMousePosition: 0,
            initialScrollPosition: 0
        }
    },

    computed: {
        draggingClass() {
            let classes = { 'b-items': true }

            if (this.wasDragging) {
                Object.assign(classes,  { 'b--dragging': true })
            }

            console.log(classes);

            return classes;
        },

        ...mapGetters(['tabsItems'])
    },

    methods: {
        down(e) {
            this.mousedown = true;
            this.initialMousePosition = e.y;
            this.initialScrollPosition = this.$el.scrollTop;
        },

        move(e) {
            if (this.mousedown) {
                this.wasDragging = true;

                const dragY = this.initialMousePosition - e.y;

                this.$el.scrollTop = this.initialScrollPosition + dragY;
            }
        },

        up(e) {
            setTimeout(() => {
                this.mousedown   = false;
                this.wasDragging = false;
            }, 10);
        }
    }
};
</script>

<style scoped>
.b-items {
    align-content: flex-start;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    overflow-y: auto;
    padding: 10px;
}

@media (max-width: 768px) {
    .b-items {
        padding-top: 15px;
    }
}
</style>
