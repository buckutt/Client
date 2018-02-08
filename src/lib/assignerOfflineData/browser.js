const Dexie = require('dexie');

class AssignerOfflineData {
    constructor() {
        this.db = new Dexie('buckless.db');
    }

    init() {
        this.db.version(1).stores({
            users: 'uid,name,barcode,credit'
        });

        return Promise.resolve();
    }

    close() {
        this.db.close();
        return Promise.resolve();
    }

    empty() {
        return this.db.users.clear();
    }

    findByName(name) {
        const reg = new RegExp(`(.*)${name}(.*)`, 'i');

        return this.db.users
            .filter(user => reg.test(user.name))
            .limit(5)
            .toArray();
    }

    findByBarcode(barcode) {
        const reg = new RegExp(`${barcode}(.*)`, 'i');

        return this.db.users
            .filter(user => reg.test(user.barcode))
            .limit(5)
            .toArray();
    }

    insert(users) {
        return this.db.users.bulkPut(users);
    }
}

module.exports = AssignerOfflineData;
