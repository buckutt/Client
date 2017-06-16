<template>
    <div class="b-loading">
        <div class="b-loading__icon"></div>
    </div>
</template>

<style scoped>
@import '../main';

:root {
    --loadingSize: 50px;
}

.b-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: color(var(--black) a(0.75));
}

.b-loading__icon {
    animation: spin 1s infinite linear;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
    margin: calc(50% - 25px) auto 0;
    height: var(--loadingSize);
    width: var(--loadingSize);
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
