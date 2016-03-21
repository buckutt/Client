/* global document, MaterialMenu */

import { $$, listenOnce } from '../utils';

export default {
    methods: {
        /**
         * Revert promotions to article. Useful when removing an item possibly in a promotion
         */
        revertPromotions () {
            let newBasket = this.basket.slice();
            this.basketPromotions.forEach(promotion => {
                newBasket = newBasket.concat(promotion.contents);
            });

            this.basket           = newBasket;
            this.basketPromotions = [];
        },

        /**
         * Triggered when a dropdown is called to see promotion's content
         * @param  {MouseEvent} e The click event
         */
        onPromotionExpand (e) {
            console.info('Promotion expanding');
            const $elem = e.target;
            e.preventDefault();
            let $menu = $elem.nextElementSibling;
            let $menuContainer;

            if (!$menu.classList.contains('mdl-menu__container')) {
                // Init the mdl menu
                const menu         = new MaterialMenu($menu);
                $menu.MaterialMenu = menu;
                $menuContainer     = $menu.parentElement;
                // Fix margin left not applied
                $menuContainer.style.marginLeft = `${($elem.offsetLeft - $menuContainer.offsetLeft)}px`;
            } else {
                $menu = $menu.children[1];
                $menuContainer = $menu.parentElement;
            }

            $menu.parentElement.style.display = 'block';

            // If there is a click elsewhere, just hide this menu
            listenOnce(document, 'click', () => {
                $$('.mdl-menu__container.is-visible > ul').forEach(menu => menu.MaterialMenu.hide());
            });

            // MaterialMenu activated to $menu is now the container
            $menu.MaterialMenu.toggle();

            setTimeout(() => {
                if (!$menu.parentElement.classList.contains('is-visible')) {
                    $menu.parentElement.style.display = 'none';
                }
            }, 300);
        }
    }
};
