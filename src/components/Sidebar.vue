<template>
    <div class="b-sidebar">
        <div class="b-sidebar__items">
            <sidebar-reload
                v-if="reloadSum > 0"
                :amount="reloadSum"></sidebar-reload>
            <sidebar-promotion
                v-for="promotion in sidebar.promotions"
                :name="promotion.name"
                :items="promotion.items"></sidebar-promotion>
            <sidebar-item
                v-for="(count, name) in sidebar.items"
                :name="name"
                :count="count"></sidebar-item>
        </div>
        <sidebar-validate></sidebar-validate>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SidebarItem      from './Sidebar-Item';
import SidebarPromotion from './Sidebar-Promotion';
import SidebarReload    from './Sidebar-Reload';
import SidebarValidate  from './Sidebar-Validate';

export default {
    computed: mapGetters(['sidebar', 'reloadSum']),

    components: {
        SidebarItem,
        SidebarPromotion,
        SidebarReload,
        SidebarValidate
    }
};
</script>

<style lang="scss" scoped>
.b-sidebar {
    background-color: #dee2e6;
    box-shadow: inset 1px 1px 3px #919eaa;
    display: flex;
    flex-direction: column;
    width: 260px;
}

.b-sidebar__items {
    flex: 1;
}
</style>
