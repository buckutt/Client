/* global document, MaterialMenu */

import { $$, listenOnce, parents } from '../utils';

export default {
    methods: {
        /**
         * Shows/Hides the reload menu
         * @param  {MouseEvent} e The click event
         */
        toggleReloadMenu (e) {
            const $elem = e.currentTarget;
            e.preventDefault();
            let $menu = $elem.children[0];

            if (!$menu.classList.contains('mdl-menu__container')) {
                // Init the mdl menu
                const menu  = new MaterialMenu($menu);
                $menu.MaterialMenu = menu;
            } else {
                $menu = $menu.children[1];
            }

            // If there is a click elsewhere, just hide this menu
            listenOnce(document, 'click', () => {
                $$('.mdl-menu__container.is-visible > ul').forEach(menu => menu.MaterialMenu.hide());
            });

            $menu.MaterialMenu.toggle();
        },

        /**
         * Cancels a reload
         * @param  {Number} index The reloads position in the menu
         */
        removeReloadBasket (index) {
            const totalReload = this.totalReload;
            // Remove the detailed reload and get the amount
            // Then update totalReload
            this.totalReload = totalReload - this.detailedReloads.splice(index, 1)[0].amount;
        }
    }
};
