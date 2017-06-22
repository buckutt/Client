<template>
    <div class="b-sidebar-item">
        <div class="b-sidebar-item__name">
            {{ name }}
        </div>
        <div class="b-sidebar-item__count">
            {{ count }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['name', 'count']
};
<template>
    <div class="b-sidebar-item">
        <div class="b-sidebar-item__name">
            {{ name }}
        </div>
        <div class="b-sidebar-item__count">
            {{ count }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['name', 'count']
};
</script>

<style scoped>
@import '../main';

.b-sidebar-item {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 3px 2px color(var(--black) a(0.25));
    display: flex;
    font-size: 18px;
    margin: 10px;
    padding: 10px;

    &:not(:first-child) {
        margin-top: 0;
    }
}

.b-sidebar-item__name {
    flex: 1;
    line-height: 30px;
}

.b-sidebar-item__count {
    background-color: color(var(--green) a(0.75));
    color: #fff;
    height: 30px;
    line-height: 30px;
    text-align: center;
    width: 30px;
}
</style>
