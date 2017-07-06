import { credit } from '../store/getters/promotions';

export default (state, error) => {
    if (!error) {
        return null;
    }

    console.error(error);

    if (error.message === 'User not found') {
        return state.auth.seller.isAuth ? 'Client introuvable' : 'Vendeur introuvable';
    }

    if (error.message === 'Not enough rights') {
        return 'Pas de droit de vente / recharge';
    }

    if (error.message === 'Device not found') {
        return 'Équipement inconnu';
    }

    if (error.message === 'Server not reacheable') {
        return 'Server injoignable';
    }

    if (error.message.startsWith('Can not reload less than')) {
        return error.message.replace('Can not reload less than', 'Rechargement minimal');
    }

    if (error.message.startsWith('Maximum exceeded')) {
        return error.message.replace('Maximum exceeded', 'Crédit maximum');
    }

    if (error.message === 'Not enough credit') {
        return `Pas assez de crédit: ${credit(state)}€`;
    }

    return error.message;
};
