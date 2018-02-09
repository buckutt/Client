<template>
    <div class="b-history-modal">
        <div
            class="b-history-modal__drop"
            @click="cancelCancel"></div>
        <div class="b-history-modal__modal" v-if="!success">
            <div class="b-history-modal__modal__text">
                Approchez la carte cashless
                <span>Gardez le contact jusqu'à la validation</span>
            </div>
        </div>
        <div class="b-history-modal__modal" v-else>
            <div class="b-history-modal__modal__text">
                Transaction annulée !
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            success: false
        }
    },

    methods: {
        cancelCancel() {
            this.$emit('cancel');
        },

        ok() {
            this.success = true;
        }
    }
}
</script>

<style scoped>
@import '../main.css';

.b-history-modal__drop {
    @add-mixin modal-drop;
}

.b-history-modal__modal {
    @add-mixin modal 350px;

    font-size: 18px;
    font-weight: bold;
    padding: 30px 0;
    text-align: center;
}

.b-history-modal__modal__text > span {
    display: inline-block;
    margin: 10px 10px 0;
    font-size: 16px;
    font-weight: normal;
}
</style>
