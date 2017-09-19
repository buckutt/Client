import axios from 'axios'

export const updatePoint = (store, force) => {
    return axios
        .get(config.api)
        // Not found error
        .catch((err) => {
            console.log(err);
            if (err.message === 'Network Error') {
                store.commit('ERROR', {
                    message: 'Server not reacheable'
                });
                return;
            }

            if (err.response && err.response.data.message === 'Device not found') {
                store.commit('ERROR', {
                    message: 'Device not found'
                });
            }

            if (!store.getters.point || force) {
                store.dispatch('setPoint', {
                    id   : err.response.headers.device,
                    point: {
                        id  : err.response.headers.point,
                        name: err.response.headers.pointname
                    },
                    event: {
                        id  : err.response.headers.event,
                        name: err.response.headers.eventname
                    }
                });
            }
        });
}
