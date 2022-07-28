const Connection = require("./connection");

class Restaurant{
    constructor(){
        this.connection = Connection.createConnection();
        this.connection.connect((err) => {
            if(err){
                console.log(err);
            } else {
                console.log('Connect success!');
            }
        });
    }

    getAllRestaurant(){
        return new Promise((resolve, rejects) => {
            this.connection.query('select * from restaurant;', (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createRestaurant(restaurant, idUser, idCategory){
        let insertQuery = `insert into restaurant(name, operatingtime, address, iduser, idcategory) 
        values('${restaurant.name}, ${restaurant.operatingtime}, ${restaurant.address}, ${idUser}', ${idCategory};)`;
        this.connection.query(insertQuery, (err, data) => {
            if(err){
                console.log(err);
            }else{
                console.log('Create Succes!');
            }
        });        
    }

    getRestaurantById(id){
        return new Promise((resolve, rejects) => {
            let query = `select * from restaurant where id=${id}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    updateRestaurant(id, restaurant){
        let query = `update restaurant set name='${restaurant.name}', operatingtime='${restaurant.operatingtime}', address=${restaurant.address} where id=${id};`
        this.connection.query(query, (err, data)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Update success');
            }
        })
    }
}

module.exports = Restaurant;