const Connection = require('./connection');

class Product {
    constructor() {
        this.connection = Connection.createConnection();
        this.connection.connect((err) => {
            if (err) {
                console.log(err)
            }else {
                console.log('connect success!')
            }
        });
    };

    getAllProduct() {
        return new Promise((resolve, reject) => {
            this.connection.query(`select * from users;`, (err, data) => {
                if(err) {
                    return reject (err)
                }else {
                    return resolve (data)
                }
            });
        });
    }
}