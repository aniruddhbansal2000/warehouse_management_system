// access pysical file system (read/write/open/append)
const fs = require('fs');  // FOR ADDING IMAGE

module.exports = {
// -------------------- display sale (read/write/open/append) -------------------
    getSalePage: (req, res) => {
        let query = "SELECT * FROM `sales` ORDER BY sale_id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                console.log('error');
                res.redirect('/sale');
            }
            res.render('view-sale.ejs', {
                title: "Welcome to Sales Page | View Sales",      // page title
                sales: result                             // table of players
            });
        });
    },

    

    addSalePage: (req, res) => {
        res.render('add-sale.ejs', {
            title: "Welcome to Sales | Add a new Sale",
            message: ''
        });
    },
    addSale: (req , res) =>{

        let message = '';
        let customer_id = req.body.customer_id;
        let customer_name = req.body.customer_name;
        let payment_mode = req.body.payment_mode;

        let query = "INSERT INTO `sales` (customer_id , customer_name, payment_mode) VALUES ('" +
        customer_id + "', '" + customer_name + "', '" + payment_mode + "')";
        
        db.query(query , (err , result) =>{
            if(err){

                return res.status(500).send('error');
            }
            console.log('Sale Registered');
            // let query1 = 'SELECT sale_id from `products` WHERE amount = `0`";
            db.query('SELECT sale_id FROM sales Where amount = ?' ,-10, (err , result) =>{
                if(err){
                    // return res.status(500).send('error');
                    console.log('No retrieval');
                }
                console.log('found');
                console.log(result);
                // console.log(undefined);
                if(result[0] === undefined){
                    console.log('empty');
                }
                // console.log(result[0]);
                // active_sale = result[0];
                // console.log(active_sale);
            });
            res.redirect('/sale/add/product');
        });

    },

    addSaleProductPage: (req , res) =>{
        res.render('add-sale-product.ejs' ,{
            title: "Welcome to Product Sale | Add a new Product to a Sale",
            message: ''
        });
    },

    addSaleProduct: (req , res) => {

        let message = '';
        let product_id = req.body.product_id;
        let sale_id = active_sale;
        let quantity = req.body.quantity;
        let price = req.body.price;

        console.log(sale_id);
        let query1 = "SELECT `current_stock` from `products` WHERE product_id = '" + product_id + "'";
        db.query(query1 , (err , result) =>{
            if(err){
                return res.status(500).send('error');
            }
            const have = parseInt(result);
            const need = parseInt(quantity);
            if(have < need){
                console.log('error , don\'t have enough stock');
                res.redirect('/sale/add');
            }
            let query2 = "INSERT INTO `product_sale` (product_id , sale_id, quantity, price) VALUES ('" +
                product_id + "', '" + sale_id + "', '" + quantity + "' , '" + price + "')";
                
                db.query(query2 , (err , result) =>{
                    if(err){
                        return res.status(500).send('error');
                    }
                // error (product_id / sale_id / -ve price)
                });
            console.log('Product added to sale');
            const query3 = "UPDATE `sales` SET amount = amount + '" + quantity*price + "' WHERE sale_id = '" + sale_id + "'" ;
            db.query(query3 , (err , result) =>{
                if(err){
                    res.status(500).send('error');
                }
                console.log('')    
            });
            res.redirect('/sale/add');
        });
    }
};