import uniqBy from 'lodash.uniqby';

export const selectTab = ({ commit }, index) => {
    commit('CHANGE_TAB', index);
};

export const createTabs = (store) => {
    const pointId = store.state.auth.device.point.id;

    let tabs = store.state.items.items
        .map((item) => {
            const category = item.categories.find(c =>
                c.points.some(point => point.id === pointId)
            );

            if (!category) {
                return null;
            }

            return { id: category.id, name: category.name };
        })
        .filter(category => category);

    // Reverse sort
    tabs = uniqBy(tabs, 'name').sort((a, b) => b.name.localeCompare(a.name));

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
                .filter(item => item.point && item.price)
                .filter((item) => {
                    const category = item.categories.find(c => c.id === tab.id);

                    return Boolean(category);
                })
        );

    store.commit('SET_TABS_ITEMS', tabsItems);
};
