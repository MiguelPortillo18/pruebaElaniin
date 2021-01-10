//Utilizacion del paquete npm faker que genera data aleatoria para poblar la base de datos
const faker = require('faker')

//Fs es una libreria del sistema que se encarga de generar archivos
const fs = require('fs')

//Funcion generadora de data aleatoria
function generateProducts() {

    //Arreglo que contendra todos los objetos creados asociados a los productos
    let products = []

    for( let id = 1; id <= 100; id++) {
        const SKU = faker.random.number(8)
        const name = faker.commerce.productName()
        const quantity = faker.random.number(4)
        const price = faker.commerce.price()
        const desc = faker.lorem.words(8)
        const productImg = faker.image.imageUrl()

        //Luego de validad el tipo de dato que tendra cada campo utilizando la API de Faker se procede a guardar dicha 
        //informacion en el arreglo de usuarios
        products.push({
            id: id,
            SKU: SKU,
            name: name,
            quantity: quantity,
            price: price,
            desc: desc,
            productImg: productImg
        })
    } 

    //se retorna finalmente el arreglo con todos los objetos creados
    return { data: products }
}

//Se utiliza fs para crear un archivo de tipo JSON formateado con la fake data generada para productos
const productsData = generateProducts()
fs.writeFileSync('productsData.json', JSON.stringify(generateProducts, null, "\t"))