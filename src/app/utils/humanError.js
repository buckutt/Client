import { credit } from '../store/getters/items';

export default (state, error) => {
    if (!error) {
        return null;
    }

    console.error(error);

    if (error.message === 'User not found') {
        return state.auth.seller.isAuth ? 'Client introuvable' : 'Identifiants incorrects';
    }

    if (error.message === 'Couldn\'t find ticket') {
        return 'Ticket introuvable';
    }

    if (error.message === 'Invalid buyer') {
        return 'Client introuvable';
    }

    if (error.message === 'This device doesn\'t meet the minimal requirements to run offline.') {
        return 'Cet équippement ne possède pas les données minimum pour fonctionner hors-ligne.';
    }

    if (error.message === 'Duplicate Entry') {
        return state.auth.seller.canAssign ? 'Cette carte est déjà assignée' : 'Entrée déjà existante';
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
