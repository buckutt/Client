import axios from 'axios';

export const getImage = (store, id) => {
    const token = store.getters.tokenHeaders;

    return axios
        .get(`${config.images}/image/${id}`, token)
        .then(res => res.data.image);
};
