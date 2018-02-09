import bcrypt from 'bcryptjs';

export default (deviceSellers, credentials) => new Promise((resolve, reject) => {
    const now    = new Date();
    const seller = deviceSellers
        .find(user =>
            user.meansOfLogin.some(mol =>
                mol.data === credentials.data && mol.type === credentials.meanOfLogin
            )
        );

    if (!seller || !bcrypt.compareSync(credentials.pin, seller.pin)) {
        return reject({ response: { data: { message: 'User not found' } } });
    }

    const validRights = seller.rights
        .filter(right => new Date(right.start) <= now && new Date(right.end) >= now);

    if (validRights.length === 0) {
        return reject({ response: { data: { message: 'Not enough rights' } } });
    }

    const canSell   = validRights.some(right => right.name === 'seller');
    const canReload = validRights.some(right => right.name === 'reloader');
    const canAssign = validRights.some(right => right.name === 'assigner');

    return resolve({
        data: {
            user: {
                id       : seller.id,
                token    : null,
                firstname: seller.firstname,
                lastname : seller.lastname,
                canSell,
                canReload,
                canAssign
            }
        }
    });
});
