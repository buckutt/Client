import { credit } from '../store/getters/items';

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
        if (state.auth.device.event.config.useCardData) {
            return 'Serveur injoignable, mode dégradé actif';
        }

        return 'Serveur injoignable';
    }

    if (error.message.startsWith('Can not reload less than')) {
        return error.message.replace('Can not reload less than', 'Rechargement minimal');
    }

    if (error.message.startsWith('Maximum exceeded')) {
        return error.message.replace('Maximum exceeded', 'Crédit maximum');
    }

    if (error.message === 'Not enough credit') {
        return `Pas assez de crédit: ${(credit(state) / 100).toFixed(2)}€`;
    }

    return error.message;
};
