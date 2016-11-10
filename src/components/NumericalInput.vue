<template>
    <div class="b-numerical-input">
        <div class="b-numerical-input__row">
            <button
                class="b-numerical-input__row__button"
                @click="input(1, $event)">
                1
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(2, $event)">
                2
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(3, $event)">
                3
            </button>
        </div>
        <div class="b-numerical-input__row">
            <button
                class="b-numerical-input__row__button"
                @click="input(4, $event)">
                4
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(5, $event)">
                5
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(6, $event)">
                6
            </button>
        </div>
        <div class="b-numerical-input__row">
            <button
                class="b-numerical-input__row__button"
                @click="input(7, $event)">
                7
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(8, $event)">
                8
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(9, $event)">
                9
            </button>
        </div>
        <div class="b-numerical-input__row">
            <button
                class="b-numerical-input__row__button"
                @click="clear($event)">
                <i class="b-icon">clear</i>
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="input(0, $event)">
                0
            </button>
            <button
                class="b-numerical-input__row__button"
                @click="validate($event)">
                <i class="b-icon">done</i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { value: '' };
    },

    props: {
        password: { type: Boolean, default: false }
    },

    methods: {
        input(v, e) {
            this.value += v.toString();

            e.currentTarget.blur();

            this.$emit('input', v);
            this.$emit('changed', this.value);
        },

        clear(e) {
            this.value = '';

            if (e) {
                e.currentTarget.blur();
            }

            this.$emit('clear');
            this.$emit('changed', this.value);
        },

        validate(e) {
            e.currentTarget.blur();

            this.$emit('validate', this.value);

            this.value = '';
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../main';

.b-numerical-input {
    width: 100%;
}

.b-numerical-input__row {
    display: flex;

    &:not(:first-child) {
        margin-top: 15px;
    }
}

.b-numerical-input__row__button {
    background: #fff;
    border: 1px solid rgba($black, 0.25);
    border-radius: 1px;
    cursor: pointer;
    flex: 1;
    height: 40px;
    line-height: 0;
    padding: 0;

    &:not(:first-child) {
        margin-left: 15px;
    }
}
</style>
