import axios               from 'axios';
import hasEssentials       from '../../utils/offline/hasEssentials';
import AssignerOfflineData from '../../../lib/assignerOfflineData';

let assignedUsers = false;

export const updateEssentials = (store, force) => {
    return axios
        .get(`${config.api}/services/deviceEssentials`)
        .then((res) => {
            if (!store.state.auth.device.point.id || store.state.auth.seller.canAssign || force) {
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

            if (store.state.auth.seller.canAssign && !assignedUsers) {
                assignedUsers = true;

                const filterRel = [ {
                    embed   : 'meansOfLogin',
                    filters : [['type', '=', 'ticketId']],
                    required: true
                } ];

                const embed = encodeURIComponent(JSON.stringify(filterRel));

                return axios.get(`${config.api}/users?embed=${embed}`, store.getters.tokenHeaders);
            }

            return Promise.resolve(null);
        })
        .then((res) => {
            if (!res) {
                return;
            }

            const assignerOfflineData = new AssignerOfflineData();

            const users = res.data.map(user => [
                user.id,
                `${user.firstname} ${user.lastname}`,
                user.meansOfLogin[0].data,
                user.credit
            ]);

            return assignerOfflineData.init()
                .then(() => assignerOfflineData.empty())
                .then(() => assignerOfflineData.insert(users));
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
