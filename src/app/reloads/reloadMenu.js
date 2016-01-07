/* global document, MaterialMenu */

import { $$ } from '../utils';

export default {
    methods: {
        /**
         * Shows/Hides the reload menu
         * @param  {MouseEvent} e The click event
         */
        toggleReloadMenu(e) {
            let $elem = e.target;
            e.preventDefault();
            let $menu = $elem.children[0];
            let $menuContainer;

            if (!$menu.classList.contains('mdl-menu__container')) {
                // Init the mdl menu
                let menu  = new MaterialMenu($menu);
                $menu.MaterialMenu = menu;
                $menuContainer = $menu.parentElement;
                // Fix margin left not applied
                // $menuContainer.style.marginLeft = ($elem.offsetLeft - $menuContainer.offsetLeft) + 'px';
            } else {
                $menu = $menu.children[1];
                $menuContainer = $menu.parentElement;
            }

            // If there is a click elsewhere, just hide this menu
            document.once('click', () => {
                $$('.mdl-menu__container.is-visible > ul').forEach(menu => menu.MaterialMenu.hide());
            });

            $menu.MaterialMenu.toggle();
        },

        /**
         * Cancels a reload
         * @param  {Number} index The reloads position in the menu
         */
        removeReloadBasket(index) {
            let totalReload = this.totalReload;
            // Remove the detailed reload and get the amount
            // Then update totalReload
            this.totalReload = totalReload - this.detailedReloads.splice(index, 1)[0].amount;
        }
    }
};
