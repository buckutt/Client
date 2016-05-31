/* global componentHandler, location, MaterialLayoutTab */

import Vue from 'vue';
import { $, $$ } from '../utils';

Vue.directive('inittabs', {
    /**
     * Automatically sets the first tab and material-upgrade the elements
     */
    bind () {
        this.vm.tab = 'tab-0';

        // Re enable tabs. See https://github.com/google/material-design-lite/issues/1165
        const $tabs   = $$('.mdl-layout__tab');
        const $panels = $$('.mdl-tabs__panel');
        const $layout = $('.mdl-js-layout');

        $tabs.forEach((tab, i) => {
            try {
                new MaterialLayoutTab($tabs[i], $tabs, $panels, $layout.MaterialLayout); // eslint-disable-line no-new
            } catch (e) {
                location.reload();
            }
            componentHandler.upgradeElement($tabs[i].children[0]);
        });

        try { $tabs[0].click(); } catch (e) { console.error(e); }

        Vue.nextTick(() => {
            this.vm.tab = 'tab-0';
        });
    }
});
