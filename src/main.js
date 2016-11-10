import Vue  from 'vue';

import App   from './App';
import store from './store';

window.app = new Vue({
    store,
    el    : '#app',
    render: h => h(App)
});

// Load all pictures
const assets = require.context(
  './assets',
  false,
  /\.jpg$/
);

assets.keys().map(a => assets(a));
