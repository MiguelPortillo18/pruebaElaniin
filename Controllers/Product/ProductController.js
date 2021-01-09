const Product = require('../../Models/ProductModel')

const { createProductValidator, updateProductValidator, findProductValidator } = require('./ProductValidator')

var ProductController = {
    createProduct: async function(req, res) {
        try {   
            //uploaderMethod(req.file, 'products')

            await createProductValidator(req.body)

            const verifyingUniqueFields = await Product.find({ $or: [{SKU: req.body.SKU}, {name: req.body.name}]})

            if(verifyingUniqueFields.length != 0)
                throw "This SKU or product name already exists."

            let product = new Product({
                SKU: req.body.SKU,
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                desc: req.body.desc,
                //productImg: req.file.location
            })

            await product.save()
            return res.status(201).json({error: false, data: { _id: product._id, message: "Product created with success" } }) 
        }
        catch(err) {
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    getProduct: async function(req, res) {
        const product = await Product.findOne({_id: req.product._id})

        return res.status(200).json(product)
    },
    getAllProducts: async function(req, res) {
        try{
            const { page = 1, limit = 10 } = req.query

            const products = await Product.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const counter = await Product.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(counter / limit),
                currentPage: page,
                products
            })
        }
        catch(err) {
            return res.status(500).json({error: true, message: "There was a problem."})
        }
    },
    updateProduct: async function(req, res) {
        try {
            await updateProductValidator(req.body)
                
                var actualProduct = await Product.findOne({_id: req.product._id})

                const findProducts = await Product.find({ $or: [{SKU: req.body.SKU}, {name: req.body.name}]})

                var verify = true

                if(findProducts.length != 0)
                    findProducts.forEach( prod => {
                        if(req.product._id != prod._id)
                            if(prod.SKU == req.body.SKU || prod.name == req.body.name)
                                verify = false
                    })

                if(!verify)
                    throw {error: true, message: "This SKU or product name already exists"}

                actualProduct = {
                    SKU: req.body.SKU || actualProduct.SKU,
                    name: req.body.name || actualProduct.name,
                    quantity: req.body.quantity || actualProduct.quantity,
                    price: req.body.price || actualProduct.price,
                    desc: req.body.desc | actualProduct.desc
                }

                await Product.findOneAndUpdate({_id: req.product._id}, actualProduct)

                return res.status(200).json({error: false, message: "Product updated with success"})
        } 
        catch(err) {
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong", err: err})
        }
    },
    deleteProduct: async function(req, res) {
        await Product.findOneAndDelete({ _id: req.body._id})

        return res.status(200).json({error: false, message: "Deleted with success"})
    },
    findProducts: async function(req, res) {
        try {
            await findProductValidator(req.body)

            const product = (req.body.SKU == null) ? await Product.findOne({SKU: req.body.SKU}) : await product.findOne({name: req.body.name})
            
            if(!product)
                throw {error: true, message: "SKU or product name not found"}

                return res.status(200).json(product)
        }
        catch(err) {
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    }
}

module.exports = ProductController