import Vue  from 'vue';

import App   from './App';
import store from './store';

window.app = new Vue({
    store,
    el    : '#app',
    render: h => h(App)
});

// Load all pictures/fonts
const assets = require.context(
  './assets',
  true,
  /\.jpg$/
);

assets.keys().map(a => assets(a));
