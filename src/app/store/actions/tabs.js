import uniqBy from 'lodash.uniqby';

export const selectTab = ({ commit }, index) => {
    commit('CHANGE_TAB', index);
};

export const createTabs = (store) => {
    let tabs = store.state.items.items
        .map(item => item.category)
        .sort((a, b) => b.priority - a.priority);

    // Reverse sort
    tabs = uniqBy(tabs, 'name');

    if (tabs.length === 0) {
        return;
    }

    store.commit('SET_TABS', tabs);

    store.commit('CHANGE_TAB', {
        tab  : tabs[0].id,
        index: 0
    });
};

export const createTabsItems = (store) => {
    const tabsItems = store.state.ui.tabs
        .map(tab =>
            store.state.items.items
                .filter(item => (item.category.id === tab.id))
        );

    store.commit('SET_TABS_ITEMS', tabsItems);
};
