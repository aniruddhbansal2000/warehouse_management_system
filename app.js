const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');         // extract body of http request in POST request
const mysql = require('mysql');
const path = require('path');
const app = express();

// import Product change functions
const {getProductPage , addProductPage, addProduct, editProduct, editProductPage} = require('./routes/product');
const {getSalePage , addSalePage , addSale , addSaleProductPage , addSaleProduct } = require('./routes/sale');
const port = 2000;

let active_sale = -1;
global.active_sale = active_sale;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',		
    password: 'mysql',
    database: 'test1'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
// global , all modules use it
global.db = db;

// configure  middleware(functions added bw 2 layers , EXECUTE DURING REQUEST LIFECYCLE (has access to req-res of http))
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload (for images)

// routes (also a middleware) for the app

// get(page) -> home
// app.get('/',(req,res) =>{
// 	next();
// });
app.get('/product', getProductPage);
app.get('/product/add', addProductPage);
app.get('/product/edit/:product_id', editProductPage);
// app.get('/delete/:id', deleteProduct);
app.post('/product/add', addProduct);
app.post('/product/edit/:product_id', editProduct);


app.get('/sale',getSalePage);
app.get('/sale/add', addSalePage);
app.post('/sale/add',addSale);
app.get('/sale/add/product' , addSaleProductPage);
app.post('/sale/add/product' , addSaleProduct);
// app.get('/sale/add/product', addSaleProduct);
// app.post('/sale/add', addSale);
// NO ORDER CHANGES , NO MODIFICATION
// app.get('/sales')

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});