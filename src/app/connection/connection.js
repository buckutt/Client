import OfflineRequest from '../OfflineRequest';
import config         from '../config';
import { $, q }       from '../utils';

/**
 * Checks the serie of number and do whatever it has to do (connect user or Seller)
 * @param {Vue}    vm             The vue instance
 * @param {Object} config         The configuration
 * @param {Class}  OfflineRequest The OfflineRequest module
 * @param {String} cardNumber     The number serie
 */
const checkSerie = (vm, config, OfflineRequest, cardNumber) => {
    if (!cardNumber.isCardNumber()) {
        vm.throwError('Numéro de carte étu invalide');

        return;
    }

    if (vm.sellerConnected && vm.sellerAuth && vm.userConnected && vm.inputIsForDoubleValidation) {
        console.info('Revalidating...');
        vm.revalidate(cardNumber);
    } else if (vm.sellerConnected && vm.sellerAuth) {
        console.info('User loading...');

        let molSearchIsRemoved = q({
            field: 'isRemoved',
            eq   : false
        });

        console.log(q);

        let molSearchType = q({
            field: 'type',
            eq   : 'etuId'
        });

        let molSearchData = q({
            field: 'data',
            eq   : cardNumber.trim()
        });

        let mol;
        OfflineRequest
            .get(`${config.baseURL}/meansoflogin/search` +
                 `?q[]=${molSearchIsRemoved}&q[]=${molSearchType}&q[]=${molSearchData}`)
            .then(response => {
                if (!Array.isArray(response) || response.length === 0) {
                    throw new Error('Utilisateur invalide');
                }

                mol = response[0];

                return OfflineRequest.get(`${config.baseURL}/users/${mol.userId}`);
            })
            .then(response => {
                if (!response.id) {
                    throw new Error('Utilisateur invalide');
                }

                console.info('User loaded !');
                let user = response;
                user.meansoflogin = [
                    mol
                ];
                vm.currentUser   = user;
                vm.userConnected = true;
                vm.showPicture = vm.device.showPicture;
            })
            .catch(err => {
                vm.throwError(err.message);
            });
    } else {
        console.info('Seller loading...');

        vm.sellerCardNum   = cardNumber;
        vm.sellerConnected = true;
    }
};

let connection = {};

let serie             = '';
let clearSerieTimeout = 0;

export default {
    data: {
        currentSeller  : {},
        currentUser    : {},
        sellerConnected: false,
        sellerAuth     : false,
        sellerCardNum  : '',
        userConnected  : false,
        sellerCanReload: false,
        showPicture    : false
    },
    controller: vm => {
        $('body').addEventListener('keypress', e => {
            if (vm.userConnected ||
               (vm.sellerConnected && !vm.sellerAuth) ||
                vm.error ||
                vm.startedLoading) {
                if (!vm.inputIsForDoubleValidation) {
                    return;
                }
            }

            console.log('keyPress and waiting for a user card number');

            serie += String.fromCharCode(e.which);
            console.log('Actual number : ', serie);
            clearTimeout(clearSerieTimeout);

            clearSerieTimeout = setTimeout(() => {
                checkSerie(vm, config, OfflineRequest, serie);
                console.info('Checking');
                serie = '';
            }, 1000);
        });
    }
};
