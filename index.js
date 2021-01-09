require('dotenv').config()

const http = require('http')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const router = express.Router()

const port = process.env.PORT || 4000

app.set('port', port)

app.use(express.json())

app.use(router)

var server = http.createServer(app)
server.listen(port)

server.on('error', (e) => {
    console.log(e);
})

server.on('listening', () => {
    console.log(`Listening on port ${port}`);
})

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => {
    console.log('Connected to Database');
})
.catch(err => {
    console.log(err);
})

const UserController = require('./Controllers/User/UserController')

const Authentication = require('./Routes/Authenticator')

//const { uploadMulter } = require('./Controllers/Utilities/imageLoader')
const ProductController = require('./Controllers/Product/ProductController')
//ruta crear producto: ruta, uploadMulter.single('productImg'), metodo

//Rutas creadas para manejar informacion del usuario

app.post('/register', UserController.registerUser)
app.post('/login',UserController.login)
app.get('/currentUser', Authentication, UserController.readCurrentUser)
app.get('/getUsers', UserController.readUsers)
app.put('/update', Authentication, UserController.updateUser)
app.delete('/delete', Authentication, UserController.deleteUser)
app.post('/recovery', UserController.recoverPassword)
app.post('/handler', UserController.recoveryHandler)

//Rutas creadas para manejar informacion de los productos

app.post('/createProduct', ProductController.createProduct)
app.get('/getProduct', Authentication, ProductController.getProduct)
app.get('/getallproducts', ProductController.getAllProducts)
app.put('/updateProduct', Authentication, ProductController.updateProduct)
app.delete('/deleteProd', Authentication, ProductController.deleteProduct)
app.post('/findProduct', ProductController.findProducts)