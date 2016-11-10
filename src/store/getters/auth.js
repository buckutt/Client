export const buyer  = state => state.auth.buyer;
export const seller = state => state.auth.seller;
export const point  = state => state.auth.device.point.name;
export const event  = state => state.auth.device.event;

export const doubleValidation = state => state.auth.device.config.doubleValidation;
export const showBuyerPicture = state => state.auth.device.config.showPicture;
export const showCategories   = state => state.auth.device.config.showCategories;

export const tokenHeaders = state => ({
    headers: {
        Authorization: `Bearer ${state.auth.seller.token}`
    }
});
