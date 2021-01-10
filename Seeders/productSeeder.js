const faker = require('faker')
const fs = require('fs')

function generateProducts() {

    let products = []

    for( let id = 1; id <= 100; id++) {
        const SKU = faker.random.number(8)
        const name = faker.commerce.productName()
        const quantity = faker.random.number(4)
        const price = faker.commerce.price()
        const desc = faker.lorem.words(8)
        const productImg = faker.image.imageUrl()

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

    return { data: products }

}

const productsData = generateProducts()
fs.writeFileSync('productsData.json', JSON.stringify(generateProducts, null, "\t"))