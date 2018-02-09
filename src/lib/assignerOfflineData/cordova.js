class AssignerOfflineData {
    constructor() {
    }

    init() {
        return new Promise((resolve, reject) => {
            this.db = window.sqlitePlugin.openDatabase({
                name    : 'buckless.db',
                location: 'default'
            });

            this.db.transaction((tx) => {
                tx.executeSql('create table if not exists users (uid, name, barcode, credit)');
            }, reject, resolve);
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close(resolve, reject);
        });
    }

    empty() {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('delete from users');
            }, reject, () => {
                this.db.executeSql('vacuum', reject, resolve);
            });
        });
    }

    findByName(name) {
        return new Promise((resolve, reject) => {
            const query = 'select * from users where name like ? limit 5';

            this.db.transaction((tx) => {
                tx.executeSql(query, [ `%${name}%` ], (tx, rs) => {
                    const res = [];

                    for (let i = rs.rows.length - 1; i >= 0; i--) {
                        // we're using uid as row so that we don't interfere with primary key
                        let row = rs.rows.item(i);

                        row.id = row.uid;
                        delete row.uid;

                        res.push(rs.rows.item(i));
                    }

                    resolve(res);
                }, reject);
            }, reject);
        });
    }

    findByBarcode(barcode) {
        return new Promise((resolve, reject) => {
            const query = 'select * from users where barcode like ? limit 5';

            this.db.transaction((tx) => {
                tx.executeSql(query, [ `${barcode}%` ], (tx, rs) => {
                    const res = [];

                    for (let i = rs.rows.length - 1; i >= 0; i--) {
                        // we're using uid as row so that we don't interfere with primary key
                        let row = rs.rows.item(i);

                        row.id = row.uid;
                        delete row.uid;

                        res.push(rs.rows.item(i));
                    }

                    resolve(res);
                }, reject);
            }, reject);
        });
    }

    insert(users) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                for (let i = users.length - 1; i >= 0; i--) {
                    tx.executeSql('insert into users values (?,?,?,?)', users[i]);
                }
            }, reject, resolve);
        });
    }
}

module.exports = AssignerOfflineData;
