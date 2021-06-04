const supertest = require('supertest');

const server = require('../app')
const Database = require('./helpers/databaseControllerTest')

const app = server.app

const api = supertest(app)

const OLD_ENV = process.env;

// const configEnvironment = () => {
//     process.env.PORT=4000
//     // process.env.DATE_FORMAT='DD-MM-YYYY HH:mm:ss'

//     process.env.APIKEY= OLD_ENV.APIKEY_TEST
//     process.env.AUTH_DOMAIN= OLD_ENV.AUTH_DOMAIN_TEST
//     process.env.PROJECT_ID= OLD_ENV.PROJECT_ID_TEST
//     process.env.STORAGE_BUCKET= OLD_ENV.STORAGE_BUCKET_TEST
//     process.env.MESSAGING_SENDER_ID= OLD_ENV.MESSAGING_SENDER_ID_TEST
//     process.env.APP_ID= OLD_ENV.APP_ID_TEST
// }

beforeAll( async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV

    // Se borra la informacion de la BD de TEST
    const database = new Database()
    await database.deleteCollection('vehicleType')
    await database.deleteCollection('vehicleParking')
    await database.deleteCollection('purse')
    
    // Se agrega data por default
    await database.createCollection('vehicleType')
});

describe('GET vehicleType', () => {
    const URL = '/api/vehicleType/getType'

    test('getType Se espera status 200', async () => {
        await api.get(URL)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('getType Si contiene data en respuesta', async () => {
        const response = await api.get(URL)
        expect(response.body.data)
    })
})

describe('POST vehicleType', () => {
    const URL = '/api/vehicleType/createType'

    const data = {
        type_name: 'CARRO',
        maximum_capacity: 5,
        current_capacity: 0
    }

    test('createType Se espera status 400 al no enviar data', async () => {
        await api.post(URL)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('createType Se valida si no deja registrar tipo existente status 200', async () => {
        await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('createType Se valida si no deja registrar tipo existente "Ya esta registrado"', async () => {
        const response = await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)

        expect(response.body.message).toBe(`Ya esta registrado '${data.type_name}'`)
    })
})

afterAll ( () => {
    process.env = OLD_ENV
    server.server.close()
})