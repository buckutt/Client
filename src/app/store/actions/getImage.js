import axios from 'axios';

export const getImage = (store, id) => {
    const token = store.getters.tokenHeaders;

    return axios
        .get(`${config.images}/image/${id}?width=100&height=100`, token)
        .then(res => res.data.image);
};
