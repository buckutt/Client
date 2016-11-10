<template>
    <div class="b-loading">
        <div class="b-loading__icon"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../main';

.b-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($black, 0.75);
}

.b-loading__icon {
    $size: 50px;

    animation: spin 1s infinite linear;
    border-radius: 50%;
    border: 4px solid rgba(#fff, 0.2);
    border-top-color: #fff;
    margin: calc(50% - 25px) auto 0;
    height: $size;
    width: $size;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
       transform: rotate(360deg);
    }
}
</style>
