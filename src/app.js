'use strict';

/* global window, componentHandler */

// Styles

import './bower_components/material-design-lite/material.min.css';
import './styles';

import './bower_components/material-design-lite/material';
import './app/utils';
import filters from './app/filters';

import Vue from './bower_components/vue/dist/vue';

let data = {
    startedLoading: false,
    config        : {}
};

let methods = {};

const values = obj => {
    if (!obj) {
        return [];
    }

    return Object.keys(obj).map(k => obj[k]);
};

let modules = [];

import * as articles from './app/articles'; // articles, filterBestPrice, filterPoint
import * as connection from './app/connection'; // connection, authInput, ejecter
import * as promotions from './app/promotions'; // promotions, promotionsEvents
import * as reloads from './app/reloads'; // askReload, reloadMenu
import * as sendBasket from './app/sendBasket'; // doubleValidation, sendBasket
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
let modulesDatas   = modules.map(module => (module && module.data) ? module.data : {});
let modulesMethods = modules.map(module => (module && module.methods) ? module.methods : {});

// Merge all of it on data
Object.assign(data, ...modulesDatas);
Object.assign(methods, ...modulesMethods);

let app = new Vue({
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
