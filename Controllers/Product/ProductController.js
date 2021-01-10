//LLamada require a la variable jwt para utilizar el paquete jwt
const jwt = require('jsonwebtoken')

//Importando el productModel que contiene la informacion para este controlador
const Product = require('../../Models/ProductModel')

//Llamadas require a los 3 metodos creados en el objeto de validacion de productos
const { createProductValidator, updateProductValidator, findProductValidator } = require('./ProductValidator')

//Creación del controller
var ProductController = {
    //Funcion asincrona para la creacion de productos
    createProduct: async function(req, res) {
        try {   
            //Proceso para validar la informacion que se ingresa
            await createProductValidator(req.body)

            //Validacion de campos de tipo unique para evitar la creacion de productos con el mismo SKU o nombre
            const verifyingUniqueFields = await Product.find({ $or: [{SKU: req.body.SKU}, {name: req.body.name}]})

            if(verifyingUniqueFields.length != 0)
                throw "This SKU or product name already exists."

            //Creacion de objeto que contendra el nuevo producto
            let product = new Product({
                SKU: req.body.SKU,
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                desc: req.body.desc,
                productImg: req.body.productImg
            })

            //Se genera un token usando jwt para los procesos de autenticacion y posterior uso en otras peticiones
            const token = jwt.sign({_id: product._id}, process.env.TOKEN_KEY_AUTH)

            //Se guarda el nuevo producto, se retorna codigo de estado exitoso y mensaje de confirmacion
            await product.save()
            return res.status(201).json({error: false, data: { _id: product._id, token: token, message: "Product created with success" } }) 
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    //Funcion asincrona para ver un producto en especifico
    getProduct: async function(req, res) {
        //Se busca con los metodos que provee el lenguaje un producto con base al id y posteriormente se retorna su informacion
        const product = await Product.findOne({_id: req.product._id})

        return res.status(200).json(product)
    },
    //Funcion asincrona para ver el listado de productos creados/registrados
    getAllProducts: async function(req, res) {
        try{
            //Proceso de paginacion de los resultados utilizando el query de la peticion
            const { page = 1, limit = 10 } = req.query

            const products = await Product.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            //variable que cuenta el numero de documentos (objetos creados)
            const counter = await Product.countDocuments()

            //Se retornan los elementos listados y paginados
            return res.status(200).json({
                totalPages: Math.ceil(counter / limit),
                currentPage: page,
                products
            })
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            return res.status(500).json({error: true, message: "There was a problem."})
        }
    },
    //Funcion asincrona para la actualizacion de productos
    updateProduct: async function(req, res) {
        try {
            //Se valida la informacion que se ingresa y que se desea actualizar
            await updateProductValidator(req.body)
                
                var actualProduct = await Product.findOne({_id: req.product._id})

                //Se buscan los productos mediante segun sus campos de tipo unique
                const findProducts = await Product.find({ $or: [{SKU: req.body.SKU}, {name: req.body.name}]})

                var verify = true

                //Se verifica que los campos unique que se desean ingresar ya se para validad o para actualizar no
                //coincidan con algunos ya existentes
                if(findProducts.length != 0)
                    findProducts.forEach( prod => {
                        if(req.product._id != prod._id)
                            if(prod.SKU == req.body.SKU || prod.name == req.body.name)
                                verify = false
                    })
                
                //Si se encuentran coincidencias se arroja mensaje que no se puede actualizar la informacion
                if(!verify)
                    throw {error: true, message: "This SKU or product name already exists"}

                //Si cumple con las validaciones se procede a crear el objeto que se actualizara
                actualProduct = {
                    SKU: req.body.SKU || actualProduct.SKU,
                    name: req.body.name || actualProduct.name,
                    quantity: req.body.quantity || actualProduct.quantity,
                    price: req.body.price || actualProduct.price,
                    desc: req.body.desc | actualProduct.desc
                }

                //De forma asincrona el producto se busca por su id y se actualiza con la nueva informacion
                //Se retornan el codigo de estado exitoso y mensaje de confirmacion
                await Product.findOneAndUpdate({_id: req.product._id}, actualProduct)

                return res.status(200).json({error: false, message: "Product updated with success"})
        } 
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong", err: err})
        }
    },
    //Funcion asincrona para la eliminar productos
    deleteProduct: async function(req, res) {
        try {
            //Utilizando los metodos que provee el lenguaje se bisca mediante el id el producto que se desa eliminar
            //se retorna finalmente codigo de estado exitoso y mensaje de confirmacion
            await Product.findOneAndDelete({ _id: req.product._id})

            return res.status(200).json({error: false, message: "Deleted with success"})
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong"})
        }
    },
    //Funcion asincrona para hacer funcionar el buscador de productos
    findProducts: async function(req, res) {
        try {
            //Se valida la informacion que se esta ingresando
            await findProductValidator(req.body)

            //Se verifica que el SKU y el nombre del producto existan para posteriormente poder retornar su informacion
            const product = (req.body.name == null) ? await Product.findOne({SKU: req.body.SKU}) : await product.findOne({name: req.body.name})
            
            //Sino se encuentra se muestra mensaje de que no se ha encontrado esa informacion en la BD
            if(!product)
                throw {error: true, message: "SKU or product name not found"}

            //Se retorna codigo de estado exitoso y la informacion requerida
            return res.status(200).json(product)
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    }
}

//Se exporta el controller
module.exports = ProductController