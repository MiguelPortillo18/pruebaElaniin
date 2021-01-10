//En el archivo principal se inicializan y se mandan a requerir aquellos procesos que permitiran el correcto funcionamiento
//de toda la API

//Paquetes npm a utilizar en el index.js
require('dotenv').config()

const http = require('http')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

//-------------------------------------------

//Creacion de router con express e implementacion del puerto en el que se desplegara la API de forma remota
const router = express.Router()
app.use(router)

const port = process.env.PORT || 4000

app.set('port', port)
//----------------------------------------------

//Creacion del servidor
var server = http.createServer(app)
server.listen(port)

server.on('error', (e) => {
    console.log(e);
})

server.on('listening', () => {
    console.log(`Listening on port ${port}`);
})
//---------------------------------------------------------

//Proceso de conexion a la base de datos utilizando la cadena de conexion creada en MOngoDBAtlas
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
//----------------------------------------------------

// Llamada de los controladores en el index.js para que funcionen de forma correcta, ademas de la funcion de autenticacion
const UserController = require('./Controllers/User/UserController')

const ProductController = require('./Controllers/Product/ProductController')

const Authentication = require('./Routes/Authenticator')

//-------------------------------------------------------------------------------

//Rutas creadas para el manejo de peticiones de productos

app.post('/register', UserController.registerUser)
app.post('/login',UserController.login)
app.get('/currentUser', Authentication, UserController.readCurrentUser)
app.get('/getUsers', UserController.readUsers)
app.put('/update', Authentication, UserController.updateUser)
app.delete('/delete', Authentication, UserController.deleteUser)
app.post('/recovery', UserController.recoverPassword)
app.post('/handler', UserController.recoveryHandler)

//Rutas creadas para el manejo de peticiones de productos

app.post('/createProduct', ProductController.createProduct)
app.get('/getProduct', Authentication, ProductController.getProduct)
app.get('/getallproducts', ProductController.getAllProducts)
app.put('/updateProduct', Authentication, ProductController.updateProduct)
app.delete('/deleteProd', Authentication, ProductController.deleteProduct)
app.post('/findProduct', ProductController.findProducts)