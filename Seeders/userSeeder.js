//Utilizacion del paquete npm faker que genera data aleatoria para poblar la base de datos
const faker = require('faker')

//Fs es una libreria del sistema que se encarga de generar archivos
const fs = require('fs')

//Funcion generadora de data aleatoria
function generateUsers() {

    //Arreglo que contendra todos los objetos creados asociados a los usuarios
    let users = []

    for( let id = 1; id <= 100; id++) {
        const name = faker.name.firstName()
        const phone = faker.phone.phoneNumber()
        const username = faker.internet.userName()
        const birth = faker.date.past()
        const email = faker.internet.email()
        const password = faker.internet.password()

        //Luego de validad el tipo de dato que tendra cada campo utilizando la API de Faker se procede a guardar dicha 
        //informacion en el arreglo de usuarios
        users.push({
            id: id,
            name: name,
            phone: phone,
            username: username,
            birth: birth,
            email: email,
            password: password
        })
    } 

    //se retorna finalmente el arreglo con todos los objetos creados
    return { data: users }
}

//Se utiliza fs para crear un archivo de tipo JSON formateado con la fake data generada para usuarios
const usersData = generateUsers()
fs.writeFileSync('usersData.json', JSON.stringify(generateUsers, null, "\t"))