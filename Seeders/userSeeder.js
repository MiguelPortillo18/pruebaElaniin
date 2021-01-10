const faker = require('faker')
const fs = require('fs')

function generateUsers() {

    let users = []

    for( let id = 1; id <= 100; id++) {
        const name = faker.name.firstName()
        const phone = faker.phone.phoneNumber()
        const username = faker.internet.userName()
        const birth = faker.date.past()
        const email = faker.internet.email()
        const password = faker.internet.password()

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

    return { data: users }

}

const usersData = generateUsers()
fs.writeFileSync('usersData.json', JSON.stringify(generateUsers, null, "\t"))