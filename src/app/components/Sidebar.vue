<template>
    <div class="b-sidebar">
        <div class="b-sidebar__items">
            <sidebar-reload
                v-if="reloadSum > 0"
                :amount="reloadSum"></sidebar-reload>
            <sidebar-promotion
                v-for="promotion in sidebar.promotions"
                :key="promotion.id"
                :id="promotion.id"
                :name="promotion.name"
                :content="promotion.content"></sidebar-promotion>
            <sidebar-item
                v-for="item in sidebarItems"
                :key="item.id"
                :id="item.id"
                :name="item.name"
                :count="item.count"></sidebar-item>
        </div>
        <sidebar-validate></sidebar-validate>
    </div>
</template>

<script>
import countBy from 'lodash.countby';
import { mapGetters, mapState } from 'vuex';

window.countBy = countBy;

import SidebarItem      from './Sidebar-Item';
import SidebarPromotion from './Sidebar-Promotion';
import SidebarReload    from './Sidebar-Reload';
import SidebarValidate  from './Sidebar-Validate';

export default {
    computed: {
         ...mapGetters(['sidebar', 'reloadSum']),
         ...mapState(['items']),
         sidebarItems() {
            const counts = countBy(this.sidebar.items.map(item => item.id));

            return Object.keys(counts).map((id) => {
                return {
                    id: id,
                    name: this.sidebar.items.find(item => item.id === id).name,
                    count: counts[id]
                }
            });
         }
     },

    components: {
        SidebarItem,
        SidebarPromotion,
        SidebarReload,
        SidebarValidate
    }
};
</script>

<style scoped>
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

@media (max-width: 768px) {
    .b-sidebar {
        width: 0;
    }

    .b-sidebar__items {
        display: none;
    }
}
</style>
