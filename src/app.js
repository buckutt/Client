/* global window, componentHandler */

// Styles

import 'material-design-lite/material.min.css';
import './styles';

import 'material-design-lite/material';
import './app/utils';
import './app/filters';

import Vue from 'vue';

const data = {
    startedLoading: false,
    config        : {}
};

const methods = {};

const values = obj => {
    if (!obj) {
        return [];
    }

    return Object.keys(obj).map(k => obj[k]);
};

const modules = [];

// articles, filterBestPrice, filterPoint
import * as articles from './app/articles';
// connection, authInput, ejecter
import * as connection from './app/connection';
// promotions, promotionsEvents
import * as promotions from './app/promotions';
// askReload, reloadMenu
import * as reloads from './app/reloads';
// doubleValidation, sendBasket
import * as sendBasket from './app/sendBasket';
import initTabs from './app/directives/initTabs';
import error from './app/error/error';
import tabs from './app/tabs/tabs';
import dataLoader from './app/dataLoader';

modules.push(...values(articles));
modules.push(...values(connection));
modules.push(...values(promotions));
modules.push(...values(reloads));
modules.push(...values(sendBasket));
modules.push(initTabs);
modules.push(error);
modules.push(tabs);
modules.push(dataLoader);

// Get only modules data
const modulesDatas   = modules.map(module => (module && module.data || {}));
const modulesMethods = modules.map(module => (module && module.methods || {}));

// Merge all of it on data
Object.assign(data, ...modulesDatas);
Object.assign(methods, ...modulesMethods);

const app = new Vue({
    el: '#main',
    data,
    methods
});

modules.forEach(module => {
    if (module && typeof module.controller === 'function') {
        module.controller(app);
    }
});

componentHandler.upgradeAllRegistered();

window.app = app;
