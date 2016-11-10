export default (state, error) => {
    if (!error) {
        return null;
    }

    console.error(error);

    if (error.message === 'User not found') {
        return state.auth.seller.isAuth ? 'Client introuvable' : 'Vendeur introuvable';
    }

    if (error.message.startsWith('Can not reload less than')) {
        return error.message.replace('Can not reload less than', 'Rechargement minimal');
    }

    if (error.message.startsWith('Maximum exceeded')) {
        return error.message.replace('Maximum exceeded', 'Crédit maximum');
    }

    return error.message;
};
