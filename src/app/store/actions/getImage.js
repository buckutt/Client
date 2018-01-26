import axios from 'axios';
import memoize from 'lodash.memoize';

const cachedGetImage = memoize(
    (id, token) => axios
        .get(`${config.images}/image/${id}?width=100&height=100`, token)
        .then(res => res.data.image)
);

export const getImage = (store, id) => {
    const token = store.getters.tokenHeaders;

    return cachedGetImage(id, store.getters.tokenHeaders);
};
