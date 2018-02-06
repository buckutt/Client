import axios         from 'axios';
import hasEssentials from '../../utils/offline/hasEssentials';

export const updateEssentials = (store, force) => {
    return axios
        .get(`${config.api}/services/deviceEssentials`)
        .then((res) => {
            if (!store.state.auth.device.point || force) {
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

            store.dispatch('setSellers', res.data);
        })
        .catch((err) => {
            console.log(err);

            if (err.message === 'Network Error') {
                if (!hasEssentials()) {
                    store.commit('ERROR', { message: 'This device doesn\'t meet the minimal requirements to run offline.' });
                    return;
                }

                return;
            }
        });
};
