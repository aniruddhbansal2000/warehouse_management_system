// *************** 
// -------------------- access physical file system (read/write/open/append) -------------------
const fs = require('fs');  // FOR ADDING IMAGE

module.exports = {
    getProductPage: (req, res) => {
        let query = 'SELECT * FROM product ORDER BY product_id ASC'; // query database to get all the players
        
        db.query(query, (err, result) => {
            if (err) {
                console.log('error');
                res.redirect('/');
            }
            res.render('view-product.ejs', {
                title: "Welcome to Warehouse | View Products",      // page title
                product: result                             // table of players
            });
        });
    },

    addProductPage: (req, res) => {
        // active_sale++;
        // console.log(active_sale);
        res.render('add-product.ejs', {
            title: "Welcome to Warehouse | Add a new product",
            message: ''
        });
    },
    // have POST REQUEST from FORM , TO ADD PRODUCT
    addProduct: (req, res) => {
        // active_sale++;
        // console.log(active_sale);
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");  // no image
        }

        let message = '';
        const obj = {
            product_name : req.body.product_name,
            product_type : req.body.product_type,
            product_company : req.body.product_company,
            current_price : req.body.current_price
        
        };
        // stock DETAILS , not filled , INITIALLY 0 , then modified accordingly

        let uploadedFile = req.files.product_image;   // uploaded image
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        // *** image_name -> BASED ON UNIQUE ID
        // image_name = username + '.' + fileExtension;

        // let usernameQuery = "SELECT * FROM `products` WHERE user_name = '" + username + "'";

                // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            
                // send the product's details to the database
                let query = 'INSERT INTO product(product_name,product_type,product_company,current_price) VALUES (?)';
                db.query(query, obj, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    let query = "SELECT (@@IDENTITY)";
                    db.query(query , (err, result) =>{
                        if(!err){
                            // console.log(result);
                            let product_id = result[0]['(@@IDENTITY)'];
                            // console.log(product_id);
                            image_name = product_id + '.' + fileExtension;
                            let query = 'UPDATE products SET product_image = image_name WHERE product_id = obj.product_id';
                            
                            // upload the file to the /public/assets/img directory
                              uploadedFile.mv(`public/assets/img/${image_name}`, (err ));
            
                            db.query(query , (err, result) =>{
                                if(!err){
                                    console.log('Image added');
                                }
                            });
                        } 
                    });
                    res.redirect('/product');   // back to home page
                });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('add-product.ejs', {
                message,
                title: "Welcome to Warehouse | Add a new product"
            });
        }
    },
    editProductPage: (req, res) => {
        // active_sale++;
        // console.log(active_sale);
        let product_id = req.params.product_id;
        let query = "SELECT * FROM `products` WHERE product_id = '" + product_id + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-product.ejs', {        // render edit ejs file
                title: "Edit  Product"
                ,product: result[0]                 // first (and only) object of result array
                ,message: ''
            });
        });
    },
    editProduct: (req, res) => {
        // active_sale++;
        // console.log(active_sale);
        let product_id = req.params.product_id;
        let product_name = req.body.product_name;
        let product_type = req.body.product_type;
        let product_company = req.body.product_company;
        let current_price = req.body.current_price;
        // let uploadedFile = req.files.product_image;   // uploaded image
        // let image_name = uploadedFile.name;
        // let fileExtension = uploadedFile.mimetype.split('/')[1];


        let query = "UPDATE `products` SET `product_name` = '" + product_name + "', `product_type` = '" + product_type + "', `current_price` = '" + current_price + "', `product_company` = '" + product_company +  "' WHERE `products`.product_id = '" + product_id + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/product');
        });
    },

};
