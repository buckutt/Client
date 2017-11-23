import axios from 'axios'

export const updatePoint = (store, force) => {
    return axios
        .get(config.api)
        .then((res) => {
            if (!store.getters.point || force) {
                store.dispatch('setPoint', {
                    id   : res.headers.device,
                    point: {
                        id  : res.headers.point,
                        name: res.headers.pointname
                    },
                    event: {
                        id  : res.headers.event,
                        name: res.headers.eventname
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);

            if (err.message === 'Network Error') {
                store.commit('ERROR', {
                    message: 'Server not reacheable'
                });
                return;
            }
        });
}
